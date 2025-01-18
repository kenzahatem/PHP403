from SPARQLWrapper import SPARQLWrapper, JSON
import json
import pandas as pd
import re
import os

def extract_ids_from_list(values: list) -> list:
    """Extrait les identifiants numériques de toutes les URL d'une liste."""
    ids = []
    for value in values:
        match = re.search(r"/Q(\d+)", value)
        if match:
            ids.append(match.group(1))
    return ids

def extract_id(value: str) -> str:
    """Extrait l'identifiant numérique d'une URL de type Qxxx."""
    match = re.search(r"/Q(\d+)", value)
    if match:
        return match.group(1)
    return value

def execute_sparql_queries(
    queries, 
    output_file,
    user_agent="MonUtilisateur/1.0 (example@example.com)"
):
    """
    Exécute un ou plusieurs fichiers de requêtes SPARQL et enregistre
    les résultats combinés dans un seul fichier JSON.

    Paramètres
    ----------
    queries : str ou List[str, str]
        - Si c'est une chaîne de caractères (str), il s'agit du chemin
          d'un seul fichier SPARQL. Sinon c'est une liste vers les chemins
    output_file : str
        Chemin du fichier de sortie JSON.
    user_agent : str
        User-Agent à inclure pour la requête SPARQL.
    """

    # Unifier : si on reçoit un seul fichier en str, le convertir en liste [ (fichier, None) ]
    if isinstance(queries, str):
        queries = [queries]

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    sparql.addCustomParameter('User-Agent', user_agent)

    all_data = []

    for query_file in queries:
        with open(query_file, "r", encoding="utf-8") as file:
            query = file.read()

        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)

        max_retries = 3
        for attempt in range(max_retries):
            try:
                results = sparql.query().convert()
                break  # Si la requête réussit, sortir de la boucle
            except Exception as e:
                print(f"Tentative {attempt + 1} échouée : {e}")
                if attempt == max_retries - 1:
                    print("Échec de la requête après plusieurs tentatives.")
                    continue  # Passer à la prochaine requête


        bindings = results.get("results", {}).get("bindings", [])
        if not bindings:
            print(f"Aucun résultat trouvé pour la requête : {query_file}")
            continue

        for result in bindings:
            # On va créer un 'row' qui collectera les données
            row = {}

            # Parcours des clés de chaque binding
            for key, value in result.items():
                val_str = value["value"]

                # Dans le 2e script, on attribuait row['id'] pour certains champs
                if key in ['country', 'continent', 'city', 'attraction', 'item']:
                    row["id"] = extract_id(val_str)
                elif key in ['inCountry']:
                    row["country"] = extract_id(val_str)
                elif key in ['finalContinent']:
                    row["continent"] = extract_id(val_str)
                elif key in ['locations']:
                    row["city"] = extract_id(val_str)
                elif key == "instanceOfs":
                    instance_values = val_str.split(", ")
                    row["themes"] = extract_ids_from_list(instance_values)
                elif key == "superclasses":
                    superclass_values = val_str.split(", ")
                    row["superclasses"] = extract_ids_from_list(superclass_values)
                else:
                    # Pour tout autre champ, on le stocke tel quel
                    row[key] = val_str

            all_data.append(row)

    # Si aucune data extraite, on s'arrête
    if not all_data:
        print("Aucune donnée extraite des requêtes.")
        return

    # Éliminer les doublons basés sur l'id
    seen_ids = set()
    unique_data = []
    for entry in all_data:
        item_id = entry.get("id")
        if item_id and item_id not in seen_ids:
            unique_data.append(entry)
            seen_ids.add(item_id)

    # Écriture dans le JSON
    try:
        os.makedirs("./results", exist_ok=True)
        with open(f"./results/{output_file}", "w", encoding="utf-8") as f:
            json.dump(unique_data, f, ensure_ascii=False, indent=4)
        print(f"Les résultats combinés ont été enregistrés dans {output_file}")
    except Exception as e:
        print(f"Erreur lors de l'écriture du fichier JSON: {e}")


queries_list = [
    r".\wikidata_requests\resorts.sparql",
    r".\wikidata_requests\tourist_attractions.sparql"
]

execute_sparql_queries(
    queries_list,
    "places.json"
)
execute_sparql_queries(r".\wikidata_requests\pays.sparql", "pays.json")
execute_sparql_queries(r".\wikidata_requests\cities.sparql", "cities.json")
execute_sparql_queries(r".\wikidata_requests\themes.sparql", "themes.json")
execute_sparql_queries(r".\wikidata_requests\continents.sparql", "continents.json")
