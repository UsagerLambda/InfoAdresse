from fastapi import APIRouter, Query, HTTPException
import httpx

from app.api.addressAPI.plu import plu
from app.api.addressAPI.georisques import georisques
from app.api.addressAPI.informationsDemographique import demographie
from app.api.addressAPI.cadastre import cadastre


router = APIRouter(tags=["Adress"])

@router.get("/search", summary="Recherche une adresse", description="Recherche une adresse et renvoie les informations associées")
async def search_address(q: str = Query(..., min_length=1, max_length=200, description="Adresse à rechercher")):
    url = "https://api-adresse.data.gouv.fr/search/"
    params = {
        "q": q,
        "limit": 1
        }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params) # appel api avec l'adresse donnée
            response.raise_for_status() # vérifie si le statut de la requête, si c'est entre 200 & 399 elle ne fait rien sinon elle lève une exception
            data = response.json() # assigne la reponse à data

            if not data["features"]: # vérifie que la liste des features n'est pas vide
                print("Adresse non trouvée dans API d'adresse")
                raise HTTPException(status_code=404, detail="Adresse non trouvée")

            feature = data["features"][0]
            properties = feature["properties"]
            geometry = feature["geometry"]
            coordinates = feature["geometry"]["coordinates"]

            plu_infos = await safe_call(plu, geometry, module_name="PLU")
            georisques_infos = await safe_call(georisques, coordinates[0], coordinates[1], properties["citycode"], module_name="Georisque")
            demographie_infos = await safe_call(demographie, properties["postcode"], module_name="Démographique")
            cadastre_infos = await safe_call(cadastre, geometry, coordinates[0], coordinates[1], properties["citycode"], module_name="Cadastral")

            final = {
                "adresse_normalisee": properties["label"],
                "ville": properties["city"],
                "code_postal": int(properties["postcode"]),
                "pays": "France",
                "longitude": coordinates[0],
                "latitude": coordinates[1],
                "feuille": cadastre_infos["feuille"],
                "section": cadastre_infos["section"],
                "numero": cadastre_infos["numero"],
                "m2": cadastre_infos["contenance"],

                "population": demographie_infos["population"],

                "zone": plu_infos["libelle"],
                "libelong": plu_infos["libelong"],

                "risques_naturels": georisques_infos["risques_naturels"],
                "risques_industrielles": georisques_infos["risques_industrielles"],
                "georisques_url": georisques_infos["url"]
            }
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la requête à l'API d'adresse : {str(e)} (Get)")

    return final

async def safe_call(func, *args, module_name=""):
    try:
        return await func(*args)
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        print(f"Erreur dans le module {module_name}: {str(e)}")
        print(error_detail)
        raise HTTPException(status_code=500, detail=f"Erreur dans le module {module_name}: {str(e)}")
