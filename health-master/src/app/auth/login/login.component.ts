import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = new Subscription();
  isLoading: boolean;

  constructor(private authService: AuthService) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.loading = this.authService.isLoading.subscribe(data => {
      this.isLoading = data;
      console.log(this.isLoading);
    });
  }

  onLogin(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
  }
}
