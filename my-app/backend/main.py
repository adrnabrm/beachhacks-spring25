from fastapi import FastAPI, HTTPException, BackgroundTasks
import openai
import os
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",  # Adjust to match your React app's URL
]

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OpenAI_API_KEY")

class PatientData(BaseModel):
    age: int
    height: float
    weight: float
    gender: str
    goals: str
    medical_condition: str
    dietary: str

def generate_diet_plan(patient_data: PatientData):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use the appropriate chat model
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a nutritionist generating diet plans. Do not bold anything."
                        "Generate a personalized plan that is detailed and structured. "
                        "Return it in the following format:"
                        "Breakfast: {breakfast ideas}"
                        "Snack: {snack ideas}"
                        "Lunch: {lunch ideas}"
                        "Dinner: {dinner ideas}"
                        "General guidlines: {guidlines aimed for the user to reach their specific goal}"
                    ),
                },
                {
                    "role": "user",
                    "content": f"""
                    Age: {patient_data.age}  
                    Height: {patient_data.height} inches  
                    Weight: {patient_data.weight} pounds  
                    Gender: {patient_data.gender}  
                    Goals: {patient_data.goals}  
                    Medical Condition: {patient_data.medical_condition}  
                    Dietary Preferences: {patient_data.dietary}
                    """,
                },
            ]
        )
        diet_plan = response.choices[0].message["content"]
        print(f"Generated Diet Plan for {patient_data.age} years: {diet_plan}")
        return(diet_plan)
    except Exception as e:
        print(f"Error generating diet plan: {str(e)}")

@app.post("/generate/")
async def generate(patient_data: PatientData):
    diet_plan = generate_diet_plan(patient_data)
    return {"diet_plan": diet_plan}
