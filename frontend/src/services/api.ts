import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// les lignes 4 à 7 servent à duper ESLint et TS sur l'import AxiosReponse
export const __keepTypesAlive__ = (): void => {
    const fake: [AxiosInstance?, AxiosRequestConfig?, AxiosResponse<unknown>?] = [];
    void fake;
  };

const API_BASE_URL = 'http://localhost:8000';
const API_TIMEOUT = 15000;

// Interface reponse recherche d'adresse
export interface AddressSearchResult {
  adresse_normalisee: string;
  ville: string;
  code_postal: number;
  pays: string;
  longitude: number;
  latitude: number;
  feuille: string;
  section: string;
  numero: string;
  m2: number;
  population: number;
  zone: string;
  libelong: string;
  risques_naturels: string[];
  risques_industrielles: string[];
  georisques_url: string;
}

// Interfaces login
export interface LoginRequest {
  username: string; // email
  password: string;
}

// Interface reponse login
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Interface register
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Interface Utilisateur
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

// Classe principale pour l'API
class Api {
  private api: AxiosInstance;
  private token: string | null = null;

  // Crée un modèle de requête de base
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Intercepte une requête pour y ajouter un token si nécessaire
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur la réponse si erreur 401
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );

    // Récupérer le token stocké dans le LocalStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      this.setToken(storedToken);
    }
  }

  // Ajoute le token dans le localeStorage
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Supprime le token du localeStorage
  public clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Vérifie si un token existe dans dans la Class Api (true si le token existe, false si ce n'est pas le cas (!! convertie une valeur en booléen))
  public isAuthenticated(): boolean {
    return !!this.token;
  }

  // Méthode GET générique
  private async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      throw error;
    }
  }

  // Méthode POST générique
  private async post<T, D = unknown>(endpoint: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`Erreur POST ${endpoint}:`, error);
      throw error;
    }
  }

  // Endpoints d'authentification
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await this.api.post<LoginResponse>('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.setToken(response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  public async register(userData: RegisterRequest): Promise<User> {
    return this.post<User>('/api/v1/auth/register', userData);
  }

  public async getCurrentUser(): Promise<User> {
    return this.get<User>('/api/v1/auth/me');
  }

  public logout(): void {
    this.clearToken();
  }

  // Endpoint de recherche d'adresse
  public async searchAddress(query: string): Promise<AddressSearchResult> {
    return this.get<AddressSearchResult>('/search', {
      params: { q: query }
    });
  }

  // Endpoints protégés (nécessitent une authentification)
  public async getUserProfile(): Promise<User> {
    return this.get<User>('/api/v1/protected');
  }

  public async updateUserProfile(data: Partial<RegisterRequest>): Promise<void> {
    const userId = await this.getCurrentUser().then(user => user.id);
    return this.post<void>(`/api/v1/auth/update/${userId}`, data);
  }
}

// Exporter une instance singleton de l'API
const api = new Api();
export default api;
