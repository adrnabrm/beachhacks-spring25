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
  const [loading, setLoading] = useState(false); // State for loading


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

    setLoading(true); //set loading to true before sneding the request

    try {
      // Make POST request to FastAPI endpoint
      const response = await axios.post("http://localhost:8000/generate/", patientData);

      // Log the response from the backend (diet plan) and update the state
      setDietPlan(response.data.diet_plan);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    finally{
      setLoading(false); //set loading to false after sending the request
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
              className="bg-green-500 text-white px-4 py-2 rounded transition transform duration-200 hover:scale-105 hover:bg-orange-300"
            >
              Add Goal
            </button>
            <button
              type="button"
              onClick={() => handleAddFields("medical")}
              className="bg-blue-500 text-white px-4 py-2 rounded transition transform duration-200 hover:scale-105 hover:bg-orange-300"
            >
              Add Medical Condition
            </button>
            <button
              type="button"
              onClick={() => handleAddFields("dietary")}
              className="bg-pink-500 text-white px-4 py-2 rounded transition transform duration-200 hover:scale-105 hover:bg-orange-300"
            >
              Add Dietary Preference
            </button>
            <button
              type="button"
              onClick={() => handleAddFields("gender")}
              className="bg-red-500 text-white px-4 py-2 rounded transition transform duration-200 hover:scale-105 hover:bg-orange-300"
            >
              Add Gender
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white px-4 py-2 rounded mt-4 relative inline-block text-lg group"
            // disabled={loading} // Disable the button while loading
            >
            <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-blue-100"></span>
            <span className="absolute left-2 w-full h-full -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-9 bg-orange-600 group-hover:-rotate-180 ease"></span>
            <span className="relative">Generate Diet Plan</span>
            </span>
            <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-100 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
          </button>
        </form>

        {/* Show loading indicator while submitting */}
        {loading && (
          <div className="mt-4 p-4 text-center">
            <span className="text-xl font-semibold">Loading...</span>
            <div className="inline-block" role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only"></span>
            </div>
          </div>
        )}

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