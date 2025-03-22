"use client";
import { useState } from "react";
// import Image from "next/image";
import "./page.css"
import * as React from 'react'

export default function Page() {

  const [ingredients, setIngredients] = useState("") //user input
  const [allergies, setAllergies] = useState<string[]>([])
  
  const handlecheckboxchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setAllergies(checked
      ? [...allergies, value]
      : allergies.filter((allergy) => allergy !== value));
    };
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="bg-orange-500 h-6 w-full fixed top-0 z-50" />

      <div className="container mx-auto text-center py-12">
        <div className="w-12 h-12 text-orange-500 mx-auto mb-2"></div>
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-wide uppercase">👨‍🍳AI Chef👨‍🍳</h1>
        <p className="text-2xl text-black">What is in your fridge?</p>
      </div>

      {/* Input box */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <form>
          <textarea
            placeholder="List your ingredients here!"
            className="w-full p-2 border rounded-md"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)} />     

      {/* Allergy checkboxes */}
        <div className="mt-4">
          <h2 className="text-lg font-bold">Do you have any food allergies?</h2>
          <div className="flex flex-row items-start mt-2 space-y-2">
            {["Peanuts", "Dairy", "Gluten", "Soy", "Seafood"].map((allergy) => (
            <label key={allergy} className="flex flex-row-reverse item-center justify-between space-x-4 gap-2">
              <input
              type="checkbox"
              value={allergy}
              onChange={handlecheckboxchange}
              className = "gap-4 w-4 h-4" />
            <span className="text-sm">{allergy}</span>
            </label>
            ))}
          </div>
        </div> 

            
            <button 
            type= "submit"
            className="w-full bg-yellow-600 hover:bg-orange-700 text-black p-3 rounded-lg font-semibold">
              Let me cook!🔥🔥🔥
              </button>
        </form>
        <div className="mt-6 text-center text-black-600">Recipes generated:</div>
      </div>
    </main>
  );
}