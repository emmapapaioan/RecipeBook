import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  private recipes: Recipe[] = [];

  hasRecipes: boolean = false;
  recipeUpdated = new EventEmitter<number>();
  recipesChanged = new Subject<Recipe[]>();
  recipeEditMode: boolean = false;
  recipeAddMode: boolean = false;
  recipeDetailMode: boolean = false;
  recipeEditModeChanged = new Subject<boolean>();
  recipeAddModeChanged = new Subject<boolean>();
  recipeDetailModeChanged = new Subject<boolean>();

  constructor(private shoppingListService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
  }

  getRecipes() {
    // Adding the slice method, we are just taking a copy of the actual array
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  getRecipesLength() {
    return this.recipes.length;
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
    //this.recipeUpdated.emit(index);
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addRecipes(recipes: Recipe[]) {
    this.recipes.push(...recipes);
    this.recipesChanged.next(this.recipes.slice());
  }

  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.shoppingListService.addIngredients(ingredients);
  // }

  getRecipeEditMode() {
    return this.recipeEditMode;
  }

  setRecipeEditMode(value: boolean) {
    this.recipeEditMode = value;
    this.recipeEditModeChanged.next(value);
    return this.recipeEditMode;
  }

  getRecipeAddMode() {
    return this.recipeAddMode;
  }

  setRecipeAddMode(value: boolean) {
    this.recipeAddMode = value;
    this.recipeAddModeChanged.next(value);
    return this.recipeAddMode;
  }

  getRecipeDetailMode() {
    return this.recipeAddMode;
  }

  setRecipeDetailMode(value: boolean) {
    this.recipeDetailMode = value;
    this.recipeDetailModeChanged.next(value);
    return this.recipeAddMode;
  }
}