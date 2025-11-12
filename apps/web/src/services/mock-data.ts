export type MockProject = {
  id: string;
  name: string;
  template: 'nextjs' | 'fastapi' | 'express';
  lastActivity: string;
  status: 'active' | 'deploying' | 'failed';
  workspaceId: string;
};

export type MockRunLog = {
  id: string;
  projectId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
};

export type MockAgentThread = {
  id: string;
  projectId: string;
  role: 'architect' | 'reviewer' | 'tester';
  lastMessage: string;
  updatedAt: string;
  workspaceId: string;
};

export type MockProjectFile = {
  id: string;
  projectId: string;
  path: string;
  language: 'typescript' | 'javascript' | 'python' | 'markdown';
  content: string;
  isEntry?: boolean;
};

export const mockProjects: MockProject[] = [
  {
    id: 'proj_orbit',
    name: 'Orbit Labs Trading Desk',
    template: 'nextjs',
    lastActivity: '2025-11-11T16:40:00.000Z',
    status: 'active',
    workspaceId: 'ws_orbit',
  },
  {
    id: 'proj_neural',
    name: 'NeuralWorks Ops Console',
    template: 'fastapi',
    lastActivity: '2025-11-10T13:24:00.000Z',
    status: 'deploying',
    workspaceId: 'ws_neural',
  },
  {
    id: 'proj_atlas',
    name: 'Atlas Industries Compliance Hub',
    template: 'express',
    lastActivity: '2025-11-09T09:12:00.000Z',
    status: 'failed',
    workspaceId: 'ws_atlas',
  },
];

export const mockRunLogs: MockRunLog[] = [
  {
    id: 'log_1',
    projectId: 'proj_orbit',
    timestamp: '2025-11-11T16:39:12.000Z',
    level: 'info',
    message: 'Deployment pipeline triggered by CI (main branch).',
  },
  {
    id: 'log_2',
    projectId: 'proj_orbit',
    timestamp: '2025-11-11T16:39:45.000Z',
    level: 'warn',
    message: 'Cold start detected for inference worker shard-eu-west-1.',
  },
  {
    id: 'log_3',
    projectId: 'proj_neural',
    timestamp: '2025-11-10T13:26:02.000Z',
    level: 'info',
    message: 'Integration tests passed (24 suites / 24).',
  },
];

export const mockAgentThreads: MockAgentThread[] = [
  {
    id: 'thread_1',
    projectId: 'proj_orbit',
    role: 'architect',
    lastMessage: 'Refactor pipeline to use reusable integration step.',
    updatedAt: '2025-11-11T15:58:00.000Z',
    workspaceId: 'ws_orbit',
  },
  {
    id: 'thread_2',
    projectId: 'proj_neural',
    role: 'tester',
    lastMessage: 'Queueing synthetic data validation before production deploy.',
    updatedAt: '2025-11-10T13:28:15.000Z',
    workspaceId: 'ws_neural',
  },
];

export const mockProjectFiles: MockProjectFile[] = [
  {
    id: 'file_orbit_app',
    projectId: 'proj_orbit',
    path: 'src/app/dashboard-widget.tsx',
    language: 'typescript',
    isEntry: true,
    content: `import { useState, useEffect } from 'react';

type Props = {
  name: string;
};

export function DashboardWidget({ name }: Props) {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setVisits(count => count + 1), 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="rounded-xl border border-white/10 bg-background/70 p-6">
      <h2 className="text-lg font-semibold text-foreground">{name}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Visits today: {visits}</p>
    </section>
  );
}
`,
  },
  {
    id: 'file_orbit_docs',
    projectId: 'proj_orbit',
    path: 'docs/README.md',
    language: 'markdown',
    content: `# Orbit Labs Trading Desk

- Stack: Next.js + Tailwind CSS
- Realtime analytics with Supabase
- Deployed across 3 regions
`,
  },
  {
    id: 'file_neural_api',
    projectId: 'proj_neural',
    path: 'app/main.py',
    language: 'python',
    isEntry: true,
    content: `from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
async def health_check():
    return {"status": "ok", "latency": 12}


@app.post("/deploy")
async def deploy_pipeline(payload: dict):
    return {"message": "Deployment scheduled", "payload": payload}
`,
  },
  {
    id: 'file_neural_worker',
    projectId: 'proj_neural',
    path: 'workers/synthetic.py',
    language: 'python',
    content: `import asyncio


async def run_validation(dataset: str):
    await asyncio.sleep(2)
    return {"dataset": dataset, "status": "ok"}


async def main():
    result = await run_validation("ops-metrics")
    print('[worker]', result)


if __name__ == '__main__':
    asyncio.run(main())
`,
  },
  {
    id: 'file_atlas_server',
    projectId: 'proj_atlas',
    path: 'server/index.js',
    language: 'javascript',
    isEntry: true,
    content: `import express from 'express';

const app = express();

app.use(express.json());

app.get('/status', (_req, res) => {
  res.json({ ok: true, version: '1.0.0' });
});

app.post('/logs', (req, res) => {
  console.log('[stub-log]', req.body);
  res.status(201).json({ stored: true });
});

app.listen(3333, () => {
  console.log('Express stub server running on port 3333');
});
`,
  },
  {
    id: 'file_atlas_config',
    projectId: 'proj_atlas',
    path: 'config/policies.md',
    language: 'markdown',
    content: `# Compliance Policies

1. SOC-2 monitoring is active for all services.
2. Access logs retained for 190 days.
3. Deployment approvals require dual sign-off.
`,
  },
];
