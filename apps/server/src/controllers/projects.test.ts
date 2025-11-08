import express, { json } from 'express';
import request from 'supertest';

import prisma from '../lib/prisma';

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  regenerateApiKey,
} from './projects';

// Mock prisma client
jest.mock('../lib/prisma', () => ({
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}));

describe('Projects Controller', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(json());
    app.use((req, _res, next) => {
      req.user = {
        id: 'test-user',
        email: 'test@example.com',
        role: 'USER',
        workspaces: [
          {
            id: 'workspace-1',
            name: 'Workspace One',
            slug: 'workspace-one',
            role: 'OWNER',
            plan: 'PRO',
          },
        ],
        activeWorkspace: {
          id: 'workspace-1',
          name: 'Workspace One',
          slug: 'workspace-one',
          role: 'OWNER',
          plan: 'PRO',
        },
      };
      next();
    });
    app.post('/api/projects', createProject);
    app.get('/api/projects', getProjects);
    app.get('/api/projects/:id', getProject);
    app.put('/api/projects/:id', updateProject);
    app.delete('/api/projects/:id', deleteProject);
    app.post('/api/projects/:id/refresh-key', regenerateApiKey);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        apiKey: 'test_api_key',
        workspaceId: 'workspace-1',
        visibility: 'PRIVATE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);

      const response = await request(app).post('/api/projects').send({
        name: 'Test Project',
        description: 'Test Description',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          project: {
            id: mockProject.id,
            name: mockProject.name,
            description: mockProject.description,
            apiKey: mockProject.apiKey,
            workspaceId: mockProject.workspaceId,
            visibility: mockProject.visibility,
            createdAt: mockProject.createdAt.toISOString(),
            updatedAt: mockProject.updatedAt.toISOString(),
            createdById: undefined,
          },
        },
      });
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test Project',
          description: 'Test Description',
          workspaceId: 'workspace-1',
        }),
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/projects').send({});

      expect(response.status).toBe(400);
    });
  });

  describe('getProjects', () => {
    it('should return all projects', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Project 1',
          description: 'Description 1',
          apiKey: 'key_1',
          workspaceId: 'workspace-1',
          visibility: 'PRIVATE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Project 2',
          description: 'Description 2',
          apiKey: 'key_2',
          workspaceId: 'workspace-1',
          visibility: 'PRIVATE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        results: mockProjects.length,
        data: {
          projects: mockProjects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            apiKey: project.apiKey,
            workspaceId: project.workspaceId,
            visibility: project.visibility,
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
            createdById: undefined,
          })),
        },
      });
    });

    it('should query projects scoped to active workspace', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Project 1',
          description: 'Description 1',
          apiKey: 'key_1',
          workspaceId: 'workspace-1',
          visibility: 'PRIVATE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { workspaceId: 'workspace-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getProjectById', () => {
    it('should return a project by id', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        apiKey: 'test_api_key',
        workspaceId: 'workspace-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        workspace: {
          id: 'workspace-1',
          name: 'Workspace One',
          slug: 'workspace-one',
          plan: 'PRO',
          description: 'Test Workspace',
        },
      };

      (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          project: {
            id: mockProject.id,
            name: mockProject.name,
            description: mockProject.description,
            apiKey: mockProject.apiKey,
            workspaceId: mockProject.workspaceId,
            createdAt: mockProject.createdAt.toISOString(),
            updatedAt: mockProject.updatedAt.toISOString(),
            workspace: mockProject.workspace,
          },
        },
      });
    });

    it('should return 404 if project not found', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/projects/non-existent');

      expect(response.status).toBe(404);
    });

    it('should return 404 if project belongs to different workspace', async () => {
      const mockProject = {
        id: '2',
        name: 'Other Project',
        description: 'Other Description',
        apiKey: 'other_api_key',
        workspaceId: 'workspace-2',
        createdAt: new Date(),
        updatedAt: new Date(),
        workspace: {
          id: 'workspace-2',
          name: 'Workspace Two',
          slug: 'workspace-two',
          plan: 'FREE',
          description: null,
        },
      };

      (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);

      const response = await request(app).get('/api/projects/2');

      expect(response.status).toBe(404);
    });
  });

  describe('updateProject', () => {
    it('should update a project successfully', async () => {
      const mockUpdatedProject = {
        id: '1',
        name: 'Updated Project',
        description: 'Updated Description',
        apiKey: 'test_api_key',
        workspaceId: 'workspace-1',
        visibility: 'PRIVATE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        workspaceId: 'workspace-1',
        visibility: 'PRIVATE',
      });

      (prisma.project.update as jest.Mock).mockResolvedValue(mockUpdatedProject);

      const response = await request(app).put('/api/projects/1').send({
        name: 'Updated Project',
        description: 'Updated Description',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          project: {
            id: mockUpdatedProject.id,
            name: mockUpdatedProject.name,
            description: mockUpdatedProject.description,
            apiKey: mockUpdatedProject.apiKey,
            workspaceId: mockUpdatedProject.workspaceId,
            visibility: mockUpdatedProject.visibility,
            createdAt: mockUpdatedProject.createdAt.toISOString(),
            updatedAt: mockUpdatedProject.updatedAt.toISOString(),
            createdById: undefined,
          },
        },
      });
    });

    it('should return 404 if project not found', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).put('/api/projects/non-existent').send({
        name: 'Updated Project',
      });

      expect(response.status).toBe(404);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test Project',
        workspaceId: 'workspace-1',
      });

      (prisma.project.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/api/projects/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return 404 if project not found', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/projects/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('refreshApiKey', () => {
    it('should refresh API key successfully', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        apiKey: 'old_api_key',
        workspaceId: 'workspace-1',
        visibility: 'PRIVATE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        apiKey: 'new_api_key',
        workspaceId: 'workspace-1',
        visibility: 'PRIVATE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
      (prisma.project.update as jest.Mock).mockResolvedValue(mockUpdatedProject);

      const response = await request(app).post('/api/projects/1/refresh-key');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          project: {
            id: mockUpdatedProject.id,
            name: mockUpdatedProject.name,
            description: mockUpdatedProject.description,
            apiKey: mockUpdatedProject.apiKey,
            workspaceId: mockUpdatedProject.workspaceId,
            visibility: mockUpdatedProject.visibility,
            createdAt: mockUpdatedProject.createdAt.toISOString(),
            updatedAt: mockUpdatedProject.updatedAt.toISOString(),
            createdById: undefined,
          },
        },
      });
      expect(response.body.data.project.apiKey).not.toBe(mockProject.apiKey);
    });

    it('should return 404 if project not found', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/projects/non-existent/refresh-key');

      expect(response.status).toBe(404);
    });
  });
});
