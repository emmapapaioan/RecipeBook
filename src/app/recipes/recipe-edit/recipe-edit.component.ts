import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})

export class RecipeEditComponent implements OnInit, OnDestroy {
  @Output() selectedNewRecipe = true;
  @ViewChild('form', { static: false }) form: NgForm;
  recipe: Recipe;
  currentRecipe: Recipe;
  id: number;
  newIngredients: Ingredient[] = [];

  constructor(public recipeService: RecipeService,
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Retrieve the recipe id for which the edit will apply 
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        // Edit mode will be true only when there is an id defined
        this.recipeService.setRecipeEditMode(params['id'] != null);
      }
    );

    // Get the current recipe
    this.recipe = this.recipeService.getRecipe(this.id);
    this.currentRecipe = {...this.recipe};
   }

  ngOnDestroy() {
    this.recipeService.setRecipeEditMode(false);
  }

  adjustTextareaHeight(textarea: ElementRef): void {
    const nativeElement = textarea.nativeElement;
    nativeElement.style.height = 'auto';
    nativeElement.style.height = nativeElement.scrollHeight + 'px';
  }
  // onAddNewRecipe() {
  //   const name = this.nameInputRef.nativeElement.value;
  //   const description = this.descriptionInput.nativeElement.value;
  //   const imagePath = this.imagePathInput.nativeElement.value;
  //   const recipe = new Recipe(name,description,imagePath); 
  //   this.recipeServise.addRecipe(recipe);
  //   //this.selectedNewRecipe = !this.selectedNewRecipe;
  // }

  onCancel() {
    this.recipeService.setRecipeEditMode(false);
  }

  onSave() {
    if (this.form.valid) {
      const newRecipe = {...this.currentRecipe};
      this.recipeService.updateRecipe(this.id, newRecipe);
      alert('Recipe "' + this.currentRecipe.name + '" was successfully updated.');
      this.recipeService.setRecipeEditMode(false);
      // const name = this.form.value.name;
      // const imagePath = this.form.value.imagePath;
      // const description = this.form.value.description;

      // const ingredients = this.recipe.ingredients.map((ingredient, index) => {
      //   return {
      //     name: this.form.value['ingredient' + index],
      //     amount: this.form.value['amount' + index]
      //   };
      // });
    }
  }

  addIngredient() {
    if (this.newIngredients.length === 0) {
      let newIngredient = { name: '', amount: null };
      this.currentRecipe.ingredients.push(newIngredient);
    } else {
      this.newIngredients.filter((ingredient: Ingredient) => {
        ingredient.name !== '',
          ingredient.amount !== null
      });
    }
  }

  removeIngredient(index: number) {
    this.currentRecipe.ingredients.splice(index, 1);
  }

}
