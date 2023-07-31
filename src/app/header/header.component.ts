import { Component, HostListener, OnInit } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  collapsed: boolean = true;
  recipes: Recipe[];
  public isScrolled = false;
  
  constructor(
    private dataStorageService: DataStorageService) { }

  ngOnInit(): void { }

  @HostListener('window:scroll')
  scrollEvent() {
    window.pageYOffset >=80 ? (this.isScrolled = true) : (this.isScrolled = false);
  }

}
