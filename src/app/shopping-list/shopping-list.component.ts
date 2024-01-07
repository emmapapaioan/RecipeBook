import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../_services/shopping-list.service';
import { AlertService } from '../_services/alert.service';
import { DataStorageService } from '../_services/data-storage.service';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../_services/authorization.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})

export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  selectedIngredientId: string;
  private shoppingListSub: Subscription;
  private userSub: Subscription;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;

  constructor(
    private shoppingListService: ShoppingListService, 
    private dataStorageService: DataStorageService,
    private alertService: AlertService,
    private authService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.subToIngredientsChanged();
    this.subToAuthentication();
    this.isAuthenticated && this.fetchIngredients();
  }

  fetchIngredients() {
    this.isLoading = true;
    this.dataStorageService.fetchShoppingList().subscribe({
      next: (res: Ingredient[]) => {
        this.shoppingListService.setIngredients(res);
        this.ingredients = this.shoppingListService.getIngredients();
        this.isLoading = false;
      },
      error: (error) => {
        this.alertService.infoMessage(false, 'Failed to load Shopping List. Please reload the page. ' + error.message);
        this.isLoading = false;
      }
    });
  }

  subToIngredientsChanged() {
    this.shoppingListSub = this.shoppingListService.ingredientsChanged.subscribe((ingredients) => {
      this.ingredients = ingredients;
    });
  }

  subToAuthentication() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onEditIngredient(id: string) {
    this.selectedIngredientId = id;
    this.shoppingListService.startEditing.next(id);
  }

  ngOnDestroy(): void {
    this.userSub && this.userSub.unsubscribe();
    this.shoppingListSub && this.shoppingListSub.unsubscribe();
  }
}
