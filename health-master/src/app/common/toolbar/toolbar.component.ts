import { Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Output() toggleEvent = new  EventEmitter<void>();
  authStatus: boolean;
  authSubscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.authStatus = authStatus;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  onSidenavToggle() {
    this.toggleEvent.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}
