from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd

app = FastAPI()

# Configuration du middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vous pouvez restreindre cela à votre frontend, par ex. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes HTTP
    allow_headers=["*"],  # Permet tous les en-têtes (headers)
)

# Chargement des modèles sauvegardés
with open('rdm.sav', 'rb') as model_file:
    rdm = pickle.load(model_file)
    
with open('make.sav', 'rb') as make_file:
    make_encoder = pickle.load(make_file)
    
with open('fuel.sav', 'rb') as fuel_file:
    fuel_encoder = pickle.load(fuel_file)    
    
with open('body.sav', 'rb') as body_file:
    body_encoder = pickle.load(body_file)  

with open('drive.sav', 'rb') as drive_file:
    drive_encoder = pickle.load(drive_file)  

with open('engine.sav', 'rb') as engine_file:
    engine_encoder = pickle.load(engine_file)  

# Définition du modèle pour le JSON attendu
class DataInput(BaseModel):
    make: str
    fuel_type: str
    body_style: str
    drive_wheels: str
    wheel_base: float
    engine_type: str
    engine_size: int
    compression_ratio: float
    horsepower: float
    city_mpg: int
    highway_mpg: int

def convert_to_list(data: DataInput) -> list:
    """Transforme l'objet DataInput en une liste."""
    return [
        data.make,
        data.fuel_type,
        data.body_style,
        data.drive_wheels,
        data.wheel_base,
        data.engine_type,
        data.engine_size,
        data.compression_ratio,
        data.horsepower,
        data.city_mpg,
        data.highway_mpg
    ]

def transform_to_model(data_values):
    # Définir les clés pour le dictionnaire
    keys = [
        'make',
        'fuel-type',
        'body-style',
        'drive-wheels',
        'wheel-base',
        'engine-type',
        'engine-size',
        'compression-ratio',
        'horsepower',
        'city-mpg',
        'highway-mpg',
    ]
    
    # Créer le dictionnaire en associant directement les clés aux valeurs
    data_dict = {key: value for key, value in zip(keys, data_values)}
    df = pd.DataFrame([data_dict])
    
    # Appliquer les encodeurs
    make = make_encoder.transform(df[['make']])
    fuel_type = fuel_encoder.transform(df[['fuel-type']])
    body_style = body_encoder.transform(df[['body-style']])
    drive_wheels = drive_encoder.transform(df[['drive-wheels']])
    engine_type = engine_encoder.transform(df[['engine-type']]) 

    # Créer des DataFrames pour les attributs encodés
    df_make = pd.DataFrame(make, columns=make_encoder.get_feature_names_out(['make']))
    df_fuel_type = pd.DataFrame(fuel_type, columns=fuel_encoder.get_feature_names_out(['fuel-type']))
    df_body_style = pd.DataFrame(body_style, columns=body_encoder.get_feature_names_out(['body-style']))
    df_drive_wheels = pd.DataFrame(drive_wheels, columns=drive_encoder.get_feature_names_out(['drive-wheels']))
    df_engine_type = pd.DataFrame(engine_type, columns=engine_encoder.get_feature_names_out(['engine-type']))

    # Combiner tous les DataFrames en un seul
    df = pd.concat([df, df_make, df_fuel_type, df_body_style, df_drive_wheels, df_engine_type], axis=1)

    # Supprimer les colonnes d'origine
    df = df.drop(columns=['make', 'fuel-type', 'body-style', 'drive-wheels', 'engine-type'])

    # Convertir le DataFrame en tableau NumPy pour la prédiction
    return df.to_numpy()

def predire(data: DataInput):
    data = convert_to_list(data)
    transformed_data = transform_to_model(data)
    price = rdm.predict(transformed_data)
    print("Le prix de cette " + data[0] + " est " + str(price[0]) + " $")
    return price[0]  # Renvoie le prix

@app.post("/api/data")
async def receive_data(data: DataInput):
    price = predire(data)
    return {"message": "La prédiction de prix a réussi", "predicted_price": price}
