import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { Subscription } from 'rxjs';

import { OpenSans } from 'src/app/shared/open-sans-font';
import jsPDF from 'jspdf';
import autotable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { DataStorageService } from '../../services/data-storage.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Output() addToShoppingListEvent = new EventEmitter<Ingredient[]>();
  @ViewChild('recipeImage') recipeImage: ElementRef;
  recipe: Recipe = null;
  id: string;
  recipesEmpty: boolean = false;
  private paramsSubscription: Subscription;
  private editModeSubscription: Subscription;

  constructor(
    public recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private shoppingListService: ShoppingListService
  ) { }

  ngOnInit(): void {
    this.recipeService.setRecipeDetailMode(true);
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
    });

    this.recipeService.recipeUpdated.subscribe((id: string) => {
      if (id === this.id) {
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }

    this.recipeService.setRecipeDetailMode(false);
  }

  onAddToShoppingList() {
    this.recipeService.setRecipeEditMode(false);
    this.shoppingListService.addToShoppingList(this.recipe.ingredients).subscribe({
      next: () => this.alertService.infoMessage(true, 'Shopping List was successfully updated!'),
      error: () => this.alertService.infoMessage(false, 'Failed updating the Shopping List. Please try again.')
    });
  }
  
  

  onEditRecipe() {
    this.recipeService.setRecipeEditMode(true);
    const modalRef = this.modalService.open(RecipeEditComponent, { backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.id = this.id;
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
      console.log(error.message)
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

  async onDeleteRecipe() {
    const result = await this.alertService.approveMessage(
      'warning',
      'Delete Recipe',
      `Recipe "${this.recipe.name}" is going to be deleted. Are you sure?`,
      'Delete'
    );
    if (result.isConfirmed) {
      this.recipeService.setRecipeEditMode(false);
      this.dataStorageService.deleteRecipe(this.recipe).subscribe({
        next: () => {
          this.handleDeleteRecipe();
        },
        error: (error) => {
          this.alertService.infoMessage(false, `Failed to delete recipe ${this.recipe.name} was not successfull. Error details: ${error.message}`);
        }
      });
    }
  }

  handleDeleteRecipe() {
    this.alertService.infoMessage(true, 'Recipe ' + this.recipe.name + ' was successfully deleted.');
    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipe = this.recipeService.getRecipe(this.id);
      if (!this.recipe) {
        this.router.navigate(['/recipes']);
      }
    });
    this.router.navigate(['/recipes']);
  }
}

