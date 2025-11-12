-- Enable required extensions
create extension if not exists \ pgcrypto\;
create extension if not exists \uuid-ossp\;

-- Workspaces
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  plan text default 'free',
  logo_url text,
  created_at timestamptz default now()
);

create index idx_workspaces_slug on workspaces(slug);

-- Workspace members
create table workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid not null,
  role text default 'member',
  joined_at timestamptz default now(),
  invited_by uuid,
  unique (workspace_id, user_id)
);

create index idx_workspace_members_user on workspace_members(user_id);

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  slug text not null,
  name text not null,
  template text,
  visibility text default 'private',
  repo_url text,
  active_branch text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (workspace_id, slug)
);

create index idx_projects_workspace on projects(workspace_id);

-- Project files
create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  path text not null,
  content text,
  checksum text,
  version integer default 1,
  last_updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (project_id, path)
);

create index idx_project_files_project on project_files(project_id);

-- File versions
create table project_file_versions (
  id uuid primary key default gen_random_uuid(),
  file_id uuid references project_files(id) on delete cascade,
  version integer not null,
  content text,
  diff text,
  created_at timestamptz default now(),
  author_id uuid
);

create index idx_file_versions_file on project_file_versions(file_id);

-- Project runs
create table project_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  initiated_by uuid,
  status text default 'queued',
  run_type text,
  branch text,
  commit_sha text,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz,
  duration_ms integer,
  metadata jsonb default '{}'::jsonb
);

create index idx_project_runs_project on project_runs(project_id);
create index idx_project_runs_status on project_runs(status);

-- Run logs
create table run_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references project_runs(id) on delete cascade,
  timestamp timestamptz default now(),
  level text default 'info',
  message text,
  metadata jsonb default '{}'::jsonb
);

create index idx_run_logs_run on run_logs(run_id);

-- AI threads
create table ai_threads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text,
  agent_role text,
  status text default 'open',
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_ai_threads_project on ai_threads(project_id);

-- AI messages
create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references ai_threads(id) on delete cascade,
  sender text not null,
  content text,
  tokens_used integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_ai_messages_thread on ai_messages(thread_id);

-- Workspace settings
create table workspace_settings (
  workspace_id uuid references workspaces(id) on delete cascade,
  key text,
  value jsonb,
  primary key (workspace_id, key)
);

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  workspace_id uuid references workspaces(id) on delete cascade,
  type text,
  payload jsonb default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index idx_notifications_user on notifications(user_id);

-- Audit logs
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  workspace_id uuid references workspaces(id) on delete cascade,
  action text,
  target text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_audit_logs_workspace on audit_logs(workspace_id);

-- Billing usage
create table billing_usage (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  run_seconds integer default 0,
  ai_tokens integer default 0,
  storage_mb numeric default 0,
  created_at timestamptz default now(),
  unique (workspace_id, period_start, period_end)
);

-- Webhooks
create table webhooks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  url text not null,
  secret text,
  event_types text[] default '{}',
  created_at timestamptz default now(),
  last_triggered_at timestamptz
);

create index idx_webhooks_workspace on webhooks(workspace_id);

--------------------------------------------------------------------------------
-- Row Level Security
--------------------------------------------------------------------------------

alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table projects enable row level security;
alter table project_files enable row level security;
alter table project_runs enable row level security;
alter table run_logs enable row level security;
alter table ai_threads enable row level security;
alter table ai_messages enable row level security;

create policy select_workspaces on workspaces
  for select using (exists (
    select 1 from workspace_members m
    where m.workspace_id = workspaces.id and m.user_id = auth.uid()
  ));

create policy manage_workspaces on workspaces
  for update using (auth.uid() in (
    select user_id from workspace_members
    where workspace_id = workspaces.id and role in ('owner','admin')
  ));

create policy select_workspace_members on workspace_members
  for select using (workspace_id in (
    select workspace_id from workspace_members where user_id = auth.uid()
  ));

create policy manage_workspace_members on workspace_members
  for all using (auth.uid() in (
    select user_id from workspace_members
    where workspace_id = workspace_members.workspace_id and role in ('owner','admin')
  ));

create policy select_projects on projects
  for select using (
    projects.workspace_id in (
      select workspace_id from workspace_members where user_id = auth.uid()
    )
  );

create policy manage_project on projects
  for all using (auth.uid() in (
    select user_id from workspace_members
    where workspace_id = projects.workspace_id and role in ('owner','admin')
  ));

create policy select_project_files on project_files
  for select using (
    project_id in (
      select id from projects
      where workspace_id in (
        select workspace_id from workspace_members where user_id = auth.uid()
      )
    )
  );

create policy modify_project_files on project_files
  for insert using (auth.uid() in (
    select user_id from workspace_members
    where workspace_id in (
      select workspace_id from projects where id = project_files.project_id
    ) and role != 'viewer'
  ))
  with check (auth.uid() in (
    select user_id from workspace_members
    where workspace_id in (
      select workspace_id from projects where id = project_files.project_id
    ) and role != 'viewer'
  ));

create policy select_project_runs on project_runs
  for select using (
    project_id in (
      select id from projects
      where workspace_id in (
        select workspace_id from workspace_members where user_id = auth.uid()
      )
    )
  );

create policy select_run_logs on run_logs
  for select using (
    run_id in (
      select id from project_runs
      where project_id in (
        select id from projects
        where workspace_id in (
          select workspace_id from workspace_members where user_id = auth.uid()
        )
      )
    )
  );

create policy select_ai_threads on ai_threads
  for select using (
    workspace_id in (
      select workspace_id from workspace_members where user_id = auth.uid()
    )
  );

create policy select_ai_messages on ai_messages
  for select using (
    thread_id in (
      select id from ai_threads
      where workspace_id in (
        select workspace_id from workspace_members where user_id = auth.uid()
      )
    )
  );
