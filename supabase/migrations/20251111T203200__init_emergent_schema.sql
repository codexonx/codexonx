-- Supabase migration: Emergent-style collaborative workspace schema
-- Generated on 2025-11-11

begin;

-- ── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ── Custom Types ───────────────────────────────────────────────────────────
create type workspace_plan as enum ('FREE', 'PRO', 'ENTERPRISE');
create type workspace_role as enum ('OWNER', 'ADMIN', 'MEMBER');
create type project_visibility as enum ('PRIVATE', 'INTERNAL', 'PUBLIC');
create type run_status as enum ('QUEUED', 'RUNNING', 'PASSED', 'FAILED');
create type ai_agent_role as enum ('ARCHITECT', 'REVIEWER', 'TUTOR');

-- ── Tables ─────────────────────────────────────────────────────────────────

-- Workspaces
create table if not exists public.workspaces (
    id uuid primary key default uuid_generate_v4(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    slug text not null unique,
    description text,
    plan workspace_plan not null default 'FREE',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists workspaces_owner_idx on public.workspaces(owner_id);

-- Workspace members
create table if not exists public.workspace_members (
    id uuid primary key default uuid_generate_v4(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    member_id uuid not null references auth.users(id) on delete cascade,
    role workspace_role not null default 'MEMBER',
    invited_by uuid references auth.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (workspace_id, member_id)
);

create index if not exists workspace_members_member_idx on public.workspace_members(member_id);

-- Projects
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    name text not null,
    slug text not null,
    description text,
    visibility project_visibility not null default 'PRIVATE',
    created_by uuid references auth.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (workspace_id, slug)
);

create index if not exists projects_workspace_idx on public.projects(workspace_id);

-- Project files
create table if not exists public.project_files (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    path text not null,
    content text,
    language text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    last_modified_by uuid references auth.users(id),
    unique (project_id, path)
);

create index if not exists project_files_project_idx on public.project_files(project_id);

-- Project file versions (history)
create table if not exists public.project_file_versions (
    id uuid primary key default uuid_generate_v4(),
    file_id uuid not null references public.project_files(id) on delete cascade,
    version_number integer not null,
    content text not null,
    created_by uuid references auth.users(id),
    created_at timestamptz not null default now(),
    unique (file_id, version_number)
);

-- Project runs
create table if not exists public.project_runs (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    triggered_by uuid references auth.users(id),
    status run_status not null default 'QUEUED',
    started_at timestamptz,
    finished_at timestamptz,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists project_runs_project_idx on public.project_runs(project_id);

-- Run logs
create table if not exists public.run_logs (
    id uuid primary key default uuid_generate_v4(),
    run_id uuid not null references public.project_runs(id) on delete cascade,
    level text not null,
    message text not null,
    metadata jsonb default '{}'::jsonb,
    timestamp timestamptz not null default now()
);

create index if not exists run_logs_run_idx on public.run_logs(run_id);

-- AI threads
create table if not exists public.ai_threads (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    created_by uuid references auth.users(id),
    title text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists ai_threads_project_idx on public.ai_threads(project_id);

-- AI messages
create table if not exists public.ai_messages (
    id uuid primary key default uuid_generate_v4(),
    thread_id uuid not null references public.ai_threads(id) on delete cascade,
    author_role ai_agent_role not null,
    content text not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists ai_messages_thread_idx on public.ai_messages(thread_id);

-- User preferences (for active workspace, theme etc.)
create table if not exists public.user_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    active_workspace_id uuid references public.workspaces(id),
    editor_settings jsonb default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_files enable row level security;
alter table public.project_file_versions enable row level security;
alter table public.project_runs enable row level security;
alter table public.run_logs enable row level security;
alter table public.ai_threads enable row level security;
alter table public.ai_messages enable row level security;
alter table public.user_preferences enable row level security;

-- Helper function to check membership
create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace
      and wm.member_id = auth.uid()
  ) or exists (
    select 1
    from public.workspaces w
    where w.id = target_workspace
      and w.owner_id = auth.uid()
  );
$$;

-- Policies
create policy "Workspace owners or members can view workspace" on public.workspaces
  for select using (
    owner_id = auth.uid() or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspaces.id
        and wm.member_id = auth.uid()
    )
  );

create policy "Workspace owners can update workspace" on public.workspaces
  for update using (owner_id = auth.uid());

create policy "Workspace owners can delete workspace" on public.workspaces
  for delete using (owner_id = auth.uid());

create policy "Owners and admins manage members" on public.workspace_members
  using (public.is_workspace_member(workspace_id))
  with check (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.member_id = auth.uid()
        and wm.role in ('OWNER', 'ADMIN')
    )
    or exists (
      select 1 from public.workspaces w
      where w.id = workspace_members.workspace_id
        and w.owner_id = auth.uid()
    )
  );

create policy "Members can view membership" on public.workspace_members
  for select using (public.is_workspace_member(workspace_id));

create policy "Members can manage projects" on public.projects
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "Members can manage files" on public.project_files
  using (public.is_workspace_member(
    (select p.workspace_id from public.projects p where p.id = project_files.project_id)
  ))
  with check (public.is_workspace_member(
    (select p.workspace_id from public.projects p where p.id = project_files.project_id)
  ));

create policy "Members can view file versions" on public.project_file_versions
  for select using (
    public.is_workspace_member(
      (select pf.project_id from public.project_files pf where pf.id = project_file_versions.file_id)
    )
  );

create policy "Members can manage runs" on public.project_runs
  using (public.is_workspace_member(
    (select p.workspace_id from public.projects p where p.id = project_runs.project_id)
  ))
  with check (public.is_workspace_member(
    (select p.workspace_id from public.projects p where p.id = project_runs.project_id)
  ));

create policy "Members can view run logs" on public.run_logs
  for select using (
    public.is_workspace_member(
      (select p.workspace_id
       from public.projects p
       join public.project_runs r on r.project_id = p.id
       where r.id = run_logs.run_id)
    )
  );

create policy "Members can manage AI threads" on public.ai_threads
  using (public.is_workspace_member(
    (select project.workspace_id from public.projects project where project.id = ai_threads.project_id)
  ))
  with check (public.is_workspace_member(
    (select project.workspace_id from public.projects project where project.id = ai_threads.project_id)
  ));

create policy "Members can manage AI messages" on public.ai_messages
  using (public.is_workspace_member(
    (select project.workspace_id
     from public.projects project
     join public.ai_threads thread on thread.project_id = project.id
     where thread.id = ai_messages.thread_id)
  ))
  with check (public.is_workspace_member(
    (select project.workspace_id
     from public.projects project
     join public.ai_threads thread on thread.project_id = project.id
     where thread.id = ai_messages.thread_id)
  ));

create policy "Users manage their preferences" on public.user_preferences
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

commit;
