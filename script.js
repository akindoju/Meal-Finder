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

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
    <div class ="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src ="${meal.strMealThumb}" alt = "${meal.strMeal}"/>
        <div class = "single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div>
            <p>${meal.strInstructions}</p>
             <h2>Ingredients</h2>
             <ul>
                ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
             </ul>
        </div>
    </div>`;
}

function getRandomMeal() {
  meals.innerHTML = '';
  resultHeading.innerHTML = '';
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

submit.addEventListener('submit', searchMeals);
random.addEventListener('click', getRandomMeal);

meals.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});
