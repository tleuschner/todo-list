import { Component, OnInit, ViewChild, DoCheck, ElementRef } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('drawer', {static:true}) drawer: MatDrawer;
  public active = false;
  loggedIn = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.authService.currentUserObservable.subscribe(res => {
      if(res != null) this.loggedIn = true;
      else this.loggedIn = false;
    });
  }


  async logout() {
    await this.authService.logout();
    await this.router.navigate(['authorize']);
  }

}
