import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})

export class RecipeEditComponent implements OnInit, OnDestroy {
  @Output() selectedNewRecipe = true;
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('descriptionInput', { static: false }) descriptionInput: ElementRef;
  @ViewChild('imagePathInput', { static: false }) imagePathInput: ElementRef;
  recipe: Recipe;
  id: number;

  constructor(public recipeService: RecipeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Retrieve the recipy id for which the edit will apply 
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        // Edit mode will be true only when there is an id defined
        this.recipeService.setRecipeEditMode(params['id'] != null);
      }
    );

    // Get the current recipe
    this.recipe = this.recipeService.getRecipe(this.id);
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

  onSave(form: NgForm) {
    const description = form.value.description;
    const amount:number = form.value.amount;

    
  }

}
