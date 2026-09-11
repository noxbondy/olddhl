import React, { useState } from "react";
import { taskApi } from "../api/taskApi";

const GetMeals = () => {
  const [personalNumber, setPersonalNumber] = useState("");
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch meals for a patient
  const fetchMeals = async () => {
    setError(null);
    setMeals([]);
    setLoading(true);
    try {
      const res = await taskApi.get(`/meals/${personalNumber}`);
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err.response || err.message);
      setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (personalNumber.trim() === "") {
      setError("Please enter a valid personal number");
      return;
    }
    fetchMeals();
  };

  // Toggle checkbox selection
  const toggleCheckbox = (id) => {
    setSelectedMeals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete selected meals
  const deleteSelected = async () => {
    if (selectedMeals.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedMeals.length} meal(s)?`)) return;

    setDeleting(true);
    try {
      await Promise.all(selectedMeals.map((id) => taskApi.delete(`/meals/${id}`)));
      setMeals(meals.filter((m) => !selectedMeals.includes(m.id)));
      setSelectedMeals([]);
    } catch (err) {
      console.error("Failed to delete meals:", err.response || err.message);
      setError("❌ Failed to delete meals");
    } finally {
      setDeleting(false);
    }
  };

  // Start editing a meal
  const startEdit = (meal) => setEditingMeal({ ...meal });

  // Save edited meal
  const saveUpdate = async () => {
    if (!editingMeal) return;
    try {
      const res = await taskApi.put(`/meals/${editingMeal.id}`, editingMeal);
      setMeals(meals.map((m) => (m.id === editingMeal.id ? res.data : m)));
      setEditingMeal(null);
    } catch (err) {
      console.error("Failed to update meal:", err.response || err.message);
      setError("❌ Failed to update meal");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Get Meals by Personal Number</h2>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={personalNumber}
          onChange={(e) => setPersonalNumber(e.target.value)}
          placeholder="Enter Patient's Personal Number"
          className="flex-1 p-2 border rounded-lg"
          required
        />
        <button type="submit" className="button bg-blue-500 text-white px-4 rounded">
          {loading ? "Loading..." : "Get Meals"}
        </button>
      </form>

      {/* Error message */}
      {error && <div className="p-3 bg-red-100 border rounded mb-4">{error}</div>}

      {/* Meals list */}
      {meals.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold mb-2">Meals for {personalNumber}:</h3>

          {meals.map((meal) => (
            <div
              key={meal.id}
              className="p-3 border rounded bg-gray-50 shadow-sm flex items-start space-x-2"
            >
              <input
                type="checkbox"
                checked={selectedMeals.includes(meal.id)}
                onChange={() => toggleCheckbox(meal.id)}
              />

              {editingMeal && editingMeal.id === meal.id ? (
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editingMeal.mealName}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, mealName: e.target.value })
                    }
                    className="p-1 border rounded"
                    placeholder="Meal Name"
                  />
                  <input
                    type="text"
                    value={editingMeal.recipeName}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, recipeName: e.target.value })
                    }
                    className="p-1 border rounded"
                    placeholder="Recipe Name"
                  />
                  <textarea
                    value={editingMeal.instructions}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, instructions: e.target.value })
                    }
                    className="col-span-2 p-1 border rounded"
                    placeholder="Instructions"
                  />
                  <input
                    type="text"
                    value={editingMeal.allergyName}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, allergyName: e.target.value })
                    }
                    className="p-1 border rounded"
                    placeholder="Allergy"
                  />
                  <input
                    type="text"
                    value={editingMeal.dietName}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, dietName: e.target.value })
                    }
                    className="p-1 border rounded"
                    placeholder="Diet"
                  />
                  <input
                    type="date"
                    value={editingMeal.date}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, date: e.target.value })
                    }
                    className="p-1 border rounded"
                  />
                  <div className="col-span-2 flex space-x-2 mt-2">
                    <button
                      type="button"
                      className="button bg-green-500 text-white px-2 rounded"
                      onClick={saveUpdate}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="button bg-gray-400 text-white px-2 rounded"
                      onClick={() => setEditingMeal(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p><strong>Meal:</strong> {meal.mealName}</p>
                  <p><strong>Recipe:</strong> {meal.recipeName}</p>
                  <p><strong>Instructions:</strong> {meal.instructions}</p>
                  <p><strong>Allergy:</strong> {meal.allergyName}</p>
                  <p><strong>Diet:</strong> {meal.dietName}</p>
                  <p><strong>Date:</strong> {meal.date}</p>

                  <button
                    type="button"
                    className="button bg-yellow-400 text-white mt-2 px-2 rounded"
                    onClick={() => startEdit(meal)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Delete button */}
          {selectedMeals.length > 0 && (
            <button
              type="button"
              className={`button mt-4 px-4 py-2 rounded text-white ${deleting ? 'bg-gray-400' : 'bg-red-500'}`}
              onClick={deleteSelected}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : `Delete Selected (${selectedMeals.length})`}
            </button>
          )}
        </div>
      )}

      {meals.length === 0 && !error && !loading && (
        <div className="text-gray-500 mt-4">No meals found</div>
      )}
    </div>
  );
};

export default GetMeals;