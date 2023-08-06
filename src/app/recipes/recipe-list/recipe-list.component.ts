import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { DataStorageService } from '../../services/data-storage.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
  matDialogConfig: MatDialogConfig = {};

  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    public dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.fetchRecipes();
    this.subToRecipesChange();
  }

  onSelectNewRecipe() {
    this.recipeService.setRecipeAddMode(true);
    this.matDialogConfig = {
      height: '80%',
      width: '55%'
    };
    const dialogRef = this.dialog.open(RecipeEditComponent, this.matDialogConfig);
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
