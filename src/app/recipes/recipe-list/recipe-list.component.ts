import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  isLoading: boolean = true;
  addModeSubscription: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
      this.dataStorageService.fetchRecipes().subscribe({
        next: (response: Recipe[]) => {
          this.recipeService.addRecipes(response);
          this.recipes = this.recipeService.getRecipes();
        },
        error: (error) => {
          console.log(error.message);
        },
        complete: () => {
          this.isLoading = false;
        }
      })

    this.recipeService.recipesChanged
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
  }

  onSelectNewRecipe() {
    this.recipeService.setRecipeAddMode(true);
    // The below is equal to routerLink='new' on the html
    this.router.navigate(['recipes', 'new']);
  }

  ngOnDestroy() {
    if (this.addModeSubscription) {
      this.addModeSubscription.unsubscribe();
    }
  }

}
