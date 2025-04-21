import apiService from './apiService';

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

class AddressService {
  public async searchAddress(query: string): Promise<AddressSearchResult> {
    return apiService.get<AddressSearchResult>('/search', {
      params: { q: query }
    });
  }
}

const addressService = new AddressService();
export default addressService;
