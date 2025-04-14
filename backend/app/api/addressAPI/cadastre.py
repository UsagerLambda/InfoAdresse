import json
import httpx
from shapely.geometry import Point, shape
from fastapi import HTTPException

async def find_section(geometry):
    url = "https://apicarto.ign.fr/api/cadastre/division"
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
                raise HTTPException(status_code=404, detail="section non trouvée")

            feature = data["features"][0]
            properties = feature["properties"]
            section = properties["section"]

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la requête à l'API d'adresse : {str(e)} (find_section)")

    return section

async def fetch_parcelle(code_insee, section):
    url = "https://apicarto.ign.fr/api/cadastre/parcelle"
    params = {
        "code_insee": code_insee,
        "section": section
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            if not data["features"]:
                return {"status": "not_found", "detail": "Parcelle non trouvée"}

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la requête à l'API d'adresse : {str(e)} (fetch_parcelle)")

    return data

async def find_parcelle(lon: float, lat: float, data: dict) -> dict:
    point = Point(lat, lon)
    tolerance = 0.000001

    closest_parcelle = None
    min_distance = float("inf")

    for feature in data["features"]:
        parcelle_geom = shape(feature["geometry"])
        distance = parcelle_geom.distance(point)
        if distance < min_distance:
            min_distance = distance
            closest_parcelle = feature

    if closest_parcelle is None:
        raise HTTPException(status_code=404, detail="Aucune parcelle trouvée dans les données")

    if min_distance > tolerance:
        print(f"Avertissement : la parcelle la plus proche est à {min_distance:.6f} unités des coordonnées.")

    props = closest_parcelle["properties"]
    return {
        "feuille": props.get("feuille", "Non spécifié"),
        "section": props.get("section", "Non spécifié"),
        "numero": props.get("numero", "Inconnu"),
        "contenance": props.get("contenance", 0)
    }

async def cadastre(geom, lat, lon, citycode):
    if not isinstance(lat, float) or not isinstance(lon, float):
        raise HTTPException(status_code=400, detail="Les coordonnées latitude et longitude doivent être des nombres à virgule flottante")

    if not isinstance(citycode, str):
        raise HTTPException(status_code=400, detail="Le code INSEE de la ville doit être une chaîne de caractères")

    section = await find_section(geom)
    data = await fetch_parcelle(citycode, section)

    if isinstance(data, dict) and data.get("status") == "not_found":
        return {
            "feuille": "Non trouvé",
            "section": section,
            "numero": "Non trouvé",
            "contenance": "Non trouvé",
            "status": "not_found",
            "detail": data.get("detail", "Parcelle non trouvée")
        }

    parcelle = await find_parcelle(lon, lat, data)
    return parcelle
