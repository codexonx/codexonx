import type { WorkspaceSummary } from '@/types/workspace';

export const DEFAULT_WORKSPACES: WorkspaceSummary[] = [
  { id: 'ws_orbit', slug: 'orbit-labs', name: 'Orbit Labs', plan: 'Pro' },
  { id: 'ws_neural', slug: 'neuralworks', name: 'NeuralWorks Ops', plan: 'Enterprise' },
  { id: 'ws_atlas', slug: 'atlas-industries', name: 'Atlas Industries', plan: 'Starter' },
];
