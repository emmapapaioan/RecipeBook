import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})


export class RecipeEditComponent implements OnInit {
  @Output() selectedNewRecipe = true;
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('descriptionInput', { static: false }) descriptionInput: ElementRef;
  @ViewChild('imagePathInput', { static: false }) imagePathInput: ElementRef;
  id: number;
  editMode: boolean = false;

  constructor(private recipeServise: RecipeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Retrieve the recipy id for which the edit will apply 
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        // Edit mode will be true only when there is an id defined
        this.editMode = params['id'] != null;
      }
    );
  }
  // onAddNewRecipe() {
  //   const name = this.nameInputRef.nativeElement.value;
  //   const description = this.descriptionInput.nativeElement.value;
  //   const imagePath = this.imagePathInput.nativeElement.value;
  //   const recipe = new Recipe(name,description,imagePath); 
  //   this.recipeServise.addRecipe(recipe);
  //   //this.selectedNewRecipe = !this.selectedNewRecipe;
  // }
}
