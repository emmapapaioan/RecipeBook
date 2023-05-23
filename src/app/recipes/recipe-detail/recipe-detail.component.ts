import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

import { OpenSans } from 'src/app/shared/open-sans-font';
import jsPDF from 'jspdf';
import autotable from 'jspdf-autotable';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Output() addToShoppingListEvent = new EventEmitter<Ingredient[]>();

  recipe: Recipe = null;
  id: number = -1;
  recipesEmpty: boolean = false;
  private paramsSubscription: Subscription;
  private editModeSubscription: Subscription;

  constructor(
    public recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    
    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = + params['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
        }
      );

    this.recipeService.recipeUpdated.subscribe((index: number) => {
      if (index === this.id) {
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  onAddToShoppingList() {
    this.recipeService.setRecipeEditMode(false);
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'The ingredients of the recipe "' + this.recipe.name + '" were successfully stored in the shopping list.',
    });
  }

  onEditRecipe() {
    // Or just routerLink=":id/edit" at the html...
    this.recipeService.setRecipeEditMode(true);
    this.router.navigate(['/recipes', this.id, 'edit']);
  }

  printRecipe() {
    const doc = new jsPDF();

    // Set constants
    const leftMargin = 15;
    const fontSize = 14;
    const imageWidth = 100;
    const imageHeight = 100;
    const marginTop = 10;
    const maxWidth = 180;

    // Enable automatic page creation
    // Add the Open Sans variable font
    doc.addFileToVFS(OpenSans.name, OpenSans.base64);
    doc.addFont(OpenSans.name, 'OpenSans', 'normal');
    doc.addFileToVFS(OpenSans.boldName, OpenSans.boldBase64);
    doc.addFont(OpenSans.boldName, 'OpenSans', 'bold');

    // Set the Open Sans font and size
    doc.setFontSize(fontSize);
    doc.setFont('OpenSans');

    let currentY = 10;

    // Add recipe name label
    doc.setFont('OpenSans', 'bold');
    doc.text('Recipe Name:', leftMargin, currentY);
    currentY += 5;

    // Add recipe name value
    doc.setFont('OpenSans', 'normal');
    const recipeNameText = doc.splitTextToSize(this.recipe.name, maxWidth);
    doc.text(recipeNameText, leftMargin, currentY);
    currentY += 5 * recipeNameText.length + marginTop;

    // Add recipe description label
    doc.setFont('OpenSans', 'bold');
    doc.text('Description:', leftMargin, currentY);
    currentY += 5;

    // Add recipe description value
    doc.setFont('OpenSans', 'normal');
    const recipeDescriptionText = doc.splitTextToSize(this.recipe.description, maxWidth);
    doc.text(recipeDescriptionText, leftMargin, currentY);
    currentY += 5 + recipeDescriptionText.length + marginTop;

    // Add recipe image
    try {
      const imgData = this.recipe.imagePath;
      doc.addImage(imgData, 'PNG', leftMargin, currentY, imageWidth, imageHeight);
    } catch (error) {
      const imgData = 'assets/images/no-photo-available2.png';
      doc.addImage(imgData, 'PNG', leftMargin, currentY, imageWidth, imageHeight);
    }
    currentY += imageHeight + marginTop;

    // Take table ingredients from the html directly
    autotable(doc, {
      html: '#ingredients',
      startY: currentY,
      margin: { left: leftMargin },
      headStyles: {
        font: 'OpenSans',
        fontStyle: 'bold',
        fillColor: [184, 141, 141],
        textColor: 'black'
      },
      styles: {
      },
    });

    // Save the PDF
    doc.save(`${this.recipe.name}.pdf`);
  }

  onDeleteRecipe() {
    Swal.fire({
      icon: 'warning',
      title: 'Delete Recipe',
      text: 'Recipe "' + this.recipe.name + '" is going to be deleted. Are you sure?',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recipeService.setRecipeEditMode(false);
        this.recipeService.deleteRecipe(
          this.recipeService.getRecipes().indexOf(this.recipe)
        );
        this.router.navigate(['/recipes']);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'The deletion of the recipe was successfull',
          confirmButtonColor: '#28a745'
        });
      }
    });
  }
}
