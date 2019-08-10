import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../core/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  addTask = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if(params.get('id') != undefined) this.addTask = true;
      else this.addTask = false;
    })
  }

  goBack() {
    this._location.back();
  }

}
