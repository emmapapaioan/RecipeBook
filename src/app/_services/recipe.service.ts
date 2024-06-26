import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from '../_models/recipe.model';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  private recipes: Recipe[] = [];

  hasRecipes: boolean = false;
  recipesChanged = new Subject<Recipe[]>();
  recipeEditMode: boolean = false;
  recipeAddMode: boolean = false;
  recipeDetailMode: boolean = false;
  recipeEditModeChanged = new Subject<boolean>();
  recipeAddModeChanged = new Subject<boolean>();
  recipeDetailModeChanged = new Subject<boolean>();

  constructor() { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: string): Recipe {
    const recipe = this.recipes.find((recipe) => recipe.id === id);
    if (recipe) {
      recipe.ingredients.sort((a, b) => a.name.localeCompare(b.name));
    }
    return recipe;
  }


  getRecipesLength() {
    return this.recipes.length;
  }

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
    return this.recipeDetailMode;
  }

  setRecipeDetailMode(value: boolean) {
    this.recipeDetailMode = value;
    this.recipeDetailModeChanged.next(value);
    return this.recipeDetailMode;
  }
}
