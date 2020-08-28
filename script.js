const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  meals = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  singleMeal = document.getElementById('single-meal');

function searchMeals(e) {
  e.preventDefault();

  singleMeal.innerHTML = '';

  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search result(s) for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>'Sorry, '${term}' is unavailable on our menu, try again.</p>`;
        } else {
          meals.innerHTML = data.meals
            .map(
              (meal) => `
            <div class = "meal">
                <img src ="${meal.strMealThumb}" alt = "${meal.strMeal}"/>
                <div class = "meal-info" data-mealID = "${meal.idMeal}">
                    <h3>
                        ${meal.strMeal}
                    </h3>
                </div>
            </div>`
            )
            .join('');
        }
      });

    search.value = '';
  } else {
    alert('Please enter a Meal');
  }
}

submit.addEventListener('submit', searchMeals);
