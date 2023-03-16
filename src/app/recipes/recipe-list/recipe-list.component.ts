import { Component, OnChanges, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit, OnChanges{

  recipes: Recipe[];
  selectedNewRecipe = false;

  constructor(private recipeService: RecipeService){}

  onSelectNewRecipe() {
    this.selectedNewRecipe = !this.selectedNewRecipe;
  }
  
  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnChanges() {
    this.recipes = this.recipeService.getRecipes();
  }
}
