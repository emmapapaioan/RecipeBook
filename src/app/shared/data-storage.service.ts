import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  apiURL: string = 'https://recipe-book-41dd4-default-rtdb.europe-west1.firebasedatabase.app/secretKey=r3cip3B00k!/';
  recipesJSON: string = 'recipes.json'
  
  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    const postRecipes: Recipe[] = this.recipeService.getRecipes();
    // The put request override everything that is written in the db and puts the new data
    this.http
      .put(this.apiURL + this.recipesJSON, postRecipes)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.apiURL + this.recipesJSON);
  }
}