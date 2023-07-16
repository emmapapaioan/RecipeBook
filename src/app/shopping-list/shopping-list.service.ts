import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { BehaviorSubject, Observable, Subject, forkJoin, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
  apiURL: string = 'https://recipe-book-41dd4-default-rtdb.europe-west1.firebasedatabase.app/secretKey=r3cip3B00k!/';
  shoppingListJSON: string = 'shoppingList.json';
  startEditing = new Subject<number>();

  private ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject<Ingredient[]>([]);

  constructor(private http: HttpClient) { 
    this.fetchShoppingList().subscribe(ingredients => {
      this.sortIngredients(ingredients);
      this.ingredients.next(ingredients);
    });
  }
  
  getIngredients() {
    return this.ingredients.asObservable();
  }

  sortIngredients(ingredients: Ingredient[]) {
    ingredients = ingredients.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  addIngredient(ingredient: Ingredient) {
    const ingredients = this.ingredients.value;
    const itemFound = ingredients.find(item =>
      item.name.toLowerCase() === ingredient.name.toLowerCase());

    if (itemFound) {
      itemFound.amount += ingredient.amount;
      this.updateIngredientDB(itemFound.id, itemFound);
    } else {
      ingredients.push(ingredient);
      this.addIngredientDB(ingredient);
    }

    this.sortIngredients(ingredients);
    this.ingredients.next(ingredients.slice());
  }

  updateIngredient(ingredient: Ingredient) {
    const ingredients = this.ingredients.value;
    const itemFound = ingredients.find(item =>
      item.name.toLowerCase() === ingredient.name.toLowerCase());
  
    if (itemFound) {
      itemFound.amount = ingredient.amount;
      this.updateIngredientDB(ingredient.id, ingredient);
    } else {
      Swal.fire({
        icon: 'question',
        title: 'Ingredient not found',
        text: `Ingredient ${ingredient.name} doesn't exist in the shopping list. Would you like to add it?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#28a745', 
        cancelButtonColor: '#d33' 
      }).then((result) => {
        if (result.isConfirmed) {
          this.addIngredient(ingredient);
        }
      })
    }
  
    this.sortIngredients(ingredients);
    this.ingredients.next(ingredients.slice());
  }
  

  deleteIngredient(ingredient: Ingredient) {
    let deleteFlag = false;
    let ingredients = this.ingredients.value;
    const itemFound = ingredients.find(item =>
      item.name.toLowerCase() === ingredient.name.toLowerCase());

    if (itemFound) {
      if (itemFound.amount - ingredient.amount >= 0) {
        deleteFlag = itemFound.amount - ingredient.amount === 0 ? true : false;
        itemFound.amount -= ingredient.amount;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Wrong amount',
          text: 'Wrong amount to be deleted.'
        });
        return;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ingredient not found',
        text: 'Ingredient ' + ingredient.name + ' doesn\'t exist in the shopping list.'
      });
      return;
    }

    if (itemFound && itemFound.amount === 0) {
      ingredients = ingredients.filter(item =>
        item.name.toLowerCase() !== ingredient.name.toLowerCase())
        this.ingredients.next(ingredients.slice());
    }

    if (deleteFlag) {
      this.deleteIngredientDB(itemFound.id); 
    } else {
      this.updateIngredientDB(itemFound.id, itemFound);
    }

    this.sortIngredients(ingredients);
    this.ingredients.next(ingredients.slice());
  }

  addIngredientsToDB(ingredients: Ingredient[]) {
    const addIngredientObservables = ingredients.map(ingredient => 
      this.http.post(this.apiURL + this.shoppingListJSON, ingredient));
    forkJoin(addIngredientObservables).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Shopping List was successfully added.`,
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to add ingredients. Error: ${error.message}`
        });
      }
    });
  }
  
  addIngredients(ingredients: Ingredient[]) {
    const updatedIngredients = this.ingredients.value;
    ingredients.forEach(ingredient => {
      const itemFound = updatedIngredients.find(item =>
        item.name.toLowerCase() === ingredient.name.toLowerCase());
      if (itemFound) {
        itemFound.amount += ingredient.amount;
      } else {
        updatedIngredients.push(ingredient);
      }
    });
  
    this.sortIngredients(updatedIngredients);
    this.ingredients.next(updatedIngredients.slice());
  
    // Add the ingredients to the database and handle the responses there
    this.addIngredientsToDB(ingredients);
  }
  

  getIngredient(index: number): Ingredient {
    return this.ingredients.value[index];
  }

  fetchShoppingList() {
    //return this.http.get<{ [key: string]: Ingredient }>(this.apiURL + this.shoppingListJSON);
    return this.http.get(this.apiURL + this.shoppingListJSON).pipe(
      map(response => {
        const shoppingList: Ingredient[] = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            shoppingList.push({ ...response[key], id: key });
          }
        }
        return shoppingList;
      })
    );
  }

  storeShoppingList() {
    // The put request override everything that is written in the db and puts the new data
    this.http.put(this.apiURL + this.shoppingListJSON, this.ingredients.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Shopping List was successfully stored in the database!',
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed storing the Shopping List to the database. Error details: ' + error.message
        });
      }
    });
  }

  addIngredientDB(ingredient: Ingredient) {
    this.http.post(this.apiURL + this.shoppingListJSON, ingredient).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Ingredient ${ingredient.name} was successfully added.`,
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to add Ingredient ${ingredient.name}. Error: ${error.message}`
        });
      }
    });
  }
  
  updateIngredientDB(id: any, ingredient: Ingredient) {
    const apiUrl = `${this.apiURL}shoppingList/${id}.json`;
    this.http.put(apiUrl, ingredient).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Ingredient ${ingredient.name} was successfully updated.`,
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to update ingredient ${ingredient.name}. Error: ${error.message}`
        });
      }
    });
  }
  
  deleteIngredientDB(id: any) {
    const apiUrl = `${this.apiURL}shoppingList/${id}.json`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Ingredient was successfully deleted.`,
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to delete ingredient. Error: ${error.message}`
        });
      }
    });
  }
  
}
