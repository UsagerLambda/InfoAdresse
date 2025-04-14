from fastapi import APIRouter, Query, HTTPException
import httpx

async def georisques(lat, lon, citycode):
    latlon = f"{lat},{lon}"
    url = "https://georisques.gouv.fr/api/v1/resultats_rapport_risque"
    params = {
        "latlon": latlon
    }

    try:
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.get(url, params=params, timeout=20.0)
            response.raise_for_status()
            data = response.json()

            risk = await is_risky(data)

            final = {
                "url": data["url"],
                "risques_naturels": risk["risquesNaturels"],
                "risques_industrielles": risk["risquesIndustrielles"]
            }

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la requête à l'API d'adresse : {str(e)} (Georisques)")

    return final

async def is_risky(data):
    risquesNaturelsPresents = []
    risquesIndustriellesPresents = []
    risques = {"risquesNaturels": risquesNaturelsPresents, "risquesIndustrielles": risquesIndustriellesPresents}
    for key, elementNat in data["risquesNaturels"].items():
        if "present" in elementNat and elementNat["present"] == True:
            risquesNaturelsPresents.append(elementNat['libelle'])
    for key, elementInd in data["risquesTechnologiques"].items():
        if "present" in elementInd and elementInd["present"] == True:
            risquesIndustriellesPresents.append(elementInd['libelle'])
    return risques
