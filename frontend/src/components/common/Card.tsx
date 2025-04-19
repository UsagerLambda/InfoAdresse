import React from 'react';
import { AddressSearchResult } from '../../services/api';

interface SearchResultsProps {
  result: AddressSearchResult | null;
  visible: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ result, visible }) => {
  if (!visible || !result) return null;

  return (
    <section className="results active">
      <div className="result-header">
        <h2>Résultats pour <span id="result-address">{result.adresse_normalisee}</span></h2>
        <a href="#" className="btn-outline">Enregistrer</a>
      </div>
      
      <div className="result-sections">
        <div className="result-section">
          <h3>Informations générales</h3>
          <div className="result-item">
            <span className="result-item-label">Adresse normalisée</span>
            <span className="result-item-value">{result.adresse_normalisee}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Ville</span>
            <span className="result-item-value">{result.ville}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Code postal</span>
            <span className="result-item-value">{result.code_postal}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Pays</span>
            <span className="result-item-value">{result.pays}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Population</span>
            <span className="result-item-value">{result.population} habitants</span>
          </div>
        </div>
        
        <div className="result-section">
          <h3>Coordonnées</h3>
          <div className="result-item">
            <span className="result-item-label">Longitude</span>
            <span className="result-item-value">{result.longitude}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Latitude</span>
            <span className="result-item-value">{result.latitude}</span>
          </div>
        </div>
        
        <div className="result-section">
          <h3>Informations cadastrales</h3>
          <div className="result-item">
            <span className="result-item-label">Feuille</span>
            <span className="result-item-value">{result.feuille}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Section</span>
            <span className="result-item-value">{result.section}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Numéro</span>
            <span className="result-item-value">{result.numero}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Superficie</span>
            <span className="result-item-value">{result.m2} m²</span>
          </div>
        </div>
        
        <div className="result-section">
          <h3>Plan Local d'Urbanisme</h3>
          <div className="result-item">
            <span className="result-item-label">Zone</span>
            <span className="result-item-value">{result.zone}</span>
          </div>
          <div className="result-item">
            <span className="result-item-label">Description</span>
            <span className="result-item-value">{result.libelong}</span>
          </div>
        </div>
        
        <div className="result-section">
          <h3>Risques naturels</h3>
          {result.risques_naturels.length > 0 ? (
            result.risques_naturels.map((risque, index) => (
              <div key={index} className="risk-item">{risque}</div>
            ))
          ) : (
            <div className="risk-item">Aucun risque naturel recensé</div>
          )}
          <a href={result.georisques_url} className="georisques-link" target="_blank" rel="noopener noreferrer">
            Consulter le dossier complet sur Géorisques
          </a>
        </div>
        
        <div className="result-section">
          <h3>Risques industriels</h3>
          {result.risques_industrielles.length > 0 ? (
            result.risques_industrielles.map((risque, index) => (
              <div key={index} className="risk-item">{risque}</div>
            ))
          ) : (
            <div className="risk-item">Aucun risque industriel recensé</div>
          )}
          <a href={result.georisques_url} className="georisques-link" target="_blank" rel="noopener noreferrer">
            Consulter le dossier complet sur Géorisques
          </a>
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
