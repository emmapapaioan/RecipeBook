import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';

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
    private modalService: NgbModal) { }

  ngOnInit() {
      this.dataStorageService.fetchRecipes().subscribe({
        next: (response: Recipe[]) => {
          this.recipeService.setRecipes(response);
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
    this.modalService.open(RecipeEditComponent, {backdrop: 'static', size: 'lg'});
  }

  ngOnDestroy() {
    if (this.addModeSubscription) {
      this.addModeSubscription.unsubscribe();
    }
  }

}
