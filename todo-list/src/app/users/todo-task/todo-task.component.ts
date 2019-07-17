import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.scss']
})
export class TodoTaskComponent implements OnInit {
  @Input() todoList: List;
  task: Task = {
    title: 'meiner erste aufgabe',
    done: true,
    dueDate: Date.now() + 200,
  }
  now: number;

  constructor() { }

  ngOnInit() {
    this.now = Date.now()
  }

}
