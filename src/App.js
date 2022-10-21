//for the sake of variety and curiosity, I will be using npm to run this app.
//resume video at 11:44

import {db} from "./firebase.config";
import React, {useState, useEffect} from "react";
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";

//collection allows us to get reference to a collection of data, rows, tables
//onSnapshot allows us to run real-time functionalities. It updates as it goes. Automatically updates



function App() {

const [recipes, setRecipes] = useState([]);

const [form, setForm] = useState(
  {title: "",
  desc: "",
ingredients: [],
steps: []
}
)

const [popupActive, setPopupActive] = useState(false);

const recipeCollectionRef = collection(db, "my-recipes")

useEffect(() => {
onSnapshot(recipeCollectionRef, snapshot => {
  setRecipes(snapshot.docs.map(doc => {
    return {
      id: doc.id,
      viewing: false,
      ...doc.data()
    }
  }))
})  
}, [])

const handleView = id => {
  const recipesClone = [...recipes]

  recipesClone.forEach(recipe => {
    if (recipe.id === id) {
      recipe.viewing = !recipe.viewing
    } else {
      recipe.viewing = false
    }
  })
  setRecipes(recipesClone)
}

const handleSubmit = e => {
  e.preventDefault()

  if (
    !form.title ||
    !form.desc ||
    !form.ingredients ||
    !form.steps
  ) {
    alert("You missed a spot.")
    return
  }
addDoc(recipeCollectionRef, form)

setForm({
  title: "",
  desc: "",
  ingredients: [],
  steps: []
})
setPopupActive(false)
}

const handleIngredient =(e, i) => {
const ingredientsClone = [...form.ingredients]

ingredientsClone[i] = e.target.value

setForm({
  ...form,
  ingredients: ingredientsClone
})
}

const handleStep =(e, i) => {
  const stepsClone = [...form.steps]
  
  stepsClone[i] = e.target.value
  
  setForm({
    ...form,
    steps: stepsClone
  })
  }

const handleIngredientCount = () => {
  setForm({
    ...form,
    ingredients: [...form.ingredients, ""]
  })
}

const handleStepCount = () => {
  setForm({
    ...form,
    steps: [...form.steps, ""]
  })
}

const removeRecipe = id => {
  deleteDoc(doc(db, "my-recipes", id))
}

  return (
    <div className="App">
      <h1>Joe's Recipes</h1>
      <button onClick={() => setPopupActive(!popupActive)} className="add-recipe-btn">Add Recipe</button>
      <div className="recipes">
        {recipes.map((recipe, i) => (
          <div className="recipe" key={recipe.id}>
           <h3>{recipe.title}</h3>
           <p dangerouslySetInnerHTML={{__html: recipe.desc}}></p>{/*We will be using a text area field. This will allow us to create new lines here*/}
       { recipe.viewing &&   <div>
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients.map((ingredients, i) => (
                <li key={i}>{ingredients}</li>
              ))}
            </ul>
            <h4>Steps</h4>
            <ol>
              {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
              ))}
            </ol>
           </div>}
           <div className="buttons">
            <button className="view-more-less" onClick={() => handleView(recipe.id)}>View {recipe.viewing ? 'less' : 'more'}</button>
            <button className="remove-recipe" onClick={() => removeRecipe(recipe.id)}>Remove Recipe</button>
           </div>
          </div>
        ))}
      </div>
      { popupActive && <div className="popup">
        <div className="popup-inner">
          <h2>Add a new recipe</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={form.title} placeholder="What would you like to make today?" onChange={e => setForm({...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Ingredients</label>
              {
                form.ingredients.map((ingredient, i) => (
                  <input type="text" 
                  key={i}
                  value={ingredient} 
                  onChange={e => handleIngredient(e, i)} />
                ))
              }
             <button type="button" onClick={handleIngredientCount}>Add Ingredient</button> 
            </div>
            <div className="form-group">
              <label>Steps</label>
              {
                form.steps.map((step, i) => (
                  <textarea type="text" 
                  key={i}
                  value={step} 
                  onChange={e => handleStep(e, i)} />
                ))
              }
             <button type="button" onClick={handleStepCount}>Add Step</button> 
            </div>
            <div className="form-btn-group">
              <button type="submit" className="submit-btn">Submit</button>
              <button type="button" className="form-btn-cancel" onClick={() => setPopupActive(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
      }
    </div>
  );
}

export default App;
