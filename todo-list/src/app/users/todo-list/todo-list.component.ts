import { Component, OnInit, Inject, Input } from '@angular/core';
import { TaskService } from 'src/app/core/task.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { List } from 'src/app/models/list.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input() todoList: List;

  constructor() { }

  ngOnInit() {
  }

}
