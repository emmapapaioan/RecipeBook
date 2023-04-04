import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Easy chocolate fudge cake', 
      'Need a guaranteed crowd-pleasing cake that\'s easy to make? This super-squidgy chocolate fudge cake with smooth icing is an instant baking win', 
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chocolate-fudge-cake-91de17a.jpg?quality=90&webp=true&resize=220,200' ,
      [
        new Ingredient('sunflower',100),
        new Ingredient('caster sugar',150),
        new Ingredient('egg',2),
        new Ingredient('unsalted butter',100)
      ]),
    new Recipe(
      'Eggfusion', 
      'Eggs and bread at their best',
      'https://www.thespruceeats.com/thmb/m4wuXkDWvHE2Fcf-MdJ8Oy_5bpY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-eggs-in-a-basket-recipe-2097253-hero-07-43091f4f839c4a76aa83ac0e94910267.jpg',
      [
        new Ingredient('bread slice',2),
        new Ingredient('butter',15),
        new Ingredient('egg',1)
      ]),
    new Recipe(
      'Chorizo & mozzarella gnocchi bake',
      'Upgrade cheesy tomato pasta with gnocchi, chorizo and mozzarella for a comforting bake that makes an excellent midweek meal',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/gnocchi-1d16725.jpg?quality=90&webp=true&resize=300,272',
      [
        new Ingredient('olive oil',1),
        new Ingredient('garlic clove',2),
        new Ingredient('chorizo 120',3),
        new Ingredient('fresh gnocchi',600)
      ]),
    new Recipe(
      'Campfire stew',
      'Enjoy this easy stew made with gammon and plenty of veg \– it\’s full of goodness, delivering four of your five-a-day, and can also be cooked in a slow cooker',
      'https://images.immediate.co.uk/production/volatile/sites/30/2022/10/Campfire-stew-afe40d7.jpg?quality=90&webp=true&resize=300,272',
      [
        new Ingredient('gammon',600),
        new Ingredient('onion',2),
        new Ingredient('carrot',2),
        new Ingredient('smoked paprica',2)
      ]),
    new Recipe(
      'Easy classic lasagne',
      'Kids will love to help assemble this easiest ever pasta bake with streaky bacon, beef mince, a crème fraîche sauce and gooey mozzarella',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/classic-lasange-4a66137.jpg?quality=90&webp=true&resize=300,272',
      [
        new Ingredient('rasher smoked streaky bacon',1),
        new Ingredient('onion',1),
        new Ingredient('celery',1),
        new Ingredient('beef mince',500)
      ]),
    new Recipe(
      'Thai fried prawn & pineapple rice',
      'This quick, low calorie supper is perfect for a busy weeknight. Cook your rice in advance to get ahead - run it under cold water to chill quickly, then freeze in a food bag for up to one month',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/thai-aea8468.jpg?quality=90&webp=true&resize=300,272',
      [
        
        new Ingredient('green pepper',1),
        new Ingredient('spring onion',1),
        new Ingredient('egg',3),
        new Ingredient('lime',3)
      ])
  ];

  recipeUpdated = new EventEmitter<number>();
  recipesChanged = new Subject<Recipe[]>();
  recipeEditMode: boolean = false;
  recipeEditModeChanged = new Subject<boolean>();

  constructor(private shoppingListService : ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
  }

  getRecipes() {
    // Adding the slice method, we are just taking a copy of the actual array
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
    this.recipeUpdated.emit(index);
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addRecipes(recipes: Recipe[]) {
    this.recipes.push(...recipes);
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipeEditMode() {
    return this.recipeEditMode;
  }

  setRecipeEditMode(value: boolean) {
    this.recipeEditMode = value;
    this.recipeEditModeChanged.next(value);
  }
}
