function calculate() {
    var weight = parseFloat(document.getElementById("weight").value);
    var height = parseFloat(document.getElementById("height").value);
    var age = parseInt(document.getElementById("age").value);
    var activityLevel = parseFloat(document.getElementById("activity-level").value);
    var gender = document.getElementById("gender").value;
    var resultsDiv = document.getElementById("results");
  
    // Calculate BMI
    var bmi = weight / ((height / 100) * (height / 100));
    var bmiCategory = getBMICategory(bmi);
  
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    var bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
    // Calculate Total Daily Energy Expenditure (TDEE)
    var tdee = bmr * activityLevel;
  
    // Calculate macronutrients
    var protein = weight * 1.2; // 1.2 grams of protein per kg of body weight
    var fat = 0.25 * tdee / 9; // 25% of total calories from fat (1 gram of fat = 9 calories)
    var carbs = (tdee - (protein * 4) - (fat * 9)) / 4; // Carbohydrates provide 4 calories per gram
  
    // Display results
    resultsDiv.innerHTML = `
      <p><strong>BMI:</strong> ${bmi.toFixed(1)} (${bmiCategory})</p>
      <p><strong>Total Daily Energy Expenditure (TDEE):</strong> ${tdee.toFixed(0)} calories/day</p>
      <p><strong>Protein:</strong> ${protein.toFixed(0)} grams/day</p>
      <p><strong>Fat:</strong> ${fat.toFixed(0)} grams/day</p>
      <p><strong>Carbohydrates:</strong> ${carbs.toFixed(0)} grams/day</p>
    `;
  }
  
  function getBMICategory(bmi) {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      return "Normal weight";
    } else if (bmi >= 25 && bmi < 30) {
      return "Overweight";
    } else {
      return "Obese";
    }
  }
  