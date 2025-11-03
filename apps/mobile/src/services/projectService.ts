import { API_BASE_URL } from '@config/constants';
import { handleApiError } from '@utils/apiHelpers';
import { getAuthToken } from '@utils/storage';

// Proje tipi
export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tasks?: Task[];
}

// Görev tipi
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  projectId: string;
}

// Proje oluşturma parametreleri
export interface CreateProjectParams {
  title: string;
  description: string;
  status?: string;
}

// Proje güncelleme parametreleri
export interface UpdateProjectParams {
  title?: string;
  description?: string;
  status?: string;
}

// Tüm projeleri getir
export const getProjects = async (limit?: number): Promise<Project[]> => {
  try {
    const token = await getAuthToken();
    let url = `${API_BASE_URL}/projects`;
    
    if (limit) {
      url += `?limit=${limit}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw await handleApiError(response);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Projeler getirilirken hata:', error);
    
    // Gerçek API çalışmadığında simülasyon verileri dön
    return generateMockProjects(limit || 10);
  }
};

// Proje detaylarını getir
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw await handleApiError(response);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${id} ID'li proje getirilirken hata:`, error);
    
    // Gerçek API çalışmadığında simülasyon veri dön
    const mockProjects = generateMockProjects(10);
    const project = mockProjects.find(p => p.id === id);
    
    if (!project) {
      throw new Error('Proje bulunamadı');
    }
    
    return {
      ...project,
      tasks: generateMockTasks(project.id, 5),
    };
  }
};

// Yeni proje oluştur
export const createProject = async (params: CreateProjectParams): Promise<Project> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw await handleApiError(response);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Proje oluşturulurken hata:', error);
    throw error;
  }
};

// Projeyi güncelle
export const updateProject = async (id: string, params: UpdateProjectParams): Promise<Project> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw await handleApiError(response);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Proje güncellenirken hata:', error);
    throw error;
  }
};

// Projeyi sil
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw await handleApiError(response);
    }
  } catch (error) {
    console.error('Proje silinirken hata:', error);
    throw error;
  }
};

// Mock veri oluşturma fonksiyonları (Gerçek API yokken geliştirme için)
function generateMockProjects(count: number): Project[] {
  const statuses = ['active', 'pending', 'completed'];
  return Array.from({ length: count }).map((_, i) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 7));
    
    return {
      id: `proj-${i + 1}`,
      title: `Proje ${i + 1}`,
      description: `Bu, ${i + 1} numaralı test projesidir. Buraya proje açıklaması gelecek.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      userId: 'user-1',
    };
  });
}

function generateMockTasks(projectId: string, count: number): Task[] {
  const statuses = ['todo', 'in_progress', 'done'];
  return Array.from({ length: count }).map((_, i) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14));
    
    return {
      id: `task-${projectId}-${i + 1}`,
      title: `Görev ${i + 1}`,
      description: `Bu, ${projectId} projesi için ${i + 1} numaralı test görevidir.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dueDate: dueDate.toISOString(),
      projectId,
    };
  });
}
