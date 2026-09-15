// ============================================
// KITCHEN QUEST — App v0.1
// ============================================

// --- Estado de la aplicación ---
// Este objeto es la única fuente de verdad de la app.
// Todo lo que se muestra en pantalla viene de aquí.
const state = {
  recipes: []
};

// --- Datos de ejemplo para arrancar ---
const sampleRecipes = [
  {
    id: 1,
    name: "Avena Proteica Matutina",
    portions: 2,
    tag: "🌅 Desayuno",
    ingredients: [
      { name: "Avena en hojuelas",    grams: 80,  cal: 389, protein: 17,   carbs: 66, fat: 7   },
      { name: "Proteína en polvo",    grams: 30,  cal: 380, protein: 75,   carbs: 8,  fat: 5   },
      { name: "Leche deslactosada",   grams: 200, cal: 42,  protein: 3.4,  carbs: 5,  fat: 1   },
      { name: "Banano",               grams: 100, cal: 89,  protein: 1.1,  carbs: 23, fat: 0.3 },
    ]
  },
  {
    id: 2,
    name: "Comida Clásica",
    portions: 3,
    tag: "🍽️ Almuerzo",
    ingredients: [
      { name: "Arroz blanco",  grams: 150, cal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
      { name: "Pechuga pollo", grams: 200, cal: 165, protein: 31,  carbs: 0,  fat: 3.6 },
      { name: "Brócoli",       grams: 100, cal: 34,  protein: 2.8, carbs: 7,  fat: 0.4 },
      { name: "Aguacate",      grams: 80,  cal: 160, protein: 2,   carbs: 9,  fat: 15  },
    ]
  }
];

// --- Motor nutricional ---
function calcularNutricionIngrediente(ingredient) {
  const factor = ingredient.grams / 100;
  return {
    calories: Math.round(ingredient.cal     * factor * 10) / 10,
    protein:  Math.round(ingredient.protein * factor * 10) / 10,
    carbs:    Math.round(ingredient.carbs   * factor * 10) / 10,
    fat:      Math.round(ingredient.fat     * factor * 10) / 10,
  };
}

function calcularNutricionReceta(recipe) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  for (const ingredient of recipe.ingredients) {
    const n = calcularNutricionIngrediente(ingredient);
    totals.calories += n.calories;
    totals.protein  += n.protein;
    totals.carbs    += n.carbs;
    totals.fat      += n.fat;
  }

  return {
    calories: Math.round(totals.calories / recipe.portions * 10) / 10,
    protein:  Math.round(totals.protein  / recipe.portions * 10) / 10,
    carbs:    Math.round(totals.carbs    / recipe.portions * 10) / 10,
    fat:      Math.round(totals.fat      / recipe.portions * 10) / 10,
  };
}

// --- Renderizado ---
function createRecipeCard(recipe) {
  const nutrition = calcularNutricionReceta(recipe);
  const totalMacros = nutrition.protein + nutrition.carbs + nutrition.fat;

  // Proporciones para la barra visual
  const proteinPct = totalMacros > 0 ? (nutrition.protein / totalMacros) : 0;
  const carbsPct   = totalMacros > 0 ? (nutrition.carbs   / totalMacros) : 0;
  const fatPct     = totalMacros > 0 ? (nutrition.fat     / totalMacros) : 0;

  const card = document.createElement('article');
  card.className = 'recipe-card';
  card.dataset.id = recipe.id;

  card.innerHTML = `
    <div class="recipe-card__header">
      <h2 class="recipe-card__name">${recipe.name}</h2>
      <span class="recipe-card__portions">${recipe.portions} porciones</span>
    </div>

    <div class="macro-bar">
      <div class="macro-bar__segment macro-bar__segment--protein" style="flex: ${proteinPct}"></div>
      <div class="macro-bar__segment macro-bar__segment--carbs"   style="flex: ${carbsPct}"></div>
      <div class="macro-bar__segment macro-bar__segment--fat"     style="flex: ${fatPct}"></div>
    </div>

    <div class="macro-grid">
      <div class="macro-item">
        <span class="macro-item__value macro-item__value--calories">${nutrition.calories}</span>
        <span class="macro-item__label">kcal</span>
      </div>
      <div class="macro-item">
        <span class="macro-item__value macro-item__value--protein">${nutrition.protein}g</span>
        <span class="macro-item__label">proteína</span>
      </div>
      <div class="macro-item">
        <span class="macro-item__value macro-item__value--carbs">${nutrition.carbs}g</span>
        <span class="macro-item__label">carbos</span>
      </div>
      <div class="macro-item">
        <span class="macro-item__value macro-item__value--fat">${nutrition.fat}g</span>
        <span class="macro-item__label">grasa</span>
      </div>
    </div>

    <div class="recipe-card__footer">
      <span class="recipe-card__tag">${recipe.tag}</span>
      <button class="btn btn--ghost btn--sm">Ver receta →</button>
    </div>
  `;

  return card;
}

function renderRecipes() {
  const grid = document.getElementById('recipes-grid');
  grid.innerHTML = ''; // Limpia el grid

  // Renderiza cada receta del estado
  for (const recipe of state.recipes) {
    grid.appendChild(createRecipeCard(recipe));
  }

  // Tarjeta vacía siempre al final
  const emptyCard = document.createElement('article');
  emptyCard.className = 'recipe-card recipe-card--empty';
  emptyCard.id = 'add-recipe-btn';
  emptyCard.innerHTML = `
    <span class="recipe-card__empty-icon">+</span>
    <p class="recipe-card__empty-text">Agregar receta</p>
  `;
  emptyCard.addEventListener('click', () => openModal());
  grid.appendChild(emptyCard);

  // Actualiza el contador
  document.getElementById('recipe-count').textContent =
    `${state.recipes.length} receta${state.recipes.length !== 1 ? 's' : ''} guardada${state.recipes.length !== 1 ? 's' : ''}`;
}

// --- Persistencia ---
function saveToStorage() {
  localStorage.setItem('kq-recipes', JSON.stringify(state.recipes));
}

function loadFromStorage() {
  const saved = localStorage.getItem('kq-recipes');
  if (saved) {
    state.recipes = JSON.parse(saved);
  } else {
    // Primera vez: carga las recetas de ejemplo
    state.recipes = sampleRecipes;
    saveToStorage();
  }
}
