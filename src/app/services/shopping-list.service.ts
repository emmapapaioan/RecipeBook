import { Injectable } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Observable, Subject, forkJoin } from 'rxjs';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
  apiURL: string = 'https://recipe-book-41dd4-default-rtdb.europe-west1.firebasedatabase.app/secretKey=r3cip3B00k!/';
  shoppingListJSON: string = 'shoppingList.json';
  startEditing = new Subject<string>();
  ingredientsChanged = new Subject<Ingredient[]>;
  ingredients: Ingredient[] = [];
  
  constructor(private dataStorageService: DataStorageService) {}

  getIngredientById(id: string): Ingredient {
    return this.ingredients.find(ingredient => ingredient.id === id);
  }

  getIngredientByName(name: string) {
    return this.ingredients.find(ingredient => {
      return ingredient.name.toLowerCase() === name.toLowerCase();
    });
  }
  
  getIngredients() {
    return this.ingredients;
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = this.sortIngredients(ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  sortIngredients(ingredients: Ingredient[]): Ingredient[] {
    return ingredients.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  addToShoppingList(ingredients: Ingredient[]) {
    let observables: Observable<Object>[] = [];
    ingredients.forEach(ingredient => {
      let existingIngredient = this.getIngredientByName(ingredient.name);
      if (existingIngredient) {
        ingredient.amount += existingIngredient.amount;
        observables.push(this.dataStorageService.updateIngredient(ingredient));
      } else {
        observables.push(this.dataStorageService.addIngredient(ingredient));
      }
    });

    return forkJoin(observables);
  }
}