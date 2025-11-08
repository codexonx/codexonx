import type { WorkspacePlan } from './workspace';

export type ProjectVisibility = 'PRIVATE' | 'INTERNAL' | 'PUBLIC';

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  workspaceId: string;
  createdById?: string | null;
  visibility: ProjectVisibility;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
  workspace?: {
    id: string;
    name: string;
    slug: string;
    plan: WorkspacePlan;
    description?: string | null;
  };
};
