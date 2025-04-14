from fastapi import APIRouter, Query, HTTPException
import httpx
import json

async def demographie(postcode):
    url = "https://geo.api.gouv.fr/communes"
    params = {
        "codePostal": postcode
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            if not data:
                raise HTTPException(status_code=404, detail="Aucune commune trouvée pour ce code postal.")

            commune = data[0]

            final = {
                "siren": commune.get("siren"),
                "population": commune.get("population"),
                "Epci": commune.get("codeEpci")
            }

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la requête à l'API d'adresse : {str(e)} (PLU)")

    return final
