import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-channel',
  templateUrl: './view-channel.component.html',
  styleUrls: ['./view-channel.component.css']
})
export class ViewChannelComponent implements OnInit, OnDestroy, AfterViewInit {

  user: User;
  displayedColumns: string[] = ['position', 'name', 'email', 'score', 'record'];
  dataSource = new MatTableDataSource<User>();
  dataSubscription = new Subscription();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private authService: AuthService, private fdb: AngularFirestore, private router: Router) {
    this.user = authService.getUser();
  }

  doFilter(filtervalue: string) {
    this.dataSource.filter = filtervalue.toLowerCase().trim();
  }

  viewScore(user: User) {
    this.authService.viewUser = user;
    this.router.navigate(['/score']);
  }

  viewRecord(user: User) {
    this.authService.viewUser = user;
    this.router.navigate(['/healthdata']);
  }

  ngOnInit() {
    this.dataSubscription = this.fdb.collection('channel').doc('channel')
    .collection(this.user.channel).valueChanges().subscribe((data: User[]) => {
      this.dataSource.data = data;
      console.log(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
