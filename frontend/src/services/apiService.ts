import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config.local';

// les lignes 4 à 7 servent à duper ESLint et TS sur l'import AxiosReponse
export const __keepTypesAlive__ = (): void => {
    const fake: [AxiosInstance?, AxiosRequestConfig?, AxiosResponse<unknown>?] = [];
    void fake;
};

const API_BASE_URL = `${config.localIp || 'http://localhost'}:8000`;
const API_TIMEOUT = 25000;


class ApiService {
	private api: AxiosInstance;
	private token: string | null = null;

// ======================= Constructeur Axios ======================= //

// création du modèle de requête de base
constructor() {
	this.api = axios.create({
    	baseURL: API_BASE_URL,
      	timeout: API_TIMEOUT,
      	headers: {
        	'Content-Type': 'application/json',
        	'Accept': 'application/json',
      		},
    	}
	);

	// si besoin token
    this.api.interceptors.request.use(
      	(config) => {
        	if (this.token) {
          	config.headers.Authorization = `Bearer ${this.token}`;
        	}
        	return config;
      	},
      	(error) => Promise.reject(error)
    );

    // si erreur 401
    this.api.interceptors.response.use(
      	(response) => response,
      	(error) => {
        	if (error.response && error.response.status === 401) {
          	this.clearToken();
        	}
        	return Promise.reject(error);
      	}
    );

// ======================= Manipulation du token ======================= //

	// Récupère le token dans le localStorage
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

  	// Vérifie si un token existe dans dans la constante "token" de la class Api
  	public isAuthenticated(): boolean {
    	return !!this.token;
  	}

// ======================= HTML ROUTER ======================= //

  // GET
  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(endpoint, config);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      throw error;
    }
  }

  // POST
  public async post<T, D = unknown>(endpoint: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`Erreur POST ${endpoint}:`, error);
      throw error;
    }
  }

  // PUT
  public async put<T, D = unknown>(endpoint: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`Erreur PUT ${endpoint}:`, error);
      throw error;
    }
  }

  // DELETE
  public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`Erreur DELETE ${endpoint}:`, error);
      throw error;
    }
  }

  // Getter pour l'instance Axios
  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

const apiService = new ApiService();
export default apiService;
