import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../../contexts/auth-context';
import { useProjectStore } from '../../../contexts/project-store';
import { api } from '../../../services/api';
import type { Project } from '../../../types/project';
import styles from '../styles.module.css';

const DEFAULT_VISIBILITY: Record<Project['visibility'], boolean> = {
  PRIVATE: true,
  INTERNAL: true,
  PUBLIC: true,
};

const SORT_LABELS: Record<'recent' | 'name-asc' | 'name-desc', string> = {
  recent: 'En güncel',
  'name-asc': 'İsme göre (A-Z)',
  'name-desc': 'İsme göre (Z-A)',
};

type ProjectPanelProps = {
  selectedProject: Project | null;
  onSelect: (project: Project | null) => void;
  onOpenProject: (project: Project) => void;
};

export function ProjectPanel({ selectedProject, onSelect, onOpenProject }: ProjectPanelProps) {
  const { activeWorkspace } = useAuth();
  const { getProjectById, projectMap, syncWorkspaceProjects, upsertProject } = useProjectStore();
  const [projects, setProjects] = useState<Project[]>(() => {
    if (!activeWorkspace) return [];
    return Object.values(projectMap).filter(project => project.workspaceId === activeWorkspace.id);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [regenStatus, setRegenStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [openStatus, setOpenStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'recent' | 'name-asc' | 'name-desc'>('recent');
  const [visibilityFilter, setVisibilityFilter] = useState<Record<Project['visibility'], boolean>>({
    ...DEFAULT_VISIBILITY,
  });

  const loadProjects = useCallback(
    async (options?: RequestInit) => {
      if (!activeWorkspace) {
        setProjects([]);
        setIsLoading(false);
        onSelect(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.projects.list(options);
        setProjects(response.data.projects);
        syncWorkspaceProjects(activeWorkspace.id, response.data.projects);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Projeler yüklenemedi';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [activeWorkspace, onSelect, syncWorkspaceProjects]
  );

  useEffect(() => {
    if (!activeWorkspace) {
      setProjects([]);
      return;
    }

    const workspaceProjects = Object.values(projectMap).filter(
      project => project.workspaceId === activeWorkspace.id
    );
    setProjects(workspaceProjects);
  }, [activeWorkspace, projectMap]);

  useEffect(() => {
    const controller = new AbortController();
    void loadProjects({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [activeWorkspace?.id, loadProjects]);

  useEffect(() => {
    if (projects.length === 0) {
      onSelect(null);
      return;
    }

    if (selectedProject && projects.some(project => project.id === selectedProject.id)) {
      return;
    }

    const firstProject = projects[0];
    if (!firstProject) {
      onSelect(null);
      return;
    }

    const preferredProject = getProjectById(firstProject.id) ?? firstProject;
    onSelect(preferredProject);
  }, [getProjectById, onSelect, projects, selectedProject]);

  useEffect(() => {
    if (copyStatus === 'idle') return;

    const timeout = setTimeout(() => setCopyStatus('idle'), 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [copyStatus]);

  useEffect(() => {
    if (regenStatus === 'idle' || regenStatus === 'loading') return;

    const timeout = setTimeout(() => setRegenStatus('idle'), 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, [regenStatus]);

  useEffect(() => {
    if (openStatus !== 'error') return;

    const timeout = setTimeout(() => setOpenStatus('idle'), 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, [openStatus]);

  const activeProject = useMemo(() => {
    if (!selectedProject) return null;
    return projects.find(project => project.id === selectedProject.id) ?? selectedProject;
  }, [projects, selectedProject]);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return projects.filter(project => {
      const name = project.name.toLowerCase();
      const description = project.description?.toLowerCase() ?? '';
      const visibility = project.visibility.toLowerCase();
      const matchesText =
        !term || name.includes(term) || description.includes(term) || visibility.includes(term);
      const matchesVisibility = visibilityFilter[project.visibility];
      return matchesText && matchesVisibility;
    });
  }, [projects, searchTerm, visibilityFilter]);

  const sortedProjects = useMemo(() => {
    const items = [...filteredProjects];

    switch (sortOption) {
      case 'name-asc':
        items.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      case 'name-desc':
        items.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
        break;
      case 'recent':
      default:
        items.sort((a, b) => {
          const aDate = new Date(a.updatedAt ?? a.createdAt).getTime();
          const bDate = new Date(b.updatedAt ?? b.createdAt).getTime();
          return bDate - aDate;
        });
        break;
    }

    return items;
  }, [filteredProjects, sortOption]);

  const handleSelect = useCallback(
    (projectId: string) => {
      const cachedProject = getProjectById(projectId);
      const fallbackProject = projects.find(item => item.id === projectId) ?? null;
      const project = cachedProject ?? fallbackProject;
      onSelect(project ?? null);
      setCopyStatus('idle');
      setRegenStatus('idle');
    },
    [getProjectById, onSelect, projects]
  );

  const resetFilters = useCallback(() => {
    setVisibilityFilter({ ...DEFAULT_VISIBILITY });
    setSearchTerm('');
    setSortOption('recent');
  }, []);

  const visibilitySummary = useMemo(() => {
    const active = Object.entries(visibilityFilter)
      .filter(([, value]) => value)
      .map(([key]) => key.toLowerCase());

    if (active.length === Object.keys(DEFAULT_VISIBILITY).length) {
      return 'Tümü';
    }

    if (active.length === 0) {
      return 'Hiçbiri';
    }

    return active.join(', ');
  }, [visibilityFilter]);

  const hasCustomVisibility = useMemo(
    () => Object.values(visibilityFilter).some(value => !value),
    [visibilityFilter]
  );

  const hasSearchTerm = searchTerm.trim().length > 0;

  const filterSummaryChips = useMemo(() => {
    const chips: string[] = [];

    if (hasSearchTerm) {
      chips.push(`Arama: "${searchTerm.trim()}"`);
    }

    if (hasCustomVisibility) {
      chips.push(`Görünürlük: ${visibilitySummary}`);
    }

    if (sortOption !== 'recent') {
      chips.push(`Sıralama: ${SORT_LABELS[sortOption]}`);
    }

    return chips;
  }, [hasCustomVisibility, hasSearchTerm, searchTerm, sortOption, visibilitySummary]);

  const handleCopyApiKey = useCallback(() => {
    if (!activeProject) return;

    if (!navigator.clipboard) {
      setCopyStatus('error');
      return;
    }

    navigator.clipboard
      .writeText(activeProject.apiKey)
      .then(() => {
        setCopyStatus('success');
      })
      .catch(() => {
        setCopyStatus('error');
      });
  }, [activeProject]);

  const handleRegenerateApiKey = useCallback(async () => {
    if (!activeProject) return;

    setRegenStatus('loading');

    try {
      const response = await api.projects.regenerateApiKey(activeProject.id);
      const updated = response.data.project;
      setProjects(prev => prev.map(project => (project.id === updated.id ? updated : project)));
      setCopyStatus('idle');
      setRegenStatus('success');
      upsertProject(updated);
      onSelect(updated);
    } catch (err) {
      console.error('API anahtarı yenileme hatası', err);
      setRegenStatus('error');
    }
  }, [activeProject, onSelect, upsertProject]);

  const handleOpenProject = useCallback(async () => {
    if (!activeProject) return;

    setOpenStatus('loading');

    try {
      const response = await api.projects.getById(activeProject.id);
      const detailedProject = response.data.project;
      setProjects(prev => {
        const exists = prev.some(project => project.id === detailedProject.id);
        if (!exists) {
          return [...prev, detailedProject];
        }
        return prev.map(project => (project.id === detailedProject.id ? detailedProject : project));
      });
      upsertProject(detailedProject);
      onSelect(detailedProject);
      onOpenProject(detailedProject);
      setCopyStatus('idle');
      setRegenStatus('idle');
      setOpenStatus('idle');
    } catch (err) {
      console.error('Proje detayları yüklenemedi', err);
      setOpenStatus('error');
    }
  }, [activeProject, onOpenProject, onSelect, upsertProject]);

  if (!activeWorkspace) {
    return (
      <div className={styles.projectPanel}>
        <p className={styles.projectEmpty}>Bir workspace seçerek projeleri görüntüleyin.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.projectPanel}>
        <p>Projeler yükleniyor…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.projectPanel}>
        <p className={styles.projectError}>{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={styles.projectPanel}>
        <p className={styles.projectEmpty}>Bu workspace için henüz proje bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className={styles.projectPanel}>
      <header className={styles.projectHeader}>
        <div>
          <h2>Projeler</h2>
          <p className={styles.projectWorkspaceLabel}>{activeWorkspace.name}</p>
        </div>
        <button
          className={styles.projectRefresh}
          type="button"
          onClick={() => loadProjects()}
          disabled={isLoading}
        >
          Yenile
        </button>
      </header>
      <div className={styles.projectSearchRow}>
        <div className={styles.projectSearchGroup}>
          <input
            className={styles.projectSearchInput}
            type="search"
            placeholder="Proje adı veya açıklama ara"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            aria-label="Proje arama"
          />
          {searchTerm.trim().length > 0 ? (
            <button
              type="button"
              className={styles.projectSearchClear}
              onClick={() => setSearchTerm('')}
            >
              Temizle
            </button>
          ) : null}
        </div>
        <div className={styles.projectSortGroup}>
          <label className={styles.projectSortLabel} htmlFor="project-sort">
            Sırala
          </label>
          <select
            id="project-sort"
            className={styles.projectSortSelect}
            value={sortOption}
            onChange={event => setSortOption(event.target.value as typeof sortOption)}
          >
            <option value="recent">En güncel</option>
            <option value="name-asc">İsme göre (A-Z)</option>
            <option value="name-desc">İsme göre (Z-A)</option>
          </select>
        </div>
        <span className={styles.projectSearchCount}>
          {sortedProjects.length} / {projects.length}
        </span>
      </div>

      <div className={styles.projectFilterRow}>
        <fieldset className={styles.projectVisibilityFilters}>
          <legend>Görünürlük</legend>
          {(['PRIVATE', 'INTERNAL', 'PUBLIC'] as const).map(option => (
            <label key={option} className={styles.projectFilterOption}>
              <input
                type="checkbox"
                checked={visibilityFilter[option]}
                onChange={event =>
                  setVisibilityFilter(prev => ({
                    ...prev,
                    [option]: event.target.checked,
                  }))
                }
              />
              <span>{option.toLowerCase()}</span>
            </label>
          ))}
        </fieldset>
        <button type="button" className={styles.projectFilterReset} onClick={resetFilters}>
          Filtreleri sıfırla
        </button>
      </div>

      {filterSummaryChips.length > 0 ? (
        <div className={styles.projectActiveFilters}>
          <span>Aktif filtreler:</span>
          <ul className={styles.projectFilterChips}>
            {filterSummaryChips.map(chip => (
              <li key={chip} className={styles.projectFilterChip}>
                {chip}
              </li>
            ))}
          </ul>
          <button type="button" className={styles.projectFilterClear} onClick={resetFilters}>
            Tümünü temizle
          </button>
        </div>
      ) : null}

      <ul className={styles.projectList}>
        {sortedProjects.map(project => (
          <li key={project.id} className={styles.projectListItem}>
            <button
              type="button"
              className={`${styles.projectRow} ${selectedProject?.id === project.id ? styles.projectRowActive : ''}`}
              onClick={() => handleSelect(project.id)}
            >
              <div className={styles.projectRowInfo}>
                <strong>{project.name}</strong>
                <p>{project.description?.trim() || 'Açıklama mevcut değil'}</p>
              </div>
              <span className={styles.projectMeta}>
                {new Date(project.updatedAt ?? project.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {sortedProjects.length === 0 ? (
        <p className={styles.projectEmpty}>Aramanızla eşleşen proje bulunamadı.</p>
      ) : null}

      {activeProject ? (
        <aside className={styles.projectDetails} aria-live="polite">
          <h3>{activeProject.name}</h3>
          <dl>
            <div>
              <dt>Açıklama</dt>
              <dd>{activeProject.description?.trim() || 'Açıklama sağlanmamış'}</dd>
            </div>
            <div>
              <dt>Görünürlük</dt>
              <dd>{activeProject.visibility}</dd>
            </div>
            <div>
              <dt>API Anahtarı</dt>
              <dd className={styles.projectCode}>{activeProject.apiKey}</dd>
            </div>
            <div>
              <dt>Oluşturulma</dt>
              <dd>{new Date(activeProject.createdAt).toLocaleString('tr-TR')}</dd>
            </div>
            <div>
              <dt>Son Güncelleme</dt>
              <dd>
                {new Date(activeProject.updatedAt ?? activeProject.createdAt).toLocaleString(
                  'tr-TR'
                )}
              </dd>
            </div>
          </dl>
          <div className={styles.projectDetailActions}>
            <button
              type="button"
              className={styles.projectDetailButton}
              onClick={handleCopyApiKey}
              disabled={copyStatus === 'success' || regenStatus === 'loading'}
            >
              {copyStatus === 'success' ? 'API anahtarı kopyalandı' : 'API anahtarını kopyala'}
            </button>
            <button
              type="button"
              className={styles.projectDetailButtonSecondary}
              onClick={handleRegenerateApiKey}
              disabled={regenStatus === 'loading'}
            >
              {regenStatus === 'loading' ? 'Yenileniyor…' : 'API anahtarını yenile'}
            </button>
            <button
              type="button"
              className={styles.projectDetailButtonTertiary}
              onClick={() => void handleOpenProject()}
              disabled={openStatus === 'loading'}
            >
              {openStatus === 'loading' ? 'Açılıyor…' : 'Projeyi aç'}
            </button>
          </div>
          {copyStatus === 'error' ? (
            <p className={styles.projectStatusError}>
              API anahtarı kopyalanamadı, lütfen tekrar deneyin.
            </p>
          ) : null}
          {regenStatus === 'success' ? (
            <p className={styles.projectStatusSuccess}>API anahtarı başarıyla yenilendi.</p>
          ) : null}
          {regenStatus === 'error' ? (
            <p className={styles.projectStatusError}>API anahtarı yenilenirken bir hata oluştu.</p>
          ) : null}
          {openStatus === 'error' ? (
            <p className={styles.projectStatusError}>
              Proje açılırken bir hata oluştu. Lütfen tekrar deneyin.
            </p>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
