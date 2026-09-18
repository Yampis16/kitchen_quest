// src/data/sampleData.js

export const sampleIngredients = [
  { id: 1,  nombre: "Avena en hojuelas",    tag: "despensa", kcal: 389, prot: 17,  carbs: 66, grasas: 7   },
  { id: 2,  nombre: "Proteína en polvo",    tag: "despensa", kcal: 380, prot: 75,  carbs: 8,  grasas: 5   },
  { id: 3,  nombre: "Leche deslactosada",   tag: "lácteo",   kcal: 42,  prot: 3.4, carbs: 5,  grasas: 1   },
  { id: 4,  nombre: "Banano",               tag: "fruta",    kcal: 89,  prot: 1.1, carbs: 23, grasas: 0.3 },
  { id: 5,  nombre: "Arroz blanco",         tag: "despensa", kcal: 130, prot: 2.7, carbs: 28, grasas: 0.3 },
  { id: 6,  nombre: "Pechuga de pollo",     tag: "proteína", kcal: 165, prot: 31,  carbs: 0,  grasas: 3.6 },
  { id: 7,  nombre: "Brócoli",              tag: "vegetal",  kcal: 34,  prot: 2.8, carbs: 7,  grasas: 0.4 },
  { id: 8,  nombre: "Aguacate",             tag: "grasa",    kcal: 160, prot: 2,   carbs: 9,  grasas: 15  },
  { id: 9,  nombre: "Huevo entero",         tag: "proteína", kcal: 155, prot: 13,  carbs: 1,  grasas: 11  },
  { id: 10, nombre: "Zanahoria",            tag: "vegetal",  kcal: 41,  prot: 0.9, carbs: 10, grasas: 0.2 },
  { id: 11, nombre: "Lentejas cocidas",     tag: "legumbre", kcal: 116, prot: 9,   carbs: 20, grasas: 0.4 },
  { id: 12, nombre: "Aceite de oliva",      tag: "grasa",    kcal: 884, prot: 0,   carbs: 0,  grasas: 100 },
  { id: 13, nombre: "Quinoa cocida",        tag: "despensa", kcal: 120, prot: 4.4, carbs: 22, grasas: 1.9 },
  { id: 14, nombre: "Espinaca",             tag: "vegetal",  kcal: 23,  prot: 2.9, carbs: 3.6,grasas: 0.4 },
  { id: 15, nombre: "Yogur griego natural", tag: "lácteo",   kcal: 59,  prot: 10,  carbs: 3.6,grasas: 0.4 },
]

export const sampleRecipes = [
  {
    id: 1,
    nombre: "Avena Proteica Matutina",
    porciones: 2,
    tag: "🌅 Desayuno",
    ingredientes: [
      { ingredienteId: 1, grams: 80  },
      { ingredienteId: 2, grams: 30  },
      { ingredienteId: 3, grams: 200 },
      { ingredienteId: 4, grams: 100 },
    ]
  },
  {
    id: 2,
    nombre: "Comida Clásica",
    porciones: 3,
    tag: "🍽️ Almuerzo",
    ingredientes: [
      { ingredienteId: 5, grams: 150 },
      { ingredienteId: 6, grams: 200 },
      { ingredienteId: 7, grams: 100 },
      { ingredienteId: 8, grams: 80  },
    ]
  },
]