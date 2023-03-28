import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit, OnChanges{

  recipes: Recipe[];

  constructor(private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute){}
  
  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnChanges() {
    this.recipes = this.recipeService.getRecipes();
  }

  onSelectNewRecipe() {
    // The below is equal to routerLink='new' on the html
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
