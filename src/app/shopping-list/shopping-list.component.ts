import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../_shared/ingredient.model';
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
  selectedIngredientName: string;
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
      error: () => {
        this.alertService.infoMessage(false, 'Failed to load Shopping List. Please reload the page.');
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

  onEditIngredient(name: string) {
    this.selectedIngredientName = name;
    this.shoppingListService.startEditing.next(name);
  }

  ngOnDestroy(): void {
    this.userSub && this.userSub.unsubscribe();
    this.shoppingListSub && this.shoppingListSub.unsubscribe();
  }

  onPrint() {
    const editDiv: HTMLElement = document.querySelector('.shopping-edit');
    const btn: HTMLElement = document.querySelector('.btn-info');
    const shoppingList: HTMLElement = document.querySelector('#shopping-list');
    editDiv.style.display = 'none';
    btn.style.display = 'none';
    shoppingList.style.textDecoration = 'none';
    window.print();
    editDiv.style.display = 'flex';
    editDiv.style.justifyContent = 'center';
    btn.style.display = 'block';
    window.close();
  }
}
