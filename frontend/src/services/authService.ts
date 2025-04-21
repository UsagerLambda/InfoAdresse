import apiService from './apiService';

// ======================= Interfaces ======================= //
export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UpdateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  old_password: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  history: string[];
  is_admin?: boolean;
}

class AuthService {
  // Connexion utilisateur
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await apiService.getAxiosInstance().post<LoginResponse>('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      apiService.setToken(response.data.access_token);
      this.getCurrentUser()
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  // Inscription utilisateur
  public async register(userData: RegisterRequest): Promise<User> {
    return apiService.post<User>('/api/v1/auth/register', userData);
  }

  // Suppression de compte
  public async deleteAccount(): Promise<void> {
    try {
      const userId = localStorage.getItem('id')
      await apiService.delete(`/api/v1/auth/delete/${userId}`);
      this.logout();
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  }

  // Récupère l'utilisateur courant
public async getCurrentUser(): Promise<User> {
    const infos = apiService.get<User>('/api/v1/auth/me');
    	localStorage.setItem('first_name', (await infos).first_name);
		localStorage.setItem('last_name', (await infos).last_name);
	  	localStorage.setItem('email', (await infos).email);
	  	localStorage.setItem('id', (await infos).id);
    return infos;
}

  // Ajoute un élément à l'historique
  public async addToHistory(item: string): Promise<void> {
    try {
      const userId = localStorage.getItem('id')
      await apiService.post(`/api/v1/auth/history_add/${userId}`, { history_item: item });
    } catch (error) {
      console.error('Erreur lors de l\'ajout à l\'historique:', error);
      throw error;
    }
  }

  // Déconnexion
  public logout(): void {
    apiService.clearToken();
  }

  // Récupère le profil utilisateur
  public async getUserProfile(): Promise<User> {
    return apiService.get<User>('/api/v1/protected');
  }

  // Met à jour le profil utilisateur
  public async updateUserProfile(data: Partial<UpdateRequest>): Promise<void> {
    try {
      const userId = localStorage.getItem('id')
      return apiService.put<void>(`/api/v1/auth/update/${userId}`, data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  // Vérifie si l'utilisateur est authentifié
  public isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }
}

const authService = new AuthService();
export default authService;
