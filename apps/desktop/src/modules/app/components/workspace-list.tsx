import { useAuth } from '../../../contexts/auth-context';
import styles from '../styles.module.css';

export function WorkspaceList() {
  const { workspaces, activeWorkspace, selectWorkspace } = useAuth();

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className={styles.workspaceEmpty}>
        <h3>Henüz workspace verisi bulunamadı</h3>
        <p>Web uygulamasında bir workspace oluşturduğunuzda burada listelenecektir.</p>
      </div>
    );
  }

  return (
    <div className={styles.workspaceList}>
      {workspaces.map(workspace => (
        <article
          key={workspace.id}
          className={`${styles.workspaceCard} ${
            activeWorkspace?.id === workspace.id ? styles.workspaceCardActive : ''
          }`}
        >
          <div className={styles.workspaceHeading}>
            <div>
              <h3>{workspace.name}</h3>
              <p className={styles.workspaceMeta}>{workspace.slug}</p>
            </div>
            <span className={styles.workspaceBadge}>{workspace.plan}</span>
          </div>
          <p className={styles.workspaceMeta}>Rolünüz: {workspace.role}</p>
          <button
            className={styles.workspaceButton}
            type="button"
            onClick={() => selectWorkspace(workspace.id)}
          >
            {activeWorkspace?.id === workspace.id ? 'Seçili Workspace' : 'Workspace&#39;i seç'}
          </button>
        </article>
      ))}
    </div>
  );
}
