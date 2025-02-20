let consumedMeals = [];
let totalCalories = 0;
let totalProtein = 0;
let totalCarbs = 0;
let totalFats = 0;

// Function to add a new meal
function addMeal(event) {
    event.preventDefault(); // Prevent form submission
    const mealDescription = document.getElementById("meal-description").value.trim();
    const calories = parseFloat(document.getElementById("calories").value);
    const protein = parseFloat(document.getElementById("protein").value);
    const carbs = parseFloat(document.getElementById("carbs").value);
    const fats = parseFloat(document.getElementById("fats").value);

    consumedMeals.push({ description: mealDescription, calories, protein, carbs, fats });

    updateUI();

    document.getElementById("meal-form").reset();
}

// Function to delete a meal
function deleteMeal(index) {
    consumedMeals.splice(index, 1);
    updateUI();
}

// Function to update the UI
function updateUI() {
    const consumedMealsList = document.getElementById("consumed-meals");
    consumedMealsList.innerHTML = "";
    consumedMeals.forEach((meal, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>Meal ${index + 1}: ${meal.description}</span>
            <button onclick="deleteMeal(${index})">Delete</button>
        `;
        consumedMealsList.appendChild(listItem);
    });

    totalCalories = consumedMeals.reduce((total, meal) => total + meal.calories, 0);
    totalProtein = consumedMeals.reduce((total, meal) => total + meal.protein, 0);
    totalCarbs = consumedMeals.reduce((total, meal) => total + meal.carbs, 0);
    totalFats = consumedMeals.reduce((total, meal) => total + meal.fats, 0);

    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = `
        <p>Total Calories: ${totalCalories} calories</p>
        <p>Total Protein: ${totalProtein} grams</p>
        <p>Total Carbs: ${totalCarbs} grams</p>
        <p>Total Fats: ${totalFats} grams</p>
    `;

    const dailyLimit = parseFloat(document.getElementById("daily-limit").value);
    const calorieDifference = totalCalories - dailyLimit;
    const warningDiv = document.getElementById("warning");
    if (calorieDifference > 0) {
        warningDiv.textContent = `Warning: You have exceeded your daily calorie limit by ${calorieDifference} calories!`;
    } else {
        warningDiv.textContent = "";
    }

    updateChart();
}

// Function to update the chart
function updateChart() {
    const ctx = document.getElementById("intake-chart").getContext("2d");
    const dailyLimit = parseFloat(document.getElementById("daily-limit").value);
    const remainingCalories = dailyLimit - totalCalories;

    if (window.myChart) {
        window.myChart.destroy();
    }

   window.myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Consumed', 'Remaining'],
        datasets: [{
            label: 'Calories',
            data: [totalCalories, remainingCalories],
            backgroundColor: ['#FF5733', '#D4E157'], // Update the colors here
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
});

}

document.getElementById("meal-form").addEventListener("submit", addMeal);
updateUI();
