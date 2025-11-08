import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import prisma from '../lib/prisma';

import { AppError } from './errorHandler';

type WorkspaceIdentifier = { id: string; type: 'id' } | { slug: string; type: 'slug' } | null;

const resolveWorkspaceIdentifier = (req: Request): WorkspaceIdentifier => {
  const idHeader = req.headers['x-workspace-id'];
  if (typeof idHeader === 'string' && idHeader.trim()) {
    return { id: idHeader.trim(), type: 'id' };
  }

  const slugHeader = req.headers['x-workspace-slug'];
  if (typeof slugHeader === 'string' && slugHeader.trim()) {
    return { slug: slugHeader.trim(), type: 'slug' };
  }

  return null;
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Giriş yapmadınız. Lütfen giriş yapın.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as any;

    // Check if user still exists and load memberships
    const userWithMemberships = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        ownedWorkspaces: true,
        workspaceMemberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!userWithMemberships) {
      return next(new AppError("Bu token'a sahip kullanıcı artık mevcut değil.", 401));
    }

    const workspaceIdentifier = resolveWorkspaceIdentifier(req);

    type MembershipWithWorkspace = (typeof userWithMemberships.workspaceMemberships)[number];
    type OwnedWorkspace = (typeof userWithMemberships.ownedWorkspaces)[number];

    const membershipSummaries: UserWorkspaceSummary[] = [];

    if (userWithMemberships.workspaceMemberships) {
      membershipSummaries.push(
        ...userWithMemberships.workspaceMemberships.map(
          (membership: MembershipWithWorkspace): UserWorkspaceSummary => ({
            id: membership.workspaceId,
            name: membership.workspace.name,
            slug: membership.workspace.slug,
            role: membership.role,
            plan: membership.workspace.plan,
          })
        )
      );
    }

    if (userWithMemberships.ownedWorkspaces) {
      membershipSummaries.push(
        ...userWithMemberships.ownedWorkspaces.map(
          (workspace: OwnedWorkspace): UserWorkspaceSummary => ({
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            role: 'OWNER',
            plan: workspace.plan,
          })
        )
      );
    }

    const activeWorkspace = workspaceIdentifier
      ? membershipSummaries.find(workspace => {
          if (workspaceIdentifier.type === 'id') {
            return workspace.id === workspaceIdentifier.id;
          }
          return workspace.slug === workspaceIdentifier.slug;
        })
      : undefined;

    if (workspaceIdentifier && !activeWorkspace) {
      return next(new AppError('Bu workspace üzerinde yetkiniz bulunmuyor.', 403));
    }

    // Grant access to protected route with context
    req.user = {
      id: userWithMemberships.id,
      email: userWithMemberships.email,
      role: userWithMemberships.role,
      workspaces: membershipSummaries,
      activeWorkspace,
    };

    next();
  } catch (_error) {
    return next(new AppError('Geçersiz token. Lütfen tekrar giriş yapın.', 401));
  }
};

// Middleware to restrict access to admin only
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Giriş yapmadınız. Lütfen giriş yapın.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bu işlemi gerçekleştirmek için yetkiniz yok.', 403));
    }

    next();
  };
};

export const requireWorkspaceRole = (...roles: WorkspaceRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Giriş yapmadınız. Lütfen giriş yapın.', 401));
    }

    if (!req.user.activeWorkspace) {
      return next(new AppError('Bir workspace seçmeniz gerekiyor.', 400));
    }

    if (!roles.includes(req.user.activeWorkspace.role)) {
      return next(new AppError('Bu workspace üzerinde yetkiniz yok.', 403));
    }

    next();
  };
};
