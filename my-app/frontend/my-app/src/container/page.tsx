import axios from "axios"; // Import Axios
import { useState } from "react";

// Static personal info fields
const fieldsPersonalInfo = [
  { name: "age", label: "Age", type: "number" },
  { name: "weight", label: "Weight (lbs)", type: "number" },
  { name: "height", label: "Height (in)", type: "number" },
];

// Dynamic fields for goal, medical condition, dietary preference, and gender
const fieldsInsight = {
  goal: [{ name: "goal", label: "Your Goal", type: "text" }],
  medical: [{ name: "medicalCondition", label: "Medical Condition", type: "text" }],
  dietary: [{ name: "dietaryPreference", label: "Dietary Preference", type: "text" }],
  gender: [{ name: "gender", label: "Gender Identity", type: "text" }],
};

type Field = {
  name: string;
  label: string;
  type: string;
};

export default function Page() {
  // State for tracking form data
  const [formData, setFormData] = useState(
    fieldsPersonalInfo.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>)
  );

  const [activeFields, setActiveFields] = useState<Field[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietPlan, setDietPlan] = useState<string>(""); // State to hold the diet plan
  const [email, setEmail] = useState(""); // State to hold the email

  // Function to add dynamic fields
  const handleAddFields = (key: keyof typeof fieldsInsight) => {
    const newFields = fieldsInsight[key].filter(
      (field) => !activeFields.some((f) => f.name === field.name)
    );
    const updatedFormData = { ...formData };
    newFields.forEach((field) => {
      if (!(field.name in updatedFormData)) {
        updatedFormData[field.name] = "";
      }
    });
    setFormData(updatedFormData);
    setActiveFields([...activeFields, ...newFields]);
  };

  // Handle input changes for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for allergies
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setAllergies((prev) =>
      checked ? [...prev, value] : prev.filter((a) => a !== value)
    );
  };

  // Handle email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    const patientData = {
      age: formData.age,
      height: formData.height,
      weight: formData.weight,
      gender: formData.gender || "", // Default to empty string if not provided
      goals: formData.goal || "",
      medical_condition: formData.medicalCondition || "",
      dietary: formData.dietaryPreference || "",
      email: email, // Include the email in the patient data
    };

    try {
      // Make POST request to FastAPI endpoint
      const response = await axios.post("http://localhost:8000/generate/", patientData);

      // Log the response from the backend (diet plan) and update the state
      setDietPlan(response.data.diet_plan);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-orange-500 h-auto w-full fixed top-0 z-50 p-5">
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-wide uppercase mx-auto text-center">
          👨‍⚕️ Diet Plan Generator 👨‍⚕️
        </h1>
      </div>

      {/* Form Container */}
      <div className="container mx-auto text-center pt-32">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
          {/* Static Personal Info */}
          {fieldsPersonalInfo.map((field) => (
            <div key={field.name} className="mb-4 text-left">
              <label className="block mb-1">{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          ))}

          {/* Dynamic Input Fields */}
          {activeFields.map((field) => (
            <div key={field.name} className="mb-4 text-left">
              <label className="block mb-1">{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}

          {/* Email Input */}
          <div className="mb-4 text-left">
            <label className="block mb-1">Email Address (optional):</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Buttons to Add Dynamic Fields */}
          <div className="flex flex-wrap gap-4 justify-center mt-6 mb-4">
            <button
              type="button"
              onClick={() => handleAddFields("goal")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Goal
            </button>
            <button
              type="button"
              onClick={() => handleAddFields("medical")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Medical Condition
            </button>
            <button
              type="button"
              onClick={() => handleAddFields("dietary")}
              className="bg-pink-500 text-white px-4 py-2 rounded"
            >
              Add Dietary Preference
            </button>
            <button
              type="button"
              onClick={() => handleAddFields("gender")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Add Gender
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white px-4 py-2 rounded mt-4"
          >
            Generate Diet Plan
          </button>
        </form>

        {/* Display Diet Plan if available */}
        {dietPlan && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your Personalized Diet Plan:</h2>
            <pre className="text-left whitespace-pre-wrap">{dietPlan}</pre>
          </div>
        )}
      </div>
    </main>
  );
}