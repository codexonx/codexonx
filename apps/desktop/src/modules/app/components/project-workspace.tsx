import type { ProjectDetailsStatus } from '../../../hooks/use-project-details';
import type { Project } from '../../../types/project';
import styles from '../styles.module.css';

type ProjectWorkspaceProps = {
  project: Project;
  detailsStatus?: ProjectDetailsStatus;
  detailsError?: string | null;
  onRetryDetails?: () => Promise<void> | void;
  onBack: () => void;
};

export function ProjectWorkspace({
  project,
  onBack,
  detailsStatus = 'idle',
  detailsError,
  onRetryDetails,
}: ProjectWorkspaceProps) {
  const workspace = project.workspace;
  const isLoadingDetails = detailsStatus === 'loading';
  const hasDetailsError = detailsStatus === 'error';

  const workspaceName = workspace?.name ?? (isLoadingDetails ? 'Yükleniyor…' : 'Bilinmiyor');
  const workspaceMeta = workspace
    ? `Plan: ${workspace.plan} · Slug: ${workspace.slug}`
    : isLoadingDetails
      ? 'Workspace bilgileri yükleniyor…'
      : hasDetailsError
        ? (detailsError ?? 'Workspace bilgileri alınamadı')
        : 'Workspace bilgileri alınamadı';

  return (
    <div className={styles.workspaceShell}>
      <header className={styles.workspaceHeader}>
        <div>
          <button className={styles.workspaceBackButton} type="button" onClick={onBack}>
            ← Workspacelere dön
          </button>
          <h1>{project.name}</h1>
          <p className={styles.workspaceMetaText}>
            {project.description?.trim() || 'Açıklama sağlanmamış'}
          </p>
          {isLoadingDetails ? (
            <p className={styles.workspaceDetailsStatus}>Proje detayları yükleniyor…</p>
          ) : null}
          {hasDetailsError ? (
            <div className={styles.workspaceDetailsError} role="alert">
              <span>{detailsError ?? 'Proje detayları alınamadı.'}</span>
              {onRetryDetails ? (
                <button
                  className={styles.workspaceRetryButton}
                  type="button"
                  onClick={() => {
                    void onRetryDetails();
                  }}
                  disabled={isLoadingDetails}
                >
                  Tekrar dene
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className={styles.workspaceMetaBox}>
          <div className={styles.workspaceMetaItem}>
            <span className={styles.workspaceMetaLabel}>Workspace</span>
            <span className={styles.workspaceMetaValue}>{workspaceName}</span>
            <span className={styles.workspaceMetaSub}>{workspaceMeta}</span>
          </div>
          <div className={styles.workspaceMetaItem}>
            <span className={styles.workspaceMetaLabel}>API anahtarı</span>
            <code>{project.apiKey}</code>
          </div>
          <div className={styles.workspaceMetaItem}>
            <span className={styles.workspaceMetaLabel}>Görünürlük</span>
            <span className={styles.workspaceMetaValue}>{project.visibility.toLowerCase()}</span>
          </div>
        </div>
      </header>

      <main className={styles.workspaceBody}>
        <section className={styles.workspacePrimary}>
          <header>
            <h2>AI Kod Editörü</h2>
            <p>Tauri içindeki Monaco tabanlı editör burada yer alacak.</p>
          </header>
          <div className={styles.workspaceEditorPlaceholder}>
            <p>
              Kod editörü bileşeni hazırlanırken, proje dosyaları ve AI destekli refactor
              aksiyonları bu alanda görünecek.
            </p>
            <button type="button" className={styles.workspacePrimaryAction} disabled>
              Editörü Başlat (yakında)
            </button>
          </div>
        </section>

        <aside className={styles.workspaceSidebar}>
          <section className={styles.workspaceCard}>
            <h3>Workspace Detayları</h3>
            {workspace ? (
              <dl className={styles.workspaceDetailsList}>
                <div>
                  <dt>Ad</dt>
                  <dd>{workspace.name}</dd>
                </div>
                <div>
                  <dt>Plan</dt>
                  <dd>{workspace.plan}</dd>
                </div>
                <div>
                  <dt>Slug</dt>
                  <dd>{workspace.slug}</dd>
                </div>
                <div>
                  <dt>Açıklama</dt>
                  <dd>{workspace.description?.trim() || 'Açıklama sağlanmamış'}</dd>
                </div>
              </dl>
            ) : (
              <p>Workspace bilgileri yükleniyor. Lütfen birazdan tekrar deneyin.</p>
            )}
          </section>

          <section className={styles.workspaceCard}>
            <h3>Agent Görevleri</h3>
            <p>
              Otomatik test, refactor ve deploy görevleri burada listelenecek. Agent akışlarını
              bağlamak için API tasarımı bir sonraki sprint’te tamamlanacak.
            </p>
          </section>

          <section className={styles.workspaceCard}>
            <h3>Terminal & Log</h3>
            <p>
              Runtime logları, build çıktıları ve hata raporları canlı olarak takip edilecek.
              Şimdilik bu alan placeholder olarak tutuluyor.
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}
