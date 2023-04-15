import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Output() addToShoppingListEvent = new EventEmitter<Ingredient[]>();
  recipe: Recipe = null;
  id: number = -1;
  recipesEmpty: boolean = false;
  private editModeSubscription: Subscription;

  constructor(
    public recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
    
    this.recipeService.recipeUpdated.subscribe((index: number) => {
      if(index === this.id) {
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }

    this.recipeService.recipeUpdated.unsubscribe();
  }

  onAddToShoppingList() {
    this.recipeService.setRecipeEditMode(false);
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    alert('The ingredients of the recipe "' 
      + this.recipe.name 
      + '" were successfully stored in the shopping list.');
  }

  onEditRecipe() {
    // Or just routerLink=":id/edit" at the html...
    this.recipeService.setRecipeEditMode(true);
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.setRecipeEditMode(false);
    this.recipeService.deleteRecipe(
      this.recipeService.getRecipes().indexOf(this.recipe)
    );
  }

  
}
