import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataStorageService } from '../../services/data-storage.service';
import { v4 as uuidv4 } from 'uuid';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})

export class RecipeEditComponent implements OnInit, OnDestroy {
  @Output() selectedNewRecipe = true;
  @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild('recipeEditModal', { static: false }) recipeEditModal: ElementRef;
  @ViewChild('descriptionInput', { static: false }) descriptionInput: ElementRef;
  @Input() id: string;

  recipe: Recipe;
  editMode: boolean = false;
  addMode: boolean = false;
  recipeForm: FormGroup;
  newIngredients: Ingredient[] = [];

  constructor(
    public recipeService: RecipeService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private dataStorageService: DataStorageService,
    private alertService: AlertService) { }

  ngOnInit() {
    if (typeof this.id !== 'undefined') {
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
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDescription = this.recipe.description;
      recipeIngredients = new FormArray([]);

      if (this.recipe['ingredients']) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
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
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
        })
      );
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
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

    this.activeModal.close();
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  getIngredients(): Ingredient[] {
    const ingredients = this.controls.map(control => {
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
    this.controls.push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      }));
  }

  removeIngredient(index: number) {
    this.controls.splice(index, 1);
  }

  onSubmit() {
    const newRecipe: Recipe = {
      name: this.recipeForm.value['name'],
      description: this.recipeForm.value['description'],
      imagePath: this.recipeForm.value['imagePath'],
      ingredients: this.getIngredients(),
      id: uuidv4()
    };

    if (this.editMode) {
      this.updateRecipe(this.recipe.id, newRecipe);
    } else {
      newRecipe.ingredients.forEach(ingredient => ingredient.id = uuidv4());
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
        });
      },
      error: (error) => {
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
        });
      },
      error: (error) => {
        this.alertService.infoMessage(false, 'Error storing the recipe to the database. Error details: ' + error.message);
      }
    });
  }
}



