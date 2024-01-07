import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../shared/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { DataStorageService } from '../../_services/data-storage.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/_services/authorization.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading: boolean = false;
  matDialogConfig: MatDialogConfig = {};
  private userSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(
    private recipeService: RecipeService,
    public dialog: MatDialog,
    private authService: AuthorizationService,
    private dataStorageService: DataStorageService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.subToRecipesChange();
    this.subToUserAuth();
    this.isAuthenticated && this.fetchRecipes();
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
    this.isLoading = true;
    this.dataStorageService.fetchRecipes().subscribe({
      next: (res: Recipe[]) => {
        this.recipeService.setRecipes(res);
        this.recipes = this.recipeService.getRecipes();
        this.isLoading = false;
      },
      error: (error) => {
        this.alertService.infoMessage(false, 'Failed to load recipes. Please reload the page. ' + error.message);
        this.isLoading = false;
      }
    });
  }

  subToRecipesChange() {
    this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => { this.recipes = recipes; }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  subToUserAuth() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSub && this.userSub.unsubscribe();
  }
}
