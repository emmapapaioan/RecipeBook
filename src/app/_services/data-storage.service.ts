import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../shared/recipe.model';
import { BehaviorSubject, Observable, map, of, switchMap, take, throwError } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { User } from '../shared/user.model';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  apiURL: string = 'https://recipe-book-41dd4-default-rtdb.europe-west1.firebasedatabase.app/';
  recipesJSON: string = 'recipes.json';
  shoppingListJSON: string = 'shoppingList.json';
  private ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject<Ingredient[]>([]);
  user = new BehaviorSubject<User>(null);
  
  constructor(private http: HttpClient, private authService: AuthorizationService) {}

  private getUserSpecificUrl(endpoint: string): Observable<string> {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        if (user) {
          return `${this.apiURL}userRecipes/${user.id}/${endpoint}`;
        } else {
          return null;
        }
      })
    );
  }
  
  storeRecipe(newRecipe: Recipe) {
    return this.getUserSpecificUrl(`recipes/${newRecipe.id}.json`).pipe(
      switchMap(url => {
        if (url) {
          return this.http.put(url, newRecipe);
        } else {
          return throwError(() => new Error('No user ID found'));
        }
      })
    );
  }
  
  fetchRecipes(): Observable<Recipe[]> {
    return this.getUserSpecificUrl(this.recipesJSON).pipe(
      switchMap(url => {
        if (url) {
          return this.http.get<Recipe[]>(url).pipe(
            map(response => {
              const recipesArray: Recipe[] = [];
              for (let key in response) {
                if (response.hasOwnProperty(key)) {
                  recipesArray.push({ ...response[key], id: key });
                }
              }
              return recipesArray;
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

  deleteRecipe(recipe: Recipe) {
    return this.getUserSpecificUrl(`recipes/${recipe.id}.json`).pipe(
      switchMap(url => {
        if (url) {
          return this.http.delete(url);
        } else {
          return throwError(() => new Error('No user ID found')); // or handle as needed
        }
      })
    );
  }
  

  updateRecipe(id: string, recipe: Recipe) {
    return this.getUserSpecificUrl(`recipes/${id}.json`).pipe(
      switchMap(url => {
        if (url) {
          return this.http.put(url, recipe);
        } else {
          return throwError(() => new Error('No user ID found'));
        }
      })
    );
  }
  
  addIngredient(ingredient: Ingredient) {
    return this.getUserSpecificUrl(`shoppingList/${ingredient.id}.json`).pipe(
      switchMap(url => {
        if (url) {
          return this.http.put(url, ingredient);
        } else {
          return throwError(() => new Error('No user ID found'));
        }
      })
    );
  }
  
  updateIngredient(ingredient: Ingredient) {
    return this.getUserSpecificUrl(`shoppingList/${ingredient.id}.json`).pipe(
      switchMap(url => {
        if (url) {
          return this.http.put(url, ingredient);
        } else {
          return throwError(() => new Error('No user ID found'));
        }
      })
    );
  }
  
  deleteIngredient(ingredient: Ingredient) {
    return this.getUserSpecificUrl(`shoppingList/${ingredient.id}.json`).pipe(
      switchMap(url => {
        if (url) {
          return this.http.delete(url);
        } else {
          return throwError(() => new Error('No user ID found'));
        }
      })
    );
  }
  
  fetchShoppingList() {
    return this.getUserSpecificUrl(this.shoppingListJSON).pipe(
      switchMap(url => {
        if (url) {
          return this.http.get(url).pipe(
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
        } else {
          return of([]);
        }
      })
    );
  }
}