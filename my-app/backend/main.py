from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import torch  # PyTorch for AI model
import random  # For example-based recipe generation

app = FastAPI()

# In-memory database for storing generated recipes
memory_db = {"recipes": []}  

# Pydantic model for recipe validation
class Recipe(BaseModel):
    name: str
    ingredients: List[str]
    instructions: str

# Allow frontend to connect to the backend
origins = ["http://localhost:3000"]  # Adjust to your React app's actual URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_db = {"recipes": {}}
# Root endpoint
@app.get("/")
def home():
    return {"message": "AI Recipe Generator is running!"}

# Endpoint to fetch all stored recipes
@app.get("/recipes")
def get_recipes():
    return {"recipes": memory_db["recipes"]}

# Load AI model on startup
model = None

@app.on_event("startup")
def load_model():
    global model
    try:
        model = torch.load("model.pth", map_location=torch.device("cpu"))  # Load trained AI model
        model.eval()  # Set model to evaluation mode
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")

# Endpoint to generate a recipe based on ingredients
@app.post("/generate")
def generate_recipe(ingredients: List[str]):
    if model is None:
        raise HTTPException(status_code=500, detail="AI model not loaded")

    # Simulating AI model inference (Replace with real AI model logic)
    dummy_recipes = [
        {
            "name": "Spaghetti",
            "ingredients": ["Pasta", "Sausage", "Tomato sauce"],
            "instructions": "Boil the pasta, cook the sausage, and combine with tomato sauce."
        },
        {
            "name": "Grilled Chicken",
            "ingredients": ["Chicken", "Garlic", "Lemon"],
            "instructions": "Marinate the chicken, grill it, and serve with lemon."
        }
    ]

    generated_recipe = random.choice(dummy_recipes)  # Simulate model prediction
    memory_db["recipes"].append(generated_recipe)  # Store recipe in memory
    return {"recipe": generated_recipe}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)