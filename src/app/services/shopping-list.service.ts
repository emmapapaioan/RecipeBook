import { Injectable } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Observable, Subject, catchError, forkJoin, tap, throwError } from 'rxjs';
import { DataStorageService } from './data-storage.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
  apiURL: string = 'https://recipe-book-41dd4-default-rtdb.europe-west1.firebasedatabase.app/secretKey=r3cip3B00k!/';
  shoppingListJSON: string = 'shoppingList.json';
  startEditing = new Subject<string>();
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredients: Ingredient[] = [];
  
  constructor(private dataStorageService: DataStorageService, private alertService: AlertService) {}

  getIngredientById(id: string): Ingredient {
    return this.ingredients.find(ingredient => ingredient.id === id);
  }

  getIngredientByName(name: string) {
    return this.ingredients.find(ingredient => {
      return ingredient.name.toLowerCase() === name.toLowerCase();
    });
  }
  
  getIngredients() {
    return this.ingredients.slice();
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = this.sortIngredients(ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  sortIngredients(ingredients: Ingredient[]): Ingredient[] {
    return ingredients.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  addIngredient(ingredient: Ingredient) {
    return this.dataStorageService.addIngredient(ingredient).pipe(
      tap(() => this.fetchAndBroadcastIngredients()),
      catchError((error) => {
        this.alertService.infoMessage(false, `Failed to add Ingredient ${ingredient.name}. Error: ${error.message}`);
        return throwError(() => new Error(error));
      })
    );
  }

  updateIngredient(ingredient: Ingredient) {
    return this.dataStorageService.updateIngredient(ingredient).pipe(
      tap(() => this.fetchAndBroadcastIngredients()),
      catchError((error) => {
        this.alertService.infoMessage(false, `Failed to update Ingredient ${ingredient.name}. Error: ${error.message}`);
        return throwError(() => new Error(error));
      })
    );
  }

  deleteIngredient(ingredient: Ingredient) {
    return this.dataStorageService.deleteIngredient(ingredient).pipe(
      tap(() => this.fetchAndBroadcastIngredients()),
      catchError((error) => {
        this.alertService.infoMessage(false, `Failed to delete Ingredient ${ingredient.name}. Error: ${error.message}`);
        return throwError(() => new Error(error));
      })
    );
  }

  fetchAndBroadcastIngredients() {
    return this.dataStorageService.fetchShoppingList().pipe(
      tap((res: Ingredient[]) => {
        this.setIngredients(res);
      }),
      catchError((error) => {
        this.alertService.infoMessage(false, 'Failed to load Shopping List. Please reload the page. ' + error.message);
        return throwError(() => new Error(error));
      })
    );
  }

  addToShoppingList(ingredients: Ingredient[]) {
    let observables: Observable<Object>[] = [];
    ingredients.forEach(ingredient => {
      let existingIngredient = this.getIngredientByName(ingredient.name);
      if (existingIngredient) {
        existingIngredient.amount += ingredient.amount;
        observables.push(this.updateIngredient(existingIngredient));
      } else {
        observables.push(this.addIngredient(ingredient));
      }
    });
    return forkJoin(observables).pipe(
      tap(() => this.fetchAndBroadcastIngredients())
    );
  }
}