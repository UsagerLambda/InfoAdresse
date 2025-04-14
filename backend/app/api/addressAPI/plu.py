from fastapi import APIRouter, Query, HTTPException
import httpx
import json

async def plu(geometry):
    url = "https://apicarto.ign.fr/api/gpu/zone-urba"
    json_geom = json.dumps(geometry)
    params = {
        "geom": json_geom
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            if not data["features"]:
                raise HTTPException(status_code=404, detail="Adresse non trouvée")

            feature = data["features"][0]
            properties = feature["properties"]

            final = {
                "libelle": properties["libelle"],
                "libelong": properties["libelong"]
            }

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la requête à l'API d'adresse : {str(e)} (PLU)")

    return final
