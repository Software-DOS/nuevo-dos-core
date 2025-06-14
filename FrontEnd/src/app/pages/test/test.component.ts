import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-test',
  template: `
    <div class="container mt-5">
      <h1>Test Component - Login Successful!</h1>
      <div class="alert alert-success">
        <h4>User is logged in!</h4>
        <p><strong>Email:</strong> {{ userEmail }}</p>
        <p><strong>Token exists:</strong> {{ tokenExists }}</p>
        <p><strong>Current User:</strong> {{ currentUser | json }}</p>
      </div>
      <button class="btn btn-primary" (click)="goToHome()">Go to Home</button>
      <button class="btn btn-danger ml-2" (click)="logout()">Logout</button>
    </div>
  `,
  styles: []
})
export class TestComponent implements OnInit {

  userEmail: string = '';
  tokenExists: boolean = false;
  currentUser: any = null;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.tokenExists = this.loginService.isLoggedIn();
    this.currentUser = this.loginService.getCurrentUser();
    this.userEmail = this.currentUser?.email || 'No email found';
    
    console.log("🧪 [TEST COMPONENT] Component loaded");
    console.log("🧪 [TEST COMPONENT] Token exists:", this.tokenExists);
    console.log("🧪 [TEST COMPONENT] Current user:", this.currentUser);
  }

  goToHome() {
    window.location.href = '/';
  }

  logout() {
    this.loginService.logout();
    window.location.href = '/login';
  }

}
