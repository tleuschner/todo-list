import { Component, OnInit, Inject, Input } from '@angular/core';
import { TaskService } from 'src/app/core/task.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { List } from 'src/app/models/list.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input() todoList: List;
  private newTask: Task = { };

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  createList() {
    const dialogRef = this.dialog.open(CreateListDialog, {
      width: '50%',
      height: '50%',
      data: this.newTask
    });

    dialogRef.afterClosed().subscribe((result:List) => {
      if(result !== undefined) {
        result.created = Date.now();
        result.doneTasks = 0;
        result.remainingTasks = 0;
      }
      this.taskService.createList(result);
    })
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-task-creator.html',
  styleUrls: ['./todo-list.component.scss']
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