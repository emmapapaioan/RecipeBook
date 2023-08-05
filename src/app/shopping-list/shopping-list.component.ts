import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';
import { AlertService } from '../services/alert.service';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})

export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  selectedIngredientId: string;

  constructor(
    private shoppingListService: ShoppingListService, 
    private dataStorageService: DataStorageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchIngredients();
    this.subToIngredientsChanged();
  }

  onEditIngredient(id: string) {
    this.selectedIngredientId = id;
    this.shoppingListService.startEditing.next(id);
  }

  fetchIngredients() {
    this.dataStorageService.fetchShoppingList().subscribe({
      next: (res: Ingredient[]) => {
        this.shoppingListService.setIngredients(res);
        this.ingredients = this.shoppingListService.getIngredients();
      },
      error: (error) => {
        this.alertService.infoMessage(false, 'Failed to load Shopping List. Please reaload the page. ' + error.message);
      }
    });
  }

  subToIngredientsChanged() {
    this.shoppingListService.ingredientsChanged.subscribe((ingredients) => {
      this.ingredients = ingredients;
    });
  }
}
