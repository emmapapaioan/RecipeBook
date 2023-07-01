import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  recipe: Recipe;
  id: number;
  editMode: boolean = false;
  addMode: boolean = false;
  recipeForm: FormGroup;
  newIngredients: Ingredient[] = [];

  constructor(
    public recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private dataStorageService: DataStorageService) { }

  ngOnInit() {
    // Retrieve the recipe id for which the edit will apply 

    this.route.params.subscribe(
      (params: Params) => {
        this.id = + params['id'];

        if (!isNaN(this.id)) {
          // Get the current recipe
          this.recipe = this.recipeService.getRecipe(this.id);
          // Edit mode will be true only when there is an id defined
          this.editMode = this.recipeService.setRecipeEditMode(params['id'] != null);
        } else {
          this.addMode = this.recipeService.setRecipeAddMode(true);
        }

        this.initForm();
      }
    );
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
      if (!isNaN(this.id)) {
        this.router.navigate(['/recipes', this.id]);
      } else {
        this.router.navigate(['/recipes']);
      }
    }
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
      })
    )
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



