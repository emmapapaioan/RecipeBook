import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
import { AlertService } from './alert.service';
import { Ingredient } from '../shared/ingredient.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  apiURL: string = 'https://recipe-book-41dd4-default-rtdb.europe-west1.firebasedatabase.app/secretKey=r3cip3B00k!/';
  recipesJSON: string = 'recipes.json';
  shoppingListJSON: string = 'shoppingList.json';
  private ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject<Ingredient[]>([]);
  
  constructor(private http: HttpClient) {}

  storeRecipe(newRecipe: Recipe) {
    const apiURL = `${this.apiURL}recipes/${newRecipe.id}.json`;
    return this.http.put(apiURL, newRecipe);
  }

  fetchRecipes() {
    return this.http.get(this.apiURL + this.recipesJSON).pipe(map(response => {
        const recipesArray: Recipe[] = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            recipesArray.push({ ...response[key], id: key });
          }
        }
        return recipesArray;
    }));
  }

  deleteRecipe(recipe: Recipe) {
    const apiUrl = `${this.apiURL}recipes/${recipe.id}.json`;
    return this.http.delete(apiUrl);
  }

  updateRecipe(id: string, recipe: Recipe) {
    const apiUrl = `${this.apiURL}recipes/${id}.json`;
    return this.http.put(apiUrl, recipe);
  }

  addIngredient(ingredient: Ingredient) {
    const apiURL = `${this.apiURL}shoppingList/${ingredient.id}.json`;
    return this.http.put(apiURL, ingredient);
  }

  updateIngredient(ingredient: Ingredient) {
    const apiURL = `${this.apiURL}shoppingList/${ingredient.id}.json`;
    return this.http.put(apiURL, ingredient);
  }

  deleteIngredient(ingredient: Ingredient) {
    const apiUrl = `${this.apiURL}shoppingList/${ingredient.id}.json`;
    return this.http.delete(apiUrl);
  }

  fetchShoppingList() {
    return this.http.get(this.apiURL + this.shoppingListJSON).pipe(map(response => {
      const shoppingList: Ingredient[] = [];
      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          shoppingList.push({ ...response[key], id: key });
        }
      }
      this.ingredients.next(shoppingList);
      return shoppingList;
    }));
  }
}