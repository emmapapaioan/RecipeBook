import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Ingredient } from 'src/app/_models/ingredient.model';
import { Recipe } from '../../_models/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { Subscription, finalize } from 'rxjs';

import { DataStorageService } from '../../_services/data-storage.service';
import { ShoppingListService } from '../../_services/shopping-list.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';
import { AlertService } from 'src/app/_services/alert.service';
import { PrintService } from 'src/app/_services/print.service';
import { HelveticaFont } from 'src/app/_models/fonts.model';
import { PdfOptions } from 'src/app/_models/pdfOptions.model';
import { AuthorizationService } from 'src/app/_services/authorization.service';
import { FirebaseStorageService } from 'src/app/_services/firebase-storage.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Output() addToShoppingListEvent = new EventEmitter<Ingredient[]>();
  recipe: Recipe;
  id: string;
  recipesEmpty: boolean = false;
  private paramsSub: Subscription;
  private recipesChangedSub: Subscription;
  displayedColumns: string[] = ['name', 'quantity'];
  private userSub: Subscription;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private shoppingListService: ShoppingListService,
    private printService: PrintService,
    private authService: AuthorizationService,
    private firebaseStorageService: FirebaseStorageService
  ) { }

  ngOnInit(): void {
    this.recipeService.setRecipeDetailMode(true);
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
      if (!this.recipe) {
        this.handleRefresh();
      }
    });

    this.recipesChangedSub = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipe = this.recipeService.getRecipe(this.id);
    });

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.recipesChangedSub && this.recipesChangedSub.unsubscribe();
    this.paramsSub && this.paramsSub.unsubscribe();
    this.recipeService.setRecipeDetailMode(false);
    this.userSub && this.userSub.unsubscribe();
  }

  onAddToShoppingList() {
    this.isLoading = true;
    this.recipeService.setRecipeEditMode(false);
    this.shoppingListService.addToShoppingList(this.recipe.ingredients)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: () => this.alertService.infoMessage(true, 'Shopping List was successfully updated!'),
      error: () => this.alertService.infoMessage(false, 'Failed updating the Shopping List. Please try again.')
    });
  }

  onEditRecipe() {
    this.recipeService.setRecipeEditMode(true);
    const matDialogConfig: MatDialogConfig = {
      data: this.id,
      width: '60%'
    };
    const dialogRef = this.dialog.open(RecipeEditComponent, matDialogConfig);
  }

  printRecipe() {
    this.isLoading = true;
    const pdfOptions: PdfOptions = {
      leftMargin: 15,
      imageWidth: 100,
      imageHeight: 100,
      marginTop: 10,
      maxWidth: 180,
      fontSize: 14,
      fontName: HelveticaFont.fontName,
      fontStyle: HelveticaFont.fontStyles[0],
      titlesFontStyle: HelveticaFont.fontStyles[1],
      imageHtml: '#ingredients'
    };

    this.firebaseStorageService.getImageAsBlob(this.recipe.imagePath).then(imgBlob => {
      this.printService.generateRecipePdf(this.recipe, pdfOptions, imgBlob).then(() => {
        this.isLoading = false;
      });
    }).catch(error => {
      console.error('Error retrieving image: ', error);
      this.isLoading = false;
    });
  }

  async onDeleteRecipe() {
    const result = await this.alertService.approveMessage(
      'warning',
      'Delete Recipe',
      `Recipe "${this.recipe.name}" is going to be deleted. Are you sure?`,
      'Delete'
    );
    if (result.isConfirmed) {
      this.isLoading = true;
      this.recipeService.setRecipeEditMode(false);
      this.dataStorageService.deleteRecipe(this.recipe).subscribe({
        next: () => {
          this.handleSuccessfullRecipeDelete();
        },
        error: () => {
          this.isLoading = false;
          this.alertService.infoMessage(false, `Failed to delete recipe ${this.recipe.name} was not successfull.`);
        }
      });
    }
  }

  handleSuccessfullRecipeDelete() {
    this.alertService.infoMessage(true, 'Recipe ' + this.recipe.name + ' was successfully deleted.');
    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.isLoading = false;
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
      error: () => {
        this.alertService.infoMessage(false, 'Failed to load recipe. Please reload the page.');
      }
    });
  }
}

