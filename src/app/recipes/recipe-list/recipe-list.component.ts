import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { DataStorageService } from '../../services/data-storage.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading: boolean = true;

  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private modalService: NgbModal,
    private alertService: AlertService) { }

  ngOnInit() {
    this.fetchRecipes();
    this.subToRecipesChange();
  }

  onSelectNewRecipe() {
    this.recipeService.setRecipeAddMode(true);
    this.modalService.open(RecipeEditComponent, {backdrop: 'static', size: 'lg'});
  }

  fetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe({
      next: (res: Recipe[]) => {
        this.recipeService.setRecipes(res);
        this.recipes = this.recipeService.getRecipes();
      },
      error: (error) => {
        this.alertService.infoMessage(false, 'Failed to load recipes. Please reaload the page. ' + error.message);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  subToRecipesChange() {
    this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => { this.recipes = recipes; }
    );
  }

}
