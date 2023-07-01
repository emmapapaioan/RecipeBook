import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';
import { Ingredient } from './ingredient.model';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  apiURL: string = 'https://recipe-book-41dd4-default-rtdb.europe-west1.firebasedatabase.app/secretKey=r3cip3B00k!/';
  recipesJSON: string = 'recipes.json';
  shoppingListJSON: string = 'shoppingList.json';

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    const postRecipes: Recipe[] = this.recipeService.getRecipes();
    for (let recipe of postRecipes) {
      this.storeRecipe(recipe);
    }
  }

  // Add a new recipe to the db
  storeRecipe(newRecipe: Recipe) {
    this.http.post(this.apiURL + this.recipesJSON , newRecipe)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Recipe ' + newRecipe.name + ' was successfully stored in the database.',
            confirmButtonColor: '#28a745'
          })
          console.log(response)
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error storing the recipe to the database. Error details: ' + error.message
          })
        }
      });
  }
  
  fetchRecipes() {
    return this.http.get(this.apiURL + this.recipesJSON).pipe(
      map(response => {
        const recipesArray: Recipe[] = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            recipesArray.push({...response[key], id: key});
          }
        }
        return recipesArray;
      })
    );
  }

  deleteRecipe(recipe: Recipe) {
    const apiUrl = `${this.apiURL}recipes/${recipe.id}.json`;
    return this.http.delete(apiUrl); // Subscribe where it is called
  }

  updateRecipe(id: number, recipe: Recipe) {
    const apiUrl = `${this.apiURL}recipes/${id}.json`;

    this.http.put(apiUrl, recipe)
    .subscribe({
      next : () => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Recipe ${recipe.name} was successfully updated.`,
        confirmButtonColor: '#28a745'
      });
    },
    error : (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Recipe ${recipe.name} was not updated. Error: ${error.message}`
      });
    }
    })
  }
}