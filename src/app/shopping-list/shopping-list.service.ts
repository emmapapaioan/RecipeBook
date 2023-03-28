import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10),
    new Ingredient("Egg", 15)
  ];

  constructor() { }

  getIngredients() {
    this.sortIngredients(this.ingredients);
    return this.ingredients.slice();
  }

  sortIngredients(ingredients: Ingredient[]) {
    ingredients = ingredients.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  addIngredient(ingredient: Ingredient) {
    const itemFound = this.ingredients.find(item =>
      item.name.toLowerCase() === ingredient.name.toLowerCase());

    if (itemFound) {
      itemFound.amount += ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }

    this.sortIngredients(this.ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(ingredient: Ingredient) {
    const itemFound = this.ingredients.find(item =>
      item.name.toLowerCase() === ingredient.name.toLowerCase());

      if (itemFound) {
        itemFound.amount = ingredient.amount;
      } 
  
      this.sortIngredients(this.ingredients);
      this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(ingredient: Ingredient) {
    const itemFound = this.ingredients.find(item =>
      item.name.toLowerCase() === ingredient.name.toLowerCase());

    if (itemFound) {
      itemFound.amount - ingredient.amount >= 0 ?
        itemFound.amount -= ingredient.amount : window.alert('Wrong amount to be deleted.');
    } else {
      window.alert('Ingredient ' + itemFound.name + ' doesn\'t exist in the shopping list.');
    }

    if (itemFound && itemFound.amount === 0) {
      this.ingredients = this.ingredients.filter(item =>
        item.name.toLowerCase() !== ingredient.name.toLowerCase())
    }

    this.sortIngredients(this.ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    for(let ingredient of ingredients){
      this.addIngredient(ingredient);
    }
    
    this.sortIngredients(this.ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

}
