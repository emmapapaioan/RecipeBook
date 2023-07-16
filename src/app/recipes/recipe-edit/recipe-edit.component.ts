import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataStorageService } from 'src/app/shared/data-storage.service';

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
  @Input() id: number;

  recipe: Recipe;
  editMode: boolean = false;
  addMode: boolean = false;
  recipeForm: FormGroup;
  newIngredients: Ingredient[] = [];

  constructor(
    public recipeService: RecipeService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private dataStorageService: DataStorageService) { }

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

  getIngredients(): { name: string, amount: number }[] {
    const ingredients = this.controls.map(control => {
      const name = control.get('name').value;
      const amount = control.get('amount').value;
      return new Ingredient(name, amount);
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
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.getIngredients(),
      this.recipeService.getRecipesLength() + 1
    );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
      this.dataStorageService.updateRecipe(this.recipe.id, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
      this.dataStorageService.storeRecipe(newRecipe);
    }

    this.handleModalClosing();
  }

  onCancel() {
    this.handleModalClosing();
  }

  onModalClose() {
    this.handleModalClosing();
  }
}



