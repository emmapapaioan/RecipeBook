import { Component, HostListener, OnInit } from '@angular/core';
import { Recipe } from '../_models/recipe.model';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../_services/authorization.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  collapsed: boolean = true;
  recipes: Recipe[];
  public isScrolled = false;
  private userSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthorizationService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onLogout() {
    this.alertService.onLogoutMessage();
  }

  ngOnDestroy() {
    this.userSub && this.userSub.unsubscribe();
  }

  @HostListener('window:scroll')
  scrollEvent() {
    window.pageYOffset >=80 ? (this.isScrolled = true) : (this.isScrolled = false);
  }
}
