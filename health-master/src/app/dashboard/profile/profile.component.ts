import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  loading = new Subscription();
  isLoading: boolean;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
    this.isLoading = false;
    console.log(this.user);
   }

  ngOnInit() {
    this.loading = this.authService.isLoading.subscribe(data => {
      this.isLoading = data;
    });
  }

  onSignup(form: NgForm) {
    this.user.name = form.value.name;
    this.user.age = form.value.age;
    this.user.weight = form.value.weight;
    this.user.height = form.value.height;
    this.user.gender = form.value.gender;
    this.authService.updateUser({... this.user});
  }

}
