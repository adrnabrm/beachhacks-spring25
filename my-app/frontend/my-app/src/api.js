import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Your FastAPI backend URL

export const generateDietPlan = async (patientData) => {
    try {
        const response = await axios.post(`${API_URL}/generate/`, patientData);
        return response.data.diet_plan;
    } catch (error) {
        console.error("Error generating diet plan:", error);
        return "Failed to generate diet plan.";
    }
};