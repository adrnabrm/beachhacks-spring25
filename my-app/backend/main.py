from fastapi import FastAPI, HTTPException
import openai
import os
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email_validator import validate_email, EmailNotValidError

# Load environment variables
load_dotenv()

# Define allowed origins for CORS
origins = [
    "http://localhost:3000",  # Adjust to match your React app's URL
]

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key
openai.api_key = os.getenv("OpenAI_API_KEY")

# Define Pydantic model for patient data
class PatientData(BaseModel):
    age: int
    height: float
    weight: float
    gender: str
    goals: str
    medical_condition: str
    dietary: str
    email: str

# Function to send email with HTML formatting
def send_email(to_email: str, diet_plan: str):
    try:
        # Validate the email address
        validate_email(to_email)

        # SMTP server details
        smtp_host = "smtp.gmail.com"
        smtp_port = 587
        sender_email = os.getenv("your_email")  # Email from .env
        sender_password = os.getenv("your_email_password")  # App Password from .env

        # Debugging: Print email and password to verify
        print(f"Sender Email: {sender_email}")
        print(f"Sender Password: {sender_password}")

        # Create the email with HTML content
        msg = MIMEMultipart("alternative")
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = "Your Personalized Diet Plan"

        # Plain text version of the email (for clients that don't support HTML)
        text = f"Thank you for using our service! Here is your diet plan: \n\n{diet_plan}"

        # Replace newlines with <br> tags for HTML content
        diet_plan_html = diet_plan.replace("\n", "<br>")

        # HTML version of the email
        html = f"""
        <html>
          <body>
            <h2 style="color: #4CAF50; font-family: Arial, sans-serif;">Your Personalized Diet Plan</h2>
            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
              Thank you for using our service! Here is your diet plan:
            </p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-family: Arial, sans-serif;">
              <pre style="font-size: 16px; color: #333; white-space: pre-wrap; line-height: 1.6;">
{diet_plan_html}
              </pre>
            </div>
            <p style="font-size: 12px; color: #777; font-family: Arial, sans-serif;">
              This email was sent automatically. Please do not reply.
            </p>
          </body>
        </html>
        """

        # Attach both plain text and HTML versions
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        msg.attach(part1)
        msg.attach(part2)

        # Send the email
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(sender_email, sender_password)  # Authenticate using App Password
            server.sendmail(sender_email, to_email, msg.as_string())  # Send the email

        print(f"Email sent to {to_email}")
    except EmailNotValidError as e:
        print(f"Invalid email address: {e}")
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {e}")
    except Exception as e:
        print(f"There is an error sending the email: {str(e)}")

# Function to generate diet plan using OpenAI
def generate_diet_plan(patient_data: PatientData):
    try:
        print("Printing nutrition...")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
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
                        "General guidelines: {guidelines aimed for the user to reach their specific goal}"
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
        diet_plan = response.choices[0]["message"]["content"]
        print(f"Generated Diet Plan for {patient_data.age} years: {diet_plan}")
        return diet_plan
    except Exception as e:
        print(f"Error generating diet plan: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating diet plan")

# FastAPI endpoint to generate diet plan and send email
@app.post("/generate/")
async def generate(patient_data: PatientData):
    diet_plan = generate_diet_plan(patient_data)
    if patient_data.email:
        print(f"Sending email to: {patient_data.email}")
        send_email(patient_data.email, diet_plan)
    return {"diet_plan": diet_plan}

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)