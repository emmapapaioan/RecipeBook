import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent {
@Input() recipe: Recipe;
@Output() addToShoppingListEvent = new EventEmitter<Ingredient[]>();

constructor(private recipeService : RecipeService) {}

onAddToShoppingList() {
  this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
}

onEditRecipe(newRecipe: Recipe) {
  this.recipeService.updateRecipe(
    this.recipeService.getRecipes().indexOf(this.recipe), newRecipe
  );
}

onDeleteRecipe() {
  this.recipeService.deleteRecipe(
    this.recipeService.getRecipes().indexOf(this.recipe)
  );
}
}
