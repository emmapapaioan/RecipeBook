import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../_services/authorization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  private userSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSub && this.userSub.unsubscribe();
  }
}
