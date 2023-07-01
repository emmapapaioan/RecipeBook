import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesStartComponent } from './recipes/recipes-start/recipes-start.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { TestComponent } from './test/test.component';
import { OcrReaderComponent } from './test/ocr-reader/ocr-reader.component';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  { path: 'ocr-image', component: OcrReaderComponent},
  { path: 'recipes', component: RecipesComponent, children: [
    { path: '', component: RecipesStartComponent},
    { path: 'new', component: RecipeEditComponent}, // Order of routes, matters here. New must be above :id.
    { path: ':id', component: RecipeDetailComponent},
  { path: ':id/edit', component: RecipeEditComponent}
  ]},
  { path: 'shopping-list', component: ShoppingListComponent},
  { path: 'playground', component: TestComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
