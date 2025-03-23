from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize FastAPI app
app = FastAPI()

# In-memory database for storing generated recipes
memory_db = {"recipes": {}}

# Pydantic model for recipe validation
class Recipe(BaseModel):
    name: str
    ingredients: List[str]
    instructions: str

# Pydantic model for receiving ingredient list
class RecipeRequest(BaseModel):
    ingredients: List[str]

# Allow frontend to connect to the backend
origins = ["http://localhost:3000"]  # Adjust to your frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def home():
    return {"message": "AI Recipe Generator is running!"}

# Endpoint to fetch all stored recipes
@app.get("/recipes", response_model=List[Recipe])
def get_recipes():
    return list(memory_db["recipes"].values())

# Endpoint to generate a recipe
@app.post("/recipe", response_model=Recipe)
def generate_recipe(request: RecipeRequest):
    ingredients = request.ingredients  # Extract ingredients from the request

    # Hardcoded response since AI model is not used
    output = "Step 1: Mix ingredients. Step 2: Cook for 20 minutes."

    # Create a Recipe instance using the Pydantic model
    recipe = Recipe(
        name="AI Generated Meal",
        ingredients=ingredients,
        instructions=output
    )

    # Store the recipe in the in-memory database
    memory_db["recipes"][recipe.name] = recipe

    # Log the generated recipe for debugging
    logging.debug(f"Generated recipe: {recipe}")

    # Return the recipe (automatically serialized to JSON by FastAPI)
    return recipe

# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)