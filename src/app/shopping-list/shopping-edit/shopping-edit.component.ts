import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/_shared/ingredient.model';
import { ShoppingListService } from '../../_services/shopping-list.service';
import { DataStorageService } from 'src/app/_services/data-storage.service';
import { v4 as uuidv4 } from 'uuid';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  @ViewChild('form', { static: true }) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemId: string;
  editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService,
    private dataStorageService: DataStorageService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.initializeSubscription();
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeSubscription() {
    this.subscription = this.shoppingListService.startEditing.subscribe((name: string) => {
      this.editMode = true;
      this.editedItem = this.shoppingListService.getIngredientByName(name);
      this.shoppingListForm.setValue({ name: this.editedItem.name, amount: this.editedItem.amount });
    });
  }

  onAddItem(form: NgForm) {
    const name = form.value.name;
    const amount = form.value.amount;
    const existingIngredient = this.shoppingListService.getIngredientByName(name);

    if (name && amount) {
      if (!existingIngredient) {
        this.handleIngredientAdd({ name: name, amount: amount });
      } else {
        existingIngredient.amount += amount;
        this.handleIngredientUpdate(existingIngredient);
      }
    }

    this.clearValues();
    this.editMode = false;
  }

  onDeleteItem(form: NgForm) {
    const name = form.value.name;
    const amount = form.value.amount;
    const existingIngredient = this.shoppingListService.getIngredientByName(name);

    if (existingIngredient) {
      let updatedAmount = existingIngredient.amount - amount;
      if (updatedAmount === 0) {
        this.handleIngredientDelete(existingIngredient);
      } else if (updatedAmount < 0) {
        this.alertService.infoMessage(false, 'Wrong amount to be deleted.');
      } else {
        existingIngredient.amount = updatedAmount;
        this.handleIngredientUpdate(existingIngredient);
      }
    } else {
      this.alertService.infoMessage(false, 'Ingredient ' + name + ' doesn\'t exist in the shopping list.');
    }

    this.clearValues();
    this.editMode = false;
  }

  clearValues() {
    this.shoppingListForm.setValue({
      name: '',
      amount: null
    });
  }

  handleIngredientAdd(ingredient: Ingredient) {
    this.dataStorageService.addIngredient(ingredient).subscribe({
      next: () => {
        this.fetchAndBroadcastIngredients();
      },
      error: () => {
        this.alertService.infoMessage(false, `Failed to add Ingredient ${ingredient.name}.`);
      }
    });
  }

  handleIngredientUpdate(ingredient: Ingredient) {
    this.dataStorageService.updateIngredient(ingredient).subscribe({
      next: () => {
        this.fetchAndBroadcastIngredients();
      },
      error: () => {
        this.alertService.infoMessage(false, `Failed to update ingredient ${ingredient.name}.`);
      }
    });
  }

  handleIngredientDelete(ingredient: Ingredient) {
    this.dataStorageService.deleteIngredient(ingredient).subscribe({
      next: () => {
        this.fetchAndBroadcastIngredients();
      },
      error: () => {
        this.alertService.infoMessage(false, `Failed to delete ingredient.`);
      }
    });
  }

  fetchAndBroadcastIngredients() {
    this.dataStorageService.fetchShoppingList().subscribe({
      next: (res: Ingredient[]) => {
        this.shoppingListService.setIngredients(res);
      },
      error: () => {
        this.alertService.infoMessage(false, 'Failed to load Shopping List. Please reload the page. ');
      }
    });
  }
}
