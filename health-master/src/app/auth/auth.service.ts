import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as json2csv from 'json2csv';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User;
  viewUser: User;
  authChange = new Subject<boolean>();
  isLoading = new Subject<boolean>();
  getdata = new Subscription();

  constructor(private router: Router,
              private fAuth: AngularFireAuth,
              private fdb: AngularFirestore,
              private domSanitizer: DomSanitizer,
              private matSnackBar: MatSnackBar) {
    this.user = {
      userId: null,
      email: null,
      name: null,
      weight: 0,
      height: 0,
      age: 0,
      gender: 0,
      channel: null,
      isAuthority: false
    };
  }

  startLoading() {
    this.isLoading.next(true);
  }

  doneLoading() {
    this.isLoading.next(false);
  }

  openSnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action, {
      duration: 5000,
    });
  }

  registerUser(authData: AuthData, user: User) {
    this.startLoading();
    this.fAuth.auth
    .createUserWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      console.log(result);
      user.userId = result.user.uid;
      this.user = user;
      this.fdb.collection('channel').doc('channel').collection(user.channel).doc(user.userId).set(user)
      .then(() => {
        this.fdb.collection('user').doc(user.userId).collection('userdata').doc('data').set(user)
        .then(res => {
          this.doneLoading();
          this.authSuccesfully();
        }).catch(error => {
          this.doneLoading();
          console.log(error);
          this.openSnackBar(error.message, 'ok');
        });
      }).catch(error => {
        this.doneLoading();
        console.log(error);
        this.openSnackBar(error.message, 'ok');
      });
    }).catch(error => {
      this.doneLoading();
      console.log(error);
      this.openSnackBar(error.message, 'ok');
    });
  }

  login(authData: AuthData) {
    this.startLoading();
    this.fAuth.auth
    .signInWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      console.log(result);
      this.getdata = this.fdb.collection('user').doc(result.user.uid)
      .collection('userdata').doc<User>('data').valueChanges().subscribe(res => {
        console.log(res);
        this.user.userId = res.userId;
        this.user.gender = res.gender;
        this.user.email = res.email;
        this.user.name = res.name;
        this.user.height = res.height;
        this.user.weight = res.weight;
        this.user.age = res.age;
        this.user.isAuthority = res.isAuthority;
        this.user.channel = res.channel;
        this.doneLoading();
        this.authSuccesfully();
      });
    }).catch( error => {
      this.doneLoading();
      console.log(error);
      this.openSnackBar(error.message, 'ok');
    });
  }

  updateUser(user: User) {
    this.startLoading();
    this.fdb.collection('user').doc(user.userId).collection('userdata').doc('data').update(user)
    .then(res => {
      this.doneLoading();
      console.log(res);
      this.openSnackBar('Updated Succesfully', 'ok');
    }).catch(error => {
      this.doneLoading();
      console.log(error);
      this.openSnackBar(error.message, 'ok');
    });
  }

  logout() {
    this.getdata.unsubscribe();
    this.fAuth.auth.signOut();
    this.user = {
      userId: null,
      email: null,
      name: null,
      weight: 0,
      height: 0,
      age: 0,
      gender: 0,
      channel: null,
      isAuthority: false
    };
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return ({...this.user});
  }

  isAuth() {
    return this.user.name != null;
  }

  private authSuccesfully() {
    this.authChange.next(true);
    this.router.navigate(['/home']);
  }

  public generateCSVDownloadLink(options: { filename: string, data: any[], columns: string[] }): SafeUrl {
    const fields = options.columns;
    const opts = { fields, output: options.filename };
    const csv = json2csv.parse(options.data, opts);

    return this.domSanitizer.bypassSecurityTrustUrl('data:text/csv,' + encodeURIComponent(csv));
  }
}
