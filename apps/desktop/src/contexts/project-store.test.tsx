import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import type { Project } from '../types/project';

import { ProjectStoreProvider, useProjectById, useProjectStore } from './project-store';

let idCounter = 0;

const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: overrides.id ?? `project-${++idCounter}`,
  name: overrides.name ?? 'Test Project',
  description: overrides.description ?? 'Test Description',
  workspaceId: overrides.workspaceId ?? 'workspace-1',
  createdById: overrides.createdById ?? 'user-1',
  visibility: overrides.visibility ?? 'PRIVATE',
  apiKey: overrides.apiKey ?? 'test-api-key',
  createdAt: overrides.createdAt ?? new Date().toISOString(),
  updatedAt: overrides.updatedAt ?? new Date().toISOString(),
  workspace: overrides.workspace ?? {
    id: 'workspace-1',
    name: 'Workspace One',
    slug: 'workspace-one',
    plan: 'PRO',
    description: 'Workspace description',
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <ProjectStoreProvider>{children}</ProjectStoreProvider>
);

describe('ProjectStore', () => {
  beforeEach(() => {
    idCounter = 0;
  });

  it('upserts a single project and retrieves it by id', () => {
    const project = createProject({ id: 'project-1' });

    const { result } = renderHook(
      () => {
        const store = useProjectStore();
        const fetched = useProjectById(project.id);
        return { store, fetched };
      },
      { wrapper }
    );

    expect(result.current.fetched).toBeNull();

    act(() => {
      result.current.store.upsertProject(project);
    });

    expect(result.current.store.projectMap[project.id]).toEqual(project);
    expect(result.current.store.projects).toHaveLength(1);
    expect(result.current.fetched).toEqual(project);
  });

  it('upserts multiple projects, updates existing entries, and removes them', () => {
    const first = createProject({ id: 'first-project' });
    const second = createProject({ id: 'second-project' });

    const { result } = renderHook(() => useProjectStore(), { wrapper });

    act(() => {
      result.current.upsertProjects([first, second]);
    });

    expect(result.current.projects).toHaveLength(2);
    expect(result.current.projectMap[first.id]).toEqual(first);
    expect(result.current.projectMap[second.id]).toEqual(second);

    const updatedFirst = { ...first, name: 'Updated Project Name' };

    act(() => {
      result.current.upsertProjects([updatedFirst]);
    });

    expect(result.current.projectMap[first.id]).toEqual(updatedFirst);
    expect(result.current.projects).toHaveLength(2);

    act(() => {
      result.current.removeProject(second.id);
    });

    expect(result.current.projectMap[second.id]).toBeUndefined();
    expect(result.current.projects).toHaveLength(1);

    act(() => {
      result.current.clear();
    });

    expect(result.current.projects).toHaveLength(0);
    expect(result.current.projectMap).toEqual({});
  });

  it('syncs workspace scoped projects while preserving other workspaces', () => {
    const workspaceAInitial = createProject({ id: 'workspace-a-1', workspaceId: 'workspace-a' });
    const workspaceARemoved = createProject({
      id: 'workspace-a-removed',
      workspaceId: 'workspace-a',
    });
    const workspaceBProject = createProject({ id: 'workspace-b-1', workspaceId: 'workspace-b' });
    const workspaceAReplacement = createProject({
      id: 'workspace-a-1',
      workspaceId: 'workspace-a',
      name: 'Updated Workspace A Project',
    });

    const { result } = renderHook(() => useProjectStore(), { wrapper });

    act(() => {
      result.current.upsertProjects([workspaceAInitial, workspaceARemoved, workspaceBProject]);
    });

    act(() => {
      result.current.syncWorkspaceProjects('workspace-a', [workspaceAReplacement]);
    });

    expect(result.current.projectMap[workspaceAReplacement.id]).toEqual(workspaceAReplacement);
    expect(result.current.projectMap[workspaceARemoved.id]).toBeUndefined();
    expect(result.current.projectMap[workspaceBProject.id]).toEqual(workspaceBProject);
    expect(result.current.projects).toHaveLength(2);
  });

  it('returns null for non-existent project ids', () => {
    const { result } = renderHook(() => useProjectById('unknown-project'), { wrapper });

    expect(result.current).toBeNull();
  });
});
