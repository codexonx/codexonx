import request from 'supertest';
import express from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject, regenerateApiKey } from './projects';
import prisma from '../lib/prisma';

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
  }
}));

describe('Projects Controller', () => {
  let app: express.Application;
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
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
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-1' });

      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          description: 'Test Description',
          userId: 'user-1'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockProject);
      expect(prisma.project.create).toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          description: 'Test Description',
          userId: 'non-existent-user'
        });

      expect(response.status).toBe(404);
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
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Project 2',
          description: 'Description 2',
          apiKey: 'key_2',
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);
    });

    it('should filter projects by userId if provided', async () => {
      const mockProjects = [{
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        apiKey: 'key_1',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }];

      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

      const response = await request(app)
        .get('/api/projects')
        .query({ userId: 'user-1' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' }
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
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);

      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProject);
    });

    it('should return 404 if project not found', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/projects/non-existent');

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
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
      });
      
      (prisma.project.update as jest.Mock).mockResolvedValue(mockUpdatedProject);

      const response = await request(app)
        .put('/api/projects/1')
        .send({
          name: 'Updated Project',
          description: 'Updated Description'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedProject);
    });

    it('should return 404 if project not found', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/projects/non-existent')
        .send({
          name: 'Updated Project'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test Project',
      });
      
      (prisma.project.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/api/projects/1');

      expect(response.status).toBe(204);
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
        apiKey: 'old_api_key',
      };
      
      const mockUpdatedProject = {
        id: '1',
        name: 'Test Project',
        apiKey: 'new_api_key',
      };

      (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
      (prisma.project.update as jest.Mock).mockResolvedValue(mockUpdatedProject);

      const response = await request(app).post('/api/projects/1/refresh-key');

      expect(response.status).toBe(200);
      expect(response.body.apiKey).toBe('new_api_key');
      expect(response.body.apiKey).not.toBe('old_api_key');
    });

    it('should return 404 if project not found', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/projects/non-existent/refresh-key');

      expect(response.status).toBe(404);
    });
  });
});
