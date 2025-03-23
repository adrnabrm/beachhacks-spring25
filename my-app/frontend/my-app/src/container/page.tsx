"use client";
import { useState } from "react";
import "./page.css";
import * as React from "react";

// Static personal info
const fieldsPersonalInfo = [
  { name: "age", label: "Age", type: "number" },
  { name: "weight", label: "Weight (kg)", type: "number" },
  { name: "height", label: "Height (cm)", type: "number" },
];

// Allergies list
const allergyOptions = ["Peanuts", "Dairy", "Gluten", "Seafood"];

// Dynamic fields by category
const fieldsInsight = {
  goal: [{ name: "goal", label: "Your Goal", type: "text" }],
  medical: [{ name: "medicalCondition", label: "Medical Condition", type: "text" }],
  dietary: [{ name: "dietaryPreference", label: "Dietary Preference", type: "text" }],
};

type Field = {
  name: string;
  label: string;
  type: string;
};

export default function Page() {
  // Tracks personal info + dynamic input values
  const [formData, setFormData] = useState(
    fieldsPersonalInfo.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>)
  );

  // Tracks active dynamic input fields
  const [activeFields, setActiveFields] = useState<Field[]>([]);

  // Tracks static ingredient and allergy inputs
  const [ingredients, setIngredients] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);

  // Add new field group (goal, medical, dietary)
  const handleAddFields = (key: keyof typeof fieldsInsight) => {
    const newFields = fieldsInsight[key].filter(
      (field) => !activeFields.some((f) => f.name === field.name)
    );
    // Add to both formData and activeFields
    const updatedFormData = { ...formData };
    newFields.forEach((field) => {
      if (!(field.name in updatedFormData)) {
        updatedFormData[field.name] = "";
      }
    });
    setFormData(updatedFormData);
    setActiveFields([...activeFields, ...newFields]);
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Allergy checkbox handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setAllergies((prev) =>
      checked ? [...prev, value] : prev.filter((a) => a !== value)
    );
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission = {
      ...formData,
      ingredients,
      allergies,
    };
    console.log("Submitted:", submission);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="bg-orange-500 h-auto w-full fixed top-0 z-50">
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-wide uppercase mx-auto text-center">
          title
        </h1>
      </div>

      <div className="container mx-auto text-center pt-32">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto"
        >
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
              />
            </div>
          ))}

          {/* Ingredients */}
          <div className="mb-4 text-left">
            <label className="block mb-1">Ingredients:</label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Allergies */}
          <div className="mb-4 text-left">
            <p className="mb-1">Allergies:</p>
            {allergyOptions.map((item) => (
              <label key={item} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value={item}
                  checked={allergies.includes(item)}
                  onChange={handleCheckboxChange}
                  className="mr-1"
                />
                {item}
              </label>
            ))}
          </div>

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
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
