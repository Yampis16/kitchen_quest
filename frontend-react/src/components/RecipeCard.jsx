// src/components/RecipeCard.jsx

function calcularNutricion(recipe) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  for (const ing of recipe.ingredients) {
    const factor = ing.grams / 100;
    totals.calories += ing.cal     * factor;
    totals.protein  += ing.protein * factor;
    totals.carbs    += ing.carbs   * factor;
    totals.fat      += ing.fat     * factor;
  }

  return {
    calories: Math.round(totals.calories / recipe.portions * 10) / 10,
    protein:  Math.round(totals.protein  / recipe.portions * 10) / 10,
    carbs:    Math.round(totals.carbs    / recipe.portions * 10) / 10,
    fat:      Math.round(totals.fat      / recipe.portions * 10) / 10,
  };
}


function MacroBar({ nutrition }) {
  const total = nutrition.protein + nutrition.carbs + nutrition.fat;
  if (total === 0) return <div className="macro-bar" />;

  return (
    <div className="macro-bar">
      <div
        className="macro-bar__segment macro-bar__segment--protein"
        style={{ flex: nutrition.protein / total }}
      />
      <div
        className="macro-bar__segment macro-bar__segment--carbs"
        style={{ flex: nutrition.carbs / total }}
      />
      <div
        className="macro-bar__segment macro-bar__segment--fat"
        style={{ flex: nutrition.fat / total }}
      />
    </div>
  );
}


function MacroItem({ value, label, colorClass }) {
  return (
    <div className="macro-item">
      <span className={`macro-item__value ${colorClass}`}>{value}</span>
      <span className="macro-item__label">{label}</span>
    </div>
  );
}


function RecipeCard({ recipe }) {
  const nutrition = calcularNutricion(recipe);

  return (
    <article className="recipe-card">
      <div className="recipe-card__header">
        <h2 className="recipe-card__name">{recipe.name}</h2>
        <span className="recipe-card__portions">{recipe.portions} porciones</span>
      </div>

      <MacroBar nutrition={nutrition} />

      <div className="macro-grid">
        <MacroItem
          value={nutrition.calories}
          label="kcal"
          colorClass="macro-item__value--calories"
        />
        <MacroItem
          value={`${nutrition.protein}g`}
          label="proteína"
          colorClass="macro-item__value--protein"
        />
        <MacroItem
          value={`${nutrition.carbs}g`}
          label="carbos"
          colorClass="macro-item__value--carbs"
        />
        <MacroItem
          value={`${nutrition.fat}g`}
          label="grasa"
          colorClass="macro-item__value--fat"
        />
      </div>

      <div className="recipe-card__footer">
        <span className="recipe-card__tag">{recipe.tag}</span>
        <button className="btn btn--ghost btn--sm">Ver receta →</button>
      </div>
    </article>
  );
}

export default RecipeCard;