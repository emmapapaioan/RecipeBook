import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  @ViewChild('form', { static: true }) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}
  
  ngOnInit(): void {
    this.subscription = this.shoppingListService.startEditing
    .subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );

    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  onAddItem(form: NgForm) {
    const name = form.value.name;
    const amount:number = form.value.amount;

    if(name !== '' && amount && amount>0){
      const ingredient = new Ingredient(name, amount);
      this.shoppingListService.addIngredient(ingredient);
    }

    this.clearValues();
    this.editMode = false;
  }

  onDeleteItem(form: NgForm) {
    const name = form.value.name;
    const amount:number = form.value.amount;
    const ingredient = new Ingredient(name, amount);
    this.shoppingListService.deleteIngredient(ingredient);

    this.clearValues();
    this.editMode = false;
  }

  onUpdateIngredient(form: NgForm) {
    const name = form.value.name;
    const amount = form.value.amount;
    const ingredient = new Ingredient(name, amount);
    this.shoppingListService.updateIngredient(ingredient);

    this.clearValues();
    this.editMode = false;
  }

  clearValues() {
    this.shoppingListForm.setValue({
      name: '',
      amount: null
    });
  }
}
