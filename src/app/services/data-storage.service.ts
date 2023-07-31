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
  
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private recipeService: RecipeService) { }

  storeRecipe(newRecipe: Recipe) {
    const apiURL = `${this.apiURL}recipes/${newRecipe.id}.json`;
    this.http.put(apiURL, newRecipe).subscribe({
        next: () => {
          this.alertService.infoMessage(true, 'Recipe ' + newRecipe.name + ' was successfully stored in the database.');
          this.fetchRecipes().subscribe(recipes => { this.recipeService.setRecipes(recipes); });
        },
        error: (error) => {
          this.alertService.infoMessage(false, 'Error storing the recipe to the database. Error details: ' + error.message);
        }
    });
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
    this.http.put(apiUrl, recipe).subscribe({
        next: () => {
          this.alertService.infoMessage(true, `Recipe ${recipe.name} was successfully updated.`);
          this.fetchRecipes().subscribe(recipes => { this.recipeService.setRecipes(recipes); });
        },
        error: (error) => {
          this.alertService.infoMessage(false, `Recipe ${recipe.name} was not updated. Error: ${error.message}`);
        }
    });
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
  
  addIngredients(ingredients: Ingredient[]) {
    const addIngredientObservables = ingredients.map(ingredient => {
      let apiURL = `${this.apiURL}shoppingList/${ingredient.id}.json`;
      return this.http.put(apiURL, ingredient);
    });
    forkJoin(addIngredientObservables).subscribe({
      next: () => {
        this.alertService.infoMessage(true, `Shopping List was successfully added.`);
      },
      error: (error) => {
        this.alertService.infoMessage(false, `Failed to add ingredients. Error: ${error.message}`);
      }
    });
  }

  fetchShoppingList() {
    return this.http.get(this.apiURL + this.shoppingListJSON).pipe(
      map(response => {
        const shoppingList: Ingredient[] = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            shoppingList.push({ ...response[key], id: key });
          }
        }
        this.ingredients.next(shoppingList);
        return shoppingList;
      })
    );
  }
}