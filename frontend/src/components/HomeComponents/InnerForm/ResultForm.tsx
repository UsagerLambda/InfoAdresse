import React, {useState} from 'react';
import { AddressSearchResult } from '../../../services/index';
import bus from '../../../assets/bus.svg';
import cycle from '../../../assets/bicycle.svg';
import global from '../../../assets/globe-earth.svg';


interface ResultFormProps {
	result?: AddressSearchResult | null;
	visible?: boolean;
}

const ResultForm: React.FC<ResultFormProps> = ({ result, visible = false }) => {
	const longitude = result?.longitude || 1;
	const latitude = result?.latitude || 1;

	const [selectedLayer, setSelectedLayer] = useState("mapnik");

	const handleLayerChange = (layerValue: string) => {
        setSelectedLayer(layerValue);
    };

	const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.001223}%2C${latitude-0.00073}%2C${longitude+0.001223}%2C${latitude+0.00073}&layer=${selectedLayer}&marker=${latitude}%2C${longitude}`;


	if (!visible || !result) {
	return null;
}

return (
    <div className="p-4 item-center mx-auto w-5/6 bg-white rounded-lg shadow-md overflow-hidden my-8">
      	<div className="flex justify-between items-center mb-6 border-b pb-3">
        	<h3 className="text-xl font-bold">Résultats pour <span className="font-medium">{result.adresse_normalisee}</span></h3>
      	</div>

      	<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{/*=======================================================================*/}

        <div className="bg-white rounded-lg shadow p-4">

          	<h3 className="text-lg font-semibold mb-3">Informations générales</h3>

          	<div className="space-y-2">

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Adresse normalisée</span>
              		<span>{result.adresse_normalisee}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Ville</span>
              		<span>{result.ville}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Code postal</span>
              		<span>{result.code_postal}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Pays</span>
              		<span>{result.pays}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Population</span>
              		<span>{result.population} habitants</span>
            	</div>
          	</div>
        </div>

{/*=======================================================================*/}

		<div className="bg-white rounded-lg shadow h-full relative">

				<div className="w-full h-64 md:h-full">

					<iframe width="100%" height="100%" src={iframeSrc} className="rounded-lg" style={{border: "none"}}></iframe>

						<div className="absolute top-2 right-2 bg-white rounded-lg shadow p-1 z-10">

      						<div className="flex flex-col space-y-2">

        						<button onClick={() => handleLayerChange("mapnik")} className={`p-2 rounded-md ${selectedLayer === "mapnik" ? "bg-gray-200" : "hover:bg-gray-100"}`}>
          							<img src={global} alt="Standard" className="w-6 h-6" />
        						</button>

        						<button onClick={() => handleLayerChange("transportmap")} className={`p-2 rounded-md ${selectedLayer === "transportmap" ? "bg-gray-200" : "hover:bg-gray-100"}`}>
          							<img src={bus} alt="Transports" className="w-6 h-6" />
        						</button>

        						<button onClick={() => handleLayerChange("cyclemap")} className={`p-2 rounded-md ${selectedLayer === "cyclemap" ? "bg-gray-200" : "hover:bg-gray-100"}`}>
          							<img src={cycle} alt="Vélo" className="w-6 h-6" />
        						</button>

      						</div>
    					</div>
					</div>
				</div>

{/*=======================================================================*/}

        <div className="bg-white rounded-lg shadow p-4">

          	<h3 className="text-lg font-semibold mb-3">Coordonnées</h3>

          	<div className="space-y-2">

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Longitude</span>
              		<span>{result.longitude}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Latitude</span>
              		<span>{result.latitude}</span>
            	</div>

          	</div>
        </div>

{/*=======================================================================*/}

        <div className="bg-white rounded-lg shadow p-4">

          	<h3 className="text-lg font-semibold mb-3">Informations cadastrales</h3>

          	<div className="space-y-2">

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Section</span>
              		<span>{result.section}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Numéro</span>
              		<span>{result.numero}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Superficie</span>
              		<span>{result.m2} m²</span>
            	</div>

          	</div>
        </div>

{/*=======================================================================*/}

        <div className="bg-white rounded-lg shadow p-4">

          	<h3 className="text-lg font-semibold mb-3">Plan Local d'Urbanisme</h3>

          	<div className="space-y-2">

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Zone</span>
              		<span>{result.zone}</span>
            	</div>

            	<div className="flex flex-col">
              		<span className="text-sm text-gray-500">Description</span>
              		<span>Zone urbaine à forte densité</span>
            	</div>

          	</div>
        </div>

{/*=======================================================================*/}

        <div className="bg-white rounded-lg shadow p-4">

          	<h3 className="text-lg font-semibold mb-3">Risques naturels</h3>

          	{result.risques_naturels.length > 0 ? (
            	<div className="space-y-2">
              	{result.risques_naturels.map((risque, index) => (
                	<div key={index} className="py-1 px-3 bg-gray-100 rounded-md text-sm">
                  	{risque}
                	</div>
              	))}
            	</div>
          	) : (
            	<div className="py-1 px-3 bg-gray-100 rounded-md text-sm">
              	Aucun risque naturel recensé
            	</div>
          	)}
          	<a href={result.georisques_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-3 block">
            	Consulter le dossier complet sur Géorisques
          	</a>
        </div>

{/*=======================================================================*/}

        <div className="bg-white rounded-lg shadow p-4">

          	<h3 className="text-lg font-semibold mb-3">Risques industriels</h3>

          	{result.risques_industrielles.length > 0 ? (
            	<div className="space-y-2">
              	{result.risques_industrielles.map((risque, index) => (
                	<div key={index} className="py-1 px-3 bg-gray-100 rounded-md text-sm">
                  	{risque}
                	</div>
              	))}
            	</div>
          	) : (
            	<div className="py-1 px-3 bg-gray-100 rounded-md text-sm">
              	Aucun risque industriel recensé
            	</div>
          	)}
          	<a href={result.georisques_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-3 block">
            	Consulter le dossier complet sur Géorisques
          	</a>
        </div>
      	</div>
    </div>
  	);
};

export default ResultForm;
