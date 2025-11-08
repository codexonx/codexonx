export type WorkspacePlan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  plan: WorkspacePlan;
  role: WorkspaceRole;
};
