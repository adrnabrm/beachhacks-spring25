from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import torch  # Import PyTorch
import random  # Example use case for generating dummy results

app = FastAPI()

memory_db = {"recipes": []} #create a list to append the items

class RecipeGenerator(BaseModel):
    name: str
    ingredients: List[str]
    instructions: str


origins =[
    "http://localhost:8000"
]
#allows connection to frontend (REACT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/") #app decorator
def home():
    return {"Hello": "AI recipe is running"}

@app.get("/recipes")
def get_recipes():
    return {"recipes": memory_db["recipes"]}

@app.post("/generate")
def generate_recipe(ingredients: List[str]):
#replace this with the PyTorch model
    generate_recipe= [
        {
            "name" : "Spaghetti",
            "ingredients": ["Pasta", "Sausage", "Tomato sauce"],
            "instructions": "Boil the pasta, cook the sausage, and combine with tomato sauce"
        },
        {
            "name": "Steak",
            "ingredients": ["Ribeye", "Rosemary", "Oil"],
            "instructions": "Fry the damn steak with oil, season the steak with salt"
        }
    ]
    memory_db["recipes"].append(generate_recipe[0])
    return {"recipes": generate_recipe[0]}

# model = None

# def load_model(): #load the AI trained model
#     global model
#     try:
#         model = torch.load("model.pth") #correct this path for the trained model
#         model.eval()
#         print("Model loaded")

#     except Exception as e:
#         print(f"Error loading model: {e}")
#         model = None

# @app.on_event("startup") #starts the model when FastAPI is loaded
# def startup_event():
#     load_model()
