import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @ViewChild('nameInput', {static: false}) nameInputRef : ElementRef;
  @ViewChild('amountInput', {static: false}) amountInputRef : ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}
  
  onAddItem() {
    const name = this.nameInputRef.nativeElement.value;
    const amount:number = Number(this.amountInputRef.nativeElement.value);
    const ingredient = new Ingredient(name, amount);
    this.shoppingListService.addIngredient(ingredient);
  }

  onDeleteItem() {
    const name = this.nameInputRef.nativeElement.value;
    const amount:number = Number(this.amountInputRef.nativeElement.value);
    const ingredient = new Ingredient(name, amount);
    this.shoppingListService.deleteIngredient(ingredient);
  }

  clearValues() {
    this.nameInputRef.nativeElement.value = '';
    this.amountInputRef.nativeElement.value = '';
  }
}
