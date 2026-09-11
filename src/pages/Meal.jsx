import React, { useState } from "react";
import axios from "axios";
import GetMeals from "./GetMeals";
import { taskApi } from "../api/taskApi";

const Meal = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Example after login: { email, role, personalNumber }

  const [meal, setMeal] = useState({
    mealName: "",
    recipeName: "",
    instructions: "",
    allergyName: "",
    dietName: "",
    personalNumber: "", // staff must choose which patient
    mealDateTime: "", // optional
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  // Create Meal
  const createMeal = async () => {
    setError(null);
    setResponse(null);

    try {
      const res = await taskApi.post(
        `/meals/${meal.personalNumber}`,
        {
          mealName: meal.mealName,
          recipeName: meal.recipeName,
          instructions: meal.instructions,
          allergyName: meal.allergyName,
          dietName: meal.dietName,
          mealDateTime: meal.mealDateTime,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setResponse(res.data);

      // Reset form
      setMeal({
        mealName: "",
        recipeName: "",
        instructions: "",
        allergyName: "",
        dietName: "",
        personalNumber: "",
        mealDateTime: "",
      });
    } catch (err) {
      console.error("Meal creation error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          err.message
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMeal();
  };

  // Prevent patients from creating meals
  if (!user || user.role === "PATIENT") {
    return (
      <div className="max-w-md mx-auto bg-red-100 p-6 rounded-xl shadow-md">
        ❌ Patients cannot create meals. Please ask a doctor, nurse, or
        dietitian.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Meal for Patient</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="mealName"
          value={meal.mealName}
          onChange={handleChange}
          placeholder="Meal Name"
          className="w-full p-2 border rounded-lg"
          required
        />
        <br />
        <br />
        <input
          type="text"
          name="recipeName"
          value={meal.recipeName}
          onChange={handleChange}
          placeholder="Recipe Name"
          className="w-full p-2 border rounded-lg"
        />
        <br />
        <br />
        <textarea
          name="instructions"
          value={meal.instructions}
          onChange={handleChange}
          placeholder="Instructions"
          className="w-full p-2 border rounded-lg"
          rows="3"
        />
        <br />
        <br />
        <input
          type="text"
          name="allergyName"
          value={meal.allergyName}
          onChange={handleChange}
          placeholder="Allergy Info"
          className="w-full p-2 border rounded-lg"
        />
        <br />
        <br />
        <input
          type="text"
          name="dietName"
          value={meal.dietName}
          onChange={handleChange}
          placeholder="Diet Type (e.g., Vegan, Keto)"
          className="w-full p-2 border rounded-lg"
        />
        <br />
        <br />
        <input
          type="text"
          name="personalNumber"
          value={meal.personalNumber}
          onChange={handleChange}
          placeholder="Patient's Personal Number"
          className="w-full p-2 border rounded-lg"
          required
        />
        <br />
        <br />
        <input
          type="datetime-local"
          name="mealDateTime"
          value={meal.mealDateTime}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />
        <br />
        <br />

        <div>
          <button type="submit" className="button">
            Create
          </button>
        </div>
      </form>

      {response && (
        <div className="mt-4 p-3 bg-green-100 border rounded">
          ✅ Meal created for patient:{" "}
          <strong>{response.personalNumber}</strong>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border rounded">{error}</div>
      )}
      <GetMeals />
    </div>
  );
};

export default Meal;
