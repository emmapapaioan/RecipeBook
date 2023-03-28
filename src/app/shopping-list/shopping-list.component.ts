import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  
  ingredients: Ingredient[];
  private shoppingListSubscription: Subscription;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.shoppingListSubscription = this.shoppingListService.ingredientsChanged
          .subscribe(
            (ingredients: Ingredient[]) => {
              this.ingredients = ingredients;
            });
  }

  ngOnDestroy(): void {
    this.shoppingListSubscription.unsubscribe();
  }

  addIngredients(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

  onEditIngredient(index: number) {
    this.shoppingListService.startEditing.next(index);
  }
}
