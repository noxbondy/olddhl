import React, { useEffect, useState } from "react";
import { taskApi } from "../api/taskApi";
import "../styles/MealInfo.css";
import { GiHotMeal } from "react-icons/gi";
import { FaBowlFood } from "react-icons/fa6";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { TbMedicalCrossOff } from "react-icons/tb";
import { PiHoodieThin } from "react-icons/pi";
import { IoIosTime } from "react-icons/io";
import { GiMeal } from "react-icons/gi";

const MealInfo = ({ personalNumber }) => {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await taskApi.get(`/meals/${personalNumber}`);
        setMeals(res.data); // res.data is an array of meals
      } catch (err) {
        setError("No meal info found.");
      }
    };
    fetchMeals();
  }, [personalNumber]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!meals.length) return <p>Loading meal...</p>;

  return (
    <section className="meal-info-container">
      <h3>
        {" "}
        <GiMeal /> Meal Information
      </h3>
      {meals.map((meal) => (
        <div className="meal-box" key={meal.id}>
          <div className="meal">
            <p>
              <IoIosTime />
              <strong className="meal-label">Date & Time:</strong>{" "}
              {new Date(meal.mealDateTime).toLocaleString()}
            </p>
          </div>
          <div className="meal">
            <p>
              {" "}
              <GiHotMeal /> <strong className="meal-label">
                Meal Name:
              </strong>{" "}
              {meal.mealName}
            </p>
          </div>
          <div className="meal">
            <p>
              {" "}
              <FaBowlFood />
              <strong className="meal-label">Recipe Name:</strong>{" "}
              {meal.recipeName}
            </p>
          </div>
          <div className="meal">
            <p>
              {" "}
              <MdOutlineIntegrationInstructions />
              <strong className="meal-label">Instructions:</strong>{" "}
              {meal.instructions}
            </p>
          </div>
          <div className="meal">
            <p>
              <TbMedicalCrossOff />
              <strong className="meal-label">Allergy:</strong>{" "}
              {meal.allergyName}
            </p>
          </div>

          <div className="meal">
            <p>
              <PiHoodieThin />
              <strong className="meal-label">Diet:</strong> {meal.dietName}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default MealInfo;
