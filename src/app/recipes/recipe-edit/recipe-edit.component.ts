import { Component, ElementRef, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../_models/recipe.model';
import { RecipeService } from '../../_services/recipe.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/_models/ingredient.model';
import { DataStorageService } from '../../_services/data-storage.service';
import { v4 as uuidv4 } from 'uuid';
import { AlertService } from 'src/app/_services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseStorageService } from 'src/app/_services/firebase-storage.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})

export class RecipeEditComponent implements OnInit, OnDestroy {
  @Output() selectedNewRecipe = true;
  @ViewChild('descriptionInput', { static: false }) descriptionInput: ElementRef;

  recipe: Recipe;
  editMode: boolean = false;
  addMode: boolean = false;
  recipeForm: FormGroup;
  newIngredients: Ingredient[] = [];
  file: File;
  isLoading: boolean = false;
  cannotSaveMsg: string = 'Please add all required data before saving your recipe.';
  saveIsLoadingMsg: string = 'Please wait until your recipe is fully saved.';

  constructor(
    public recipeService: RecipeService,
    private router: Router,
    private dataStorageService: DataStorageService,
    private alertService: AlertService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private firebaseStorageService: FirebaseStorageService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.recipe = this.recipeService.getRecipe(this.id);
      this.editMode = this.recipeService.setRecipeEditMode(this.id != null);
    } else {
      this.addMode = this.recipeService.setRecipeAddMode(true);
    }
    this.initForm();
  }

  ngOnDestroy() {
    if (this.recipeService.getRecipeEditMode) {
      this.recipeService.setRecipeEditMode(false);
    } else {
      this.recipeService.setRecipeAddMode(false);
    }
  }

  private initForm() {
    let recipeName = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      recipeName = this.recipe.name;
      recipeDescription = this.recipe.description;
      recipeIngredients = new FormArray([]);

      if (this.recipe['ingredients']) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^(\d+(\.\d+)?|\d+(\.\d+)?\/\d+(\.\d+)?)$/)
              ])
            })
          );
        }
      }
    } else {
      recipeIngredients.push(
        new FormGroup({
          'name': new FormControl(null, Validators.required),
          'amount': new FormControl(null, [
            Validators.required,
            Validators.pattern(/^(\d+(\.\d+)?|\d+(\.\d+)?\/\d+(\.\d+)?)$/)
          ])
        })
      );
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  handleModalClosing() {
    if (this.editMode) {
      this.recipeService.setRecipeEditMode(false);
      this.router.navigate(['/recipes', this.id]);
    } else {
      this.recipeService.setRecipeAddMode(false);
    }

    this.dialog.closeAll();
  }

  get ingredients() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  getIngredients(): Ingredient[] {
    const ingredients = this.ingredients.map(control => {
      return { name: control.get('name').value, amount: control.get('amount').value };
    });

    return ingredients;
  }

  adjustTextareaHeight(): void {
    const nativeElement = this.descriptionInput.nativeElement;
    nativeElement.style.height = 'auto';
    nativeElement.style.height = nativeElement.scrollHeight + 'px';
  }

  onAddIngredient() {
    this.ingredients.push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^(\d+(\.\d+)?|\d+(\.\d+)?\/\d+(\.\d+)?)$/)
        ])
      }));
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  onSubmit() {
    this.isLoading = true;
    let url;
    if (this.editMode) {
      url = this.recipe.imagePath;
      const newRecipe = this.createNewRecipe(url);
      this.handleNewRecipe(newRecipe);
    } else {
      this.onStoreImageAndGetUrl();
    }
  }

  createNewRecipe(url: string) {
    const newRecipe: Recipe = {
      name: this.recipeForm.value['name'],
      description: this.recipeForm.value['description'],
      imagePath: url,
      ingredients: this.getIngredients(),
      id: uuidv4()
    };
    return newRecipe;
  }

  onStoreImageAndGetUrl() {
    this.firebaseStorageService.uploadImageAndGetUrl(this.file)
      .then(url => {
        const newRecipe = this.createNewRecipe(url);
        this.handleNewRecipe(newRecipe);
      })
      .catch(error => {
        console.error("Error uploading file:", error);
      });
  }

  handleNewRecipe(newRecipe: Recipe) {
    if (this.editMode) {
      this.updateRecipe(this.recipe.id, newRecipe);
    } else {
      this.storeRecipe(newRecipe);
    }

    this.handleModalClosing();
  }

  onCancel() {
    this.handleModalClosing();
  }

  onModalClose() {
    this.handleModalClosing();
  }

  updateRecipe(id: string, recipe: Recipe) {
    this.dataStorageService.updateRecipe(id, recipe).subscribe({
      next: () => {
        this.alertService.infoMessage(true, `Recipe ${recipe.name} was successfully updated.`);
        this.dataStorageService.fetchRecipes().subscribe(recipes => {
          this.recipeService.setRecipes(recipes);
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.alertService.infoMessage(false, `Recipe ${recipe.name} was not updated. Error: ${error.message}`);
      }
    });
  }

  storeRecipe(recipe: Recipe) {
    this.dataStorageService.storeRecipe(recipe).subscribe({
      next: () => {
        this.alertService.infoMessage(true, 'Recipe ' + recipe.name + ' was successfully stored in the database.');
        this.dataStorageService.fetchRecipes().subscribe(recipes => {
          this.recipeService.setRecipes(recipes);
          this.isLoading = false;
        });
      },
      error: () => {
        this.isLoading = false;
        this.alertService.infoMessage(false, 'Error storing the recipe to the database.');
      }
    });
  }

  onFileDropped(file: File) {
    this.file = file;
  }

  get isSubmitBtnDisabled() {
    return this.addMode && (!this.recipeForm.valid || !this.file) ||
           this.editMode && !this.recipeForm.valid ||
           this.isLoading;
  }
}
