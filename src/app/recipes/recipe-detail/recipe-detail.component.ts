import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../../services/data-storage.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';
import { AlertService } from 'src/app/services/alert.service';
import { PdfService } from 'src/app/services/pdf.service';
import { fontName, fontStyle } from 'src/app/shared/fonts.model';
import { PdfOptions } from 'src/app/shared/pdfOptions.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Output() addToShoppingListEvent = new EventEmitter<Ingredient[]>();
  @ViewChild('recipeImage') recipeImage: ElementRef;
  recipe: Recipe;
  id: string;
  recipesEmpty: boolean = false;
  private paramsSubscription: Subscription;
  private editModeSubscription: Subscription;
  displayedColumns: string[] = ['name', 'quantity'];
  matDialogConfig: MatDialogConfig = {};
  
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private shoppingListService: ShoppingListService,
    private pdfService: PdfService
  ) { }

  ngOnInit(): void {
    this.recipeService.setRecipeDetailMode(true);
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
      if (!this.recipe) {
        this.handleRefresh();
      }
    });

    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipe = this.recipeService.getRecipe(this.id);
    });
  }

  ngOnDestroy(): void {
    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }

    this.recipeService.setRecipeDetailMode(false);
  }

  onAddToShoppingList() {
    this.recipeService.setRecipeEditMode(false);
    this.shoppingListService.addToShoppingList(this.recipe.ingredients).subscribe({
      next: () => this.alertService.infoMessage(true, 'Shopping List was successfully updated!'),
      error: () => this.alertService.infoMessage(false, 'Failed updating the Shopping List. Please try again.')
    });
  }
  
  onEditRecipe() {
    this.recipeService.setRecipeEditMode(true);
    this.matDialogConfig = {
      data: this.id,
      height: 'auto',
      width: '55%'
    };
    const dialogRef = this.dialog.open(RecipeEditComponent, this.matDialogConfig);
  }

  printRecipe() {
    const pdfOptions: PdfOptions = {
      leftMargin : 15, 
      imageWidth : 100, 
      imageHeight : 100, 
      marginTop : 10, 
      maxWidth : 180, 
      fontSize : 14, 
      fontName : fontName.helvetica, 
      fontStyle : fontStyle.normal, 
      titlesFontStyle : fontStyle.bold
    };
    this.pdfService.generateRecipePdf(this.recipe, pdfOptions);
  }

  async onDeleteRecipe() {
    const result = await this.alertService.approveMessage(
      'warning',
      'Delete Recipe',
      `Recipe "${this.recipe.name}" is going to be deleted. Are you sure?`,
      'Delete'
    );
    if (result.isConfirmed) {
      this.recipeService.setRecipeEditMode(false);
      this.dataStorageService.deleteRecipe(this.recipe).subscribe({
        next: () => {
          this.handleSuccessfullRecipeDelete();
        },
        error: (error) => {
          this.alertService.infoMessage(false, `Failed to delete recipe ${this.recipe.name} was not successfull. Error details: ${error.message}`);
        }
      });
    }
  }

  handleSuccessfullRecipeDelete() {
    this.alertService.infoMessage(true, 'Recipe ' + this.recipe.name + ' was successfully deleted.');
    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipe = this.recipeService.getRecipe(this.id);
      if (!this.recipe) {
        this.router.navigate(['/recipes']);
      }
    });
    this.router.navigate(['/recipes']);
  }

  handleRefresh() {
    this.dataStorageService.fetchRecipes().subscribe({
      next: (res: Recipe[]) => {
        this.recipeService.setRecipes(res);
        this.recipe = this.recipeService.getRecipe(this.id);
      },
      error: (error) => {
        this.alertService.infoMessage(false, 'Failed to load recipe. Please reaload the page. ' + error.message);
      }
    });
  }
}

