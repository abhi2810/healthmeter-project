import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { SensorData } from '../sensordata.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit, OnDestroy, AfterViewInit {

  user: User;
  viewUser: User;
  displayedColumns: string[] = ['position', 'date', 'time', 'score'];
  dataSource = new MatTableDataSource<SensorData>();
  dataSubscription = new Subscription();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private authService: AuthService, private fdb: AngularFirestore) {
    this.user = authService.getUser();
    if (this.user.isAuthority) {
      this.viewUser = authService.viewUser;
    } else {
      this.viewUser = this.user;
    }
  }

  doFilter(filtervalue: string) {
    this.dataSource.filter = filtervalue.toLowerCase().trim();
  }

  ngOnInit() {
    this.dataSubscription = this.fdb.collection('user').doc(this.viewUser.userId)
    .collection('sensordata').valueChanges().subscribe((data: SensorData[]) => {
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
