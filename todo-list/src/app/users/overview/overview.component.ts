import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { List } from 'src/app/models/list.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  public todoLists: List[];
  private newList: List = {};
  userEmail = '';
  private destroy$ = new Subject<boolean>();

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.dataService.initalize();
    this.dataService.getTodoLists().pipe(takeUntil(this.destroy$)).subscribe((lists: List[]) => {
      this.todoLists = lists.sort( (a: List, b: List) => a.created - b.created);
    });
  }


  createList() {
    const dialogRef = this.dialog.open(CreateListDialog, {
      width: '90vw',
      maxWidth: '700px',
      data: this.newList
    });

    dialogRef.afterClosed().subscribe((result: List) => {
      if (result != undefined) {
        result.created = Date.now();
        result.doneTasks = 0;
        result.remainingTasks = 0;
        this.dataService.createToDoList(result);
      }
      this.newList = {};
    })
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['authorize']);
  }

  ngOnDestroy() {
    this.dataService.cleanUp();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-list-creator.html',
  styleUrls: ['./overview.component.scss']
})
export class CreateListDialog implements OnInit {
  listForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: List,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  private buildForm(): void {
    this.listForm = this.formBuilder.group({
      'title': ['', [
        Validators.required,
      ]
      ],
      'priority': ['', [
        Validators.required,
      ]]
    });

    this.listForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.listForm) { return; }
    const form = this.listForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'title': '',
    'priority': '',
  };

  validationMessages = {
    'title': {
      'required': 'Bitte Titel eintragen!',
    },
    'priority': {
      'required': 'Bitte Priorität auswählen!',
    },
  }

}