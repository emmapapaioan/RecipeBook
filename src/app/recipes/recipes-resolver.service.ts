import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<void> {
  constructor(private dataStorageService: DataStorageService) {}

  resolve() {
    this.dataStorageService.fetchRecipes();
  }
}
