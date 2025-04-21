import React from 'react';
import { AddressSearchResult } from '../../../services/index';

interface ResultFormProps {
  result?: AddressSearchResult | null;
  visible?: boolean;
}

const ResultForm: React.FC<ResultFormProps> = ({ result, visible = false }) => {
  if (!visible || !result) {
    return null;
  }

  return (
    <div>
      <h3>Résultat de la recherche</h3>
      <div>
        <p><strong>Adresse :</strong> {result.adresse_normalisee}</p>
        <p><strong>Ville :</strong> {result.ville}</p>
        <p><strong>Code postal :</strong> {result.code_postal}</p>
        <p><strong>Pays :</strong> {result.pays}</p>
        <p><strong>Coordonnées :</strong> {result.latitude}, {result.longitude}</p>
        <p><strong>Surface :</strong> {result.m2} m²</p>
        <p><strong>Population :</strong> {result.population} habitants</p>
        <p><strong>Zone :</strong> {result.zone}</p>

        {result.risques_naturels.length > 0 && (
          <div>
            <p><strong>Risques naturels :</strong></p>
            <ul>
              {result.risques_naturels.map((risque, index) => (
                <li key={index}>{risque}</li>
              ))}
            </ul>
          </div>
        )}
        
        {result.risques_industrielles.length > 0 && (
          <div>
            <p><strong>Risques industriels :</strong></p>
            <ul>
              {result.risques_industrielles.map((risque, index) => (
                <li key={index}>{risque}</li>
              ))}
            </ul>
          </div>
        )}
        
        <p>
          <a href={result.georisques_url} target="_blank" rel="noopener noreferrer">
            Voir plus de détails sur Géorisques
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResultForm;
