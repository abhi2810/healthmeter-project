import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  loading = new Subscription();
  isLoading: boolean;

  constructor(private authService: AuthService) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.loading = this.authService.isLoading.subscribe(data => {
      this.isLoading = data;
    });
  }

  onSignup(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    }, {
      userId: null,
      email: form.value.email,
      name: form.value.name,
      weight: form.value.weight,
      height: form.value.height,
      age: form.value.age,
      gender: form.value.gender,
      channel: form.value.channel,
      isAuthority: false
    });
  }
}
