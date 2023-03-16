import { Component, ElementRef, Output, ViewChild } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})


export class RecipeEditComponent {
@Output() selectedNewRecipe = true;
@ViewChild('nameInput', {static: false}) nameInputRef : ElementRef;
@ViewChild('descriptionInput', {static: false}) descriptionInput : ElementRef;
@ViewChild('imagePathInput', {static: false}) imagePathInput : ElementRef;

  constructor(private recipeServise: RecipeService) {}

  // onAddNewRecipe() {
  //   const name = this.nameInputRef.nativeElement.value;
  //   const description = this.descriptionInput.nativeElement.value;
  //   const imagePath = this.imagePathInput.nativeElement.value;
  //   const recipe = new Recipe(name,description,imagePath); 
  //   this.recipeServise.addRecipe(recipe);
  //   //this.selectedNewRecipe = !this.selectedNewRecipe;
  // }
}
