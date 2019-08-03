import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/core/task.service';
import { MessageService } from 'src/app/core/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendar } from '@angular/material/datepicker';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.scss']
})
export class TodoTaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  checkbox: string = "check_box_outline_blank";
  destroy$ = new Subject();

  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private _matSnackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.adjustCheckBox();
  }

  delete() {
    this.dataService.deleteTask(this.task);
  }

  completeTask() {
    this.task.done = !!!this.task.done;
    this.adjustCheckBox();
    this.dataService.updateTask(this.task);
  }

  updateTaskDate(event) {
    if(event.target.value) {
      this.task.dueDate = event.target.value.getTime();
      this.dataService.updateTask(this.task);
    }
  }

  private adjustCheckBox() {
    this.checkbox = this.task.done ? "check_box" : "check_box_outline_blank";
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
