import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@navigation/RootNavigator';
import { useAuthStore } from '@store/authStore';
import { getProjects } from '@services/projectService';

// Tip tanımları
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Proje arayüzü
interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  updatedAt: string;
}

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalApiCalls: 0,
    pendingTasks: 0
  });
  
  // Projeleri yükle
  useEffect(() => {
    fetchProjects();
  }, []);

  // Projeleri getir
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects(5); // Sadece son 5 projeyi al
      setProjects(data);

      // İstatistikleri güncelle
      const activeCount = data.filter(p => p.status === 'active').length;
      
      // Simüle edilmiş istatistikler
      setStats({
        activeProjects: activeCount,
        totalApiCalls: Math.floor(Math.random() * 10000) + 5000,
        pendingTasks: Math.floor(Math.random() * 20) + 5
      });
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Yenileme işlemi
  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  // Proje detay sayfasına git
  const navigateToProject = (project: Project) => {
    navigation.navigate('ProjectDetail', {
      id: project.id,
      title: project.title
    });
  };

  const renderProjects = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      );
    }

    if (projects.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('projects.noProjects')}</Text>
        </View>
      );
    }

    return projects.map((project) => (
      <TouchableOpacity
        key={project.id}
        style={styles.projectCard}
        onPress={() => navigateToProject(project)}
      >
        <View style={styles.projectHeader}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <View
            style={[
              styles.statusBadge,
              project.status === 'active'
                ? styles.activeStatus
                : project.status === 'completed'
                ? styles.completedStatus
                : styles.pendingStatus,
            ]}
          >
            <Text style={styles.statusText}>
              {project.status === 'active'
                ? t('projects.active')
                : project.status === 'completed'
                ? t('projects.completed')
                : t('projects.pending')}
            </Text>
          </View>
        </View>
        <Text style={styles.projectDescription} numberOfLines={2}>
          {project.description}
        </Text>
        <Text style={styles.updatedText}>
          {t('projects.updatedAt')}: {new Date(project.updatedAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {t('common.hello')}, {user?.name || t('common.user')}!
          </Text>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeProjects}</Text>
            <Text style={styles.statLabel}>{t('dashboard.activeProjects')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {stats.totalApiCalls.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>{t('dashboard.apiCalls')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pendingTasks}</Text>
            <Text style={styles.statLabel}>{t('dashboard.pendingTasks')}</Text>
          </View>
        </View>

        {/* Son Projeler */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.recentProjects')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
            <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.projectsContainer}>{renderProjects()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4f46e5',
  },
  projectsContainer: {
    marginBottom: 16,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#dcfce7',
  },
  completedStatus: {
    backgroundColor: '#dbeafe',
  },
  pendingStatus: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  updatedText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

export default HomeScreen;
