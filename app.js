const search = document.querySelector('#search');
const submit = document.querySelector('#submit');
const random = document.querySelector('#random');
const mealsEl = document.querySelector('#meals');
const resultHeading = document.querySelector('#result-heading');
const single_mealEl = document.querySelector('#single-meal');

// Search meal and fetch
function searchMeal(e) {
  e.preventDefault();

  single_mealEl.innerHTML = '';

  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search result for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = '<p>Nothing found for your request</p>';
        } else {
          mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" >
              <div class="meal-info" data-meal-id="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `)
            .join('');
        }
      });

    search.value = '';
  } else {
    alert('Enter the some value of search');
  }
}

// Search meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    })
}

// Get random meal
function getRandomMeal() {
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';
  
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  .then(res => res.json())
  .then(data => {
    const meal = data.meals[0];

    addMealToDOM(meal);
  })
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Events
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  })

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-meal-id');
    getMealById(mealID);
  }
});