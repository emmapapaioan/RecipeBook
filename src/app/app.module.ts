import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingListService } from './services/shopping-list.service';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeService } from './services/recipe.service';
import { PdfService } from './services/pdf.service'
import { RecipesStartComponent } from './recipes/recipes-start/recipes-start.component';
import { OcrReaderComponent } from './ocr-reader/ocr-reader.component';
import { AboutComponent } from './about/about.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { APP_BASE_HREF } from '@angular/common';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { AuthComponent } from './auth/auth.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AuthInterceptorService } from './services/auth.interceptor.service';
import { ExampleShoppingListComponent } from './shopping-list/example-shopping-list/example-shopping-list.component';
import { ExampleRecipesComponent } from './recipes/example-recipes/example-recipes.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    RecipeEditComponent,
    RecipesStartComponent,
    OcrReaderComponent,
    AboutComponent,
    FooterComponent,
    ContactComponent,
    HomeComponent,
    SafeUrlPipe,
    AuthComponent,
    SpinnerComponent,
    ExampleShoppingListComponent,
    ExampleRecipesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ShoppingListService,
    RecipeService,
    PdfService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [RecipeEditComponent],
  exports: [SafeUrlPipe]
})
export class AppModule { }
