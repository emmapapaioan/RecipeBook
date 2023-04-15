import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [];

  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute){}
  
  ngOnInit() {
    this.dataStorageService.fetchRecipes().subscribe({
      next: (response: Recipe[]) => {
        this.recipeService.addRecipes(response);
        this.recipes = this.recipeService.getRecipes();
        console.log(response)
      },
      error: (error) => {
        console.log(error.message);
      }
    });

    this.recipeService.recipeUpdated.subscribe((index: number) => {
      this.recipes[index] = this.recipeService.getRecipe(index);
    });
  }

  onSelectNewRecipe() {
    // The below is equal to routerLink='new' on the html
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
