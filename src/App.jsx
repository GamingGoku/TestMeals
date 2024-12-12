import React, { useState } from 'react';

function App() {
  const [meals, setMeals] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [shoppingList, setShoppingList] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  // Add state for section visibility
  const [visibleSections, setVisibleSections] = useState({
    availableMeals: true,
    mealPlan: true,
    shoppingList: true,
  });

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        const importedMeals = rows
          .slice(1)
          .map((row) => {
            const values = row.split(',');
            return {
              meal: values[0],
              mainDish: values[1],
              sideDish: values[2],
              ingredients: values[3],
            };
          })
          .filter((meal) => meal.meal);
        setMeals(importedMeals);
      };
      reader.readAsText(file);
    }
  };

  const generateMealPlan = () => {
    const days = prompt('Enter number of days to plan for:', '7');
    if (!days) return;

    const numDays = parseInt(days);
    const selected = [];
    const used = new Set();

    while (selected.length < numDays && selected.length < meals.length) {
      const index = Math.floor(Math.random() * meals.length);
      if (!used.has(index)) {
        used.add(index);
        selected.push(meals[index]);
      }
    }

    setMealPlan(selected);
    generateShoppingList(selected);
    // Show all sections when generating new meal plan
    setVisibleSections({
      availableMeals: true,
      mealPlan: true,
      shoppingList: true,
    });
  };

  const generateShoppingList = (selectedMeals) => {
    const categories = {};
    selectedMeals.forEach((meal) => {
      if (!meal.ingredients) return;
      const ingredients = meal.ingredients.split(',').map((i) => i.trim());
      ingredients.forEach((ingredient) => {
        const category = getIngredientCategory(ingredient);
        if (!categories[category]) categories[category] = {};
        categories[category][ingredient] =
          (categories[category][ingredient] || 0) + 1;
      });
    });
    setShoppingList(categories);
  };

  const getIngredientCategory = (ingredient) => {
    ingredient = ingredient.toLowerCase().trim();
    if (ingredient.includes('chicken') || ingredient.includes('beef'))
      return 'Meat';
    if (ingredient.includes('rice') || ingredient.includes('pasta'))
      return 'Grains';
    if (['onion', 'pepper', 'carrot'].some((i) => ingredient.includes(i)))
      return 'Produce';
    if (ingredient.includes('sauce') || ingredient.includes('oil'))
      return 'Sauces';
    if (['salt', 'pepper', 'spice'].some((i) => ingredient.includes(i)))
      return 'Spices';
    return 'Other';
  };

  // Styles for the toggle button
  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#4a90e2',
    cursor: 'pointer',
    fontSize: '1.2em',
    marginLeft: '10px',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
      />
      <button
        onClick={generateMealPlan}
        style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Generate Meal Plan
      </button>

      {meals.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>
              Available Meals
            </h2>
            <button
              onClick={() => toggleSection('availableMeals')}
              style={toggleButtonStyle}
            >
              {visibleSections.availableMeals ? '▼' : '▶'}
            </button>
          </div>
          {visibleSections.availableMeals && (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Meal
                  </th>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Main Dish
                  </th>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Side Dish
                  </th>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Ingredients
                  </th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {meal.meal}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {meal.mainDish}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {meal.sideDish}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {meal.ingredients}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {mealPlan.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>
              Generated Meal Plan
            </h2>
            <button
              onClick={() => toggleSection('mealPlan')}
              style={toggleButtonStyle}
            >
              {visibleSections.mealPlan ? '▼' : '▶'}
            </button>
          </div>
          {visibleSections.mealPlan && (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Day
                  </th>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Meal
                  </th>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Main Dish
                  </th>
                  <th
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    Side Dish
                  </th>
                </tr>
              </thead>
              <tbody>
                {mealPlan.map((meal, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      Day {index + 1}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {meal.meal}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {meal.mainDish}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {meal.sideDish}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {Object.keys(shoppingList).length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>
              Shopping List
            </h2>
            <button
              onClick={() => toggleSection('shoppingList')}
              style={toggleButtonStyle}
            >
              {visibleSections.shoppingList ? '▼' : '▶'}
            </button>
          </div>
          {visibleSections.shoppingList &&
            Object.entries(shoppingList).map(([category, items]) => (
              <div
                key={category}
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  marginBottom: '10px',
                }}
              >
                <h3>{category}</h3>
                {Object.entries(items).map(([item, quantity]) => (
                  <div key={item} style={{ marginBottom: '5px' }}>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={checkedItems[`${category}-${item}`] || false}
                        onChange={() =>
                          setCheckedItems((prev) => ({
                            ...prev,
                            [`${category}-${item}`]:
                              !prev[`${category}-${item}`],
                          }))
                        }
                        style={{ marginRight: '10px' }}
                      />
                      <span
                        style={
                          checkedItems[`${category}-${item}`]
                            ? { textDecoration: 'line-through', color: '#999' }
                            : {}
                        }
                      >
                        {item} ({quantity}x)
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
