import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10),
    new Ingredient("Egg", 15)
  ];

  constructor() { }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    const itemFound = this.ingredients.find(item=>item.name === ingredient.name);

    if(itemFound){
      itemFound.amount += ingredient.amount;
    }else{
      this.ingredients.push(ingredient);
    }
    
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  deleteIngredient(ingredient: Ingredient) {
    const itemFound = this.ingredients.find(item=>item.name === ingredient.name);

    if(itemFound){
      itemFound.amount - ingredient.amount >= 0 ? 
      itemFound.amount -= ingredient.amount : window.alert('Wrong amount to be deleted.');
    }else{
      window.alert('Ingredient '+ itemFound.name +' doesn\'t exist in the shopping list.');
    }
    
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

}
