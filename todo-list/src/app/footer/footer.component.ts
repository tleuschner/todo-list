import { Component, OnInit, ElementRef } from '@angular/core';
import { DataService } from '../core/data.service';
import { Location } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  inputField: ElementRef;
  loggedIn = false;

  constructor(
    private _location: Location,
    private dataService: DataService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.dataService.getInput().subscribe(input => {
      this.inputField = input;
    });

    this.authService.currentUserObservable.subscribe(res => {
      if(res != null) this.loggedIn = true;
      else this.loggedIn = false;
    });
  }

  create() {
    this.inputField.nativeElement.focus();
  }

  goBack() {
    this._location.back();
  }

}
