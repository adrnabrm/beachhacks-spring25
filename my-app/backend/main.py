from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv() 
# force a pull req


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
open_ai_key = os.environ.get("OpenAI_API_KEY")
print("Open ai api", open_ai_key)
class PatientData(BaseModel):
    age: int
    height: float
    weight: float
    gender: str
    goals: str
    medical_condition: str
    dietary: str

@app.post("/generate/")
async def generate(patient_data: PatientData):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Ensure correct model name
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a nutritionist generating diet plans. "
                        "Generate a personalized plan that is detailed and structured. "
                        "Keep it in bullet points."
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
            ],
        )
        diet_plan = response["choices"][0]["message"]["content"]
        return {"diet_plan": diet_plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
