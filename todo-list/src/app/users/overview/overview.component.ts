import { Component, OnInit, Inject } from '@angular/core';
import { TaskService } from 'src/app/core/task.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { List } from 'src/app/models/list.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public todoLists: List[];
  private newList: List = { };

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.taskService.getToDoLists().snapshotChanges().subscribe(res => {
      console.log(res);
    })
  }

  
  createList() {
    const dialogRef = this.dialog.open(CreateListDialog, {
      width: '50%',
      height: '50%',
      data: this.newList
    });

    dialogRef.afterClosed().subscribe((result:List) => {
      if(result !== undefined) {
        result.created = Date.now();
        result.doneTasks = 0;
        result.remainingTasks = 0;
      }
      this.taskService.createList(result);
      this.newList = {};
    })
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-list-creator.html',
  styleUrls: ['./overview.component.scss']
})
export class CreateListDialog implements OnInit{
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
      'description': ['', [
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
    'description': '',
    'priority': '',
  };

  validationMessages = {
    'title': {
      'required': 'Bitte Titel eintragen!',
    },
    'description': {
      'required': 'Bitte Beschreibung eintragen!',
    },
    'priority': {
      'required': 'Bitte Priorität auswählen!',
    },
  }

}