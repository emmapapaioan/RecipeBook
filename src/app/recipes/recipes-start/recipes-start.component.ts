import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipes-start',
  templateUrl: './recipes-start.component.html',
  styleUrls: ['./recipes-start.component.css']
})
export class RecipesStartComponent implements OnInit{
  recipesEmpty: boolean = true;
  constructor(public recipeService: RecipeService) {}

  ngOnInit() {
    this.recipesEmpty = this.recipeService.getRecipesLength() === 0 ? true : false;
  }
}
