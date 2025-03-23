from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import torch  # PyTorch for AI model
import random  # For example-based recipe generation
import uvicorn

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

#model = torch.jit.load("model.pth") #replace with trained model
#model.eval()
# Root endpoint
@app.get("/")
def home():
    return {"message": "AI Recipe Generator is running!"}

# Endpoint to fetch all stored recipes
@app.get("/recipes", response_model=Recipe)
def get_recipes():
    return {"recipes": list(memory_db["recipes"].values())}

@app.post("/recipe", response_model=Recipe)
def generate_recipe(ingredients: List[str]):
    if not model:
        raise HTTPException(status_code=500, detail="AI model not loaded")
    input_tensor = torch.tensor([hash(i) % 1000 for i in ingredients]).float().unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
    
    generate_recipe={
        "name": "AI Generated Meal",
        "ingredients": ingredients,
        "instructions": output.item()
    }
    memory_db["recipe"][generate_recipe["name"]] = generate_recipe
    return generate_recipe

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)