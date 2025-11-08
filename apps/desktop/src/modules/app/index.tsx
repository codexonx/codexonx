import { useMemo } from 'react';

import { AppProvider, useAppContext } from '../../contexts/app-context';
import { useAuth } from '../../contexts/auth-context';
import { ProjectStoreProvider } from '../../contexts/project-store';
import { useProjectDetails } from '../../hooks/use-project-details';

import { LoginPanel } from './components/login-panel';
import { ProjectPanel } from './components/project-panel';
import { ProjectWorkspace } from './components/project-workspace';
import { WorkspaceList } from './components/workspace-list';
import styles from './styles.module.css';

function AppContent() {
  const { user, isLoading, logout } = useAuth();
  const { selectedProject, setSelectedProject, openProject, backToDashboard, viewMode } =
    useAppContext();
  const {
    project: detailedProject,
    status: detailsStatus,
    error: detailsError,
    refetch: refetchDetails,
  } = useProjectDetails(selectedProject?.id ?? null);

  const statusBadge = useMemo(() => (user ? 'Beta' : 'Erken Erişim'), [user]);

  const activeProject = detailedProject ?? selectedProject;

  if (isLoading) {
    return (
      <div className={styles.authWrapper}>
        <div className={styles.loadingCard}>
          <span className={styles.loadingSpinner} aria-hidden />
          <p>Oturum durumunuz kontrol ediliyor…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.authWrapper}>
        <LoginPanel />
      </div>
    );
  }

  if (viewMode === 'project' && activeProject) {
    return (
      <div className={styles.container}>
        <ProjectWorkspace
          project={activeProject}
          detailsStatus={detailsStatus}
          detailsError={detailsError}
          onRetryDetails={refetchDetails}
          onBack={backToDashboard}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.badge}>{statusBadge}</span>
        <h1>Hoş geldin, {user.name ?? user.email}</h1>
        <p>Masaüstü AI kod editörünüzle tüm workspace’lerinizi buradan yönetin.</p>
        <div className={styles.userMeta}>
          <span>{user.email}</span>
          <button className={styles.logoutButton} type="button" onClick={logout}>
            Çıkış yap
          </button>
        </div>
      </header>

      <main className={styles.dashboardGrid}>
        <section className={styles.panel} aria-label="Workspace listesi">
          <header className={styles.panelHeader}>
            <h2>Workspaceler</h2>
            <p className={styles.panelSubtext}>Çalışmak istediğiniz alanı seçin.</p>
          </header>
          <WorkspaceList />
        </section>

        <section className={styles.panel} aria-label="Workspace projeleri">
          <ProjectPanel
            selectedProject={selectedProject}
            onSelect={setSelectedProject}
            onOpenProject={openProject}
          />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          Bu build temel Tauri altyapısını içerir. Workspace senkronizasyonu ve AI servis
          entegrasyonu bir sonraki iterasyonda eklenecek.
        </p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ProjectStoreProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ProjectStoreProvider>
  );
}
