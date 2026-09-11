import React, { useEffect, useState } from "react";

const MealsList = ({ personalNumber }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMealId, setEditMealId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch meals for a user
  useEffect(() => {
    fetch(`http://localhost:8080/meals/${personalNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meals");
        return res.json();
      })
      .then((data) => {
        setMeals(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [personalNumber]);

  const handleEditClick = (meal) => {
    setEditMealId(meal.id);
    setEditFormData({ ...meal });
  };

  const handleCancelClick = () => {
    setEditMealId(null);
    setEditFormData({});
  };

  const handleInputChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  const handleSaveClick = (meal) => {
    fetch(`http://localhost:8080/meals/${meal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editFormData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update meal");
        return res.json();
      })
      .then((updatedMeal) => {
        setMeals((prev) =>
          prev.map((m) => (m.id === updatedMeal.id ? updatedMeal : m))
        );
        setEditMealId(null);
        setEditFormData({});
      })
      .catch((err) => setError(err.message));
  };

  const handleDeleteClick = (mealId) => {
    fetch(`http://localhost:8080/meals/${mealId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete meal");
        setMeals((prev) => prev.filter((m) => m.id !== mealId));
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Meals for {personalNumber}</h2>
      {meals.length === 0 ? (
        <p>No meals found</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Meal Name</th>
              <th className="border px-2 py-2">Recipe Name</th>
              <th className="border px-2 py-2">Instructions</th>
              <th className="border px-2 py-2">Allergy Name</th>
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id}>
                {["id", "mealName", "recipeName", "instructions", "allergyName"].map(
                  (field) => (
                    <td className="border px-2 whitespace-nowrap" key={field}>
                      {editMealId === meal.id && field !== "id" ? (
                        <input
                          value={editFormData[field] || ""}
                          onChange={(e) => handleInputChange(e, field)}
                          className="border px-1 w-full"
                        />
                      ) : (
                        <span>{meal[field]}</span>
                      )}
                    </td>
                  )
                )}
                <td className="border px-2 space-x-2">
                  {editMealId === meal.id ? (
                    <>
                      <button
                        onClick={() => handleSaveClick(meal)}
                        className="bg-green-500 text-white px-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="bg-gray-400 text-white px-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(meal)}
                        className="bg-blue-500 text-white px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(meal.id)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MealsList;