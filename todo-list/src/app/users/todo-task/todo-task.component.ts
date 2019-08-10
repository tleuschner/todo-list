import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { MessageService } from 'src/app/core/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendar } from '@angular/material/datepicker';
import { DataService } from 'src/app/core/data.service';
import { slideInAnimation } from 'src/app/animations';
import { ActivatedRoute, } from '@angular/router';
import { List } from 'src/app/models/list.model';


@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class TodoTaskComponent implements OnInit, OnDestroy {
  @ViewChild('taskTitle', { static: false }) taskTitle: ElementRef;

  checkbox: string = "check_box_outline_blank";
  listId = '';
  tasks: Task[] = [];
  list: List;
  overdue = 0;
  task:Task = {};

  destroy$ = new Subject();

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private _matSnackBar: MatSnackBar,
  ) {  }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    this.dataService.initalize();
    if (this.listId !== 'all') {
      this.dataService.getTodoLists().pipe(takeUntil(this.destroy$)).subscribe((lists: List[]) => {
        this.list = lists.filter(list => this.listId == list.listId)[0];

        //TODO refactor
        this.dataService.getTasks().pipe(takeUntil(this.destroy$)).subscribe((tasks: Task[]) => {

          this.tasks = tasks
            .filter(task => task.listId == this.listId)
            .sort((a: Task, b: Task) => a.order - b.order);

          this.list.doneTasks = 0;
          this.overdue = 0;
          let now = Date.now();
          for (let task of this.tasks) {
            if (task.done) this.list.doneTasks++;
            if (!task.done && task.dueDate && (task.dueDate - now <= 0)) this.overdue++;
          }
          this.list.remainingTasks = tasks.length - this.list.doneTasks;
        });

      });
    }


  }

  delete(task: Task) {
    this.dataService.deleteTask(task);
  }

  completeTask(task: Task) {
    task.done = !!!task.done;
    this.dataService.updateTask(task);
  }

  updateTaskDate(event, task: Task) {
    if (event.target.value) {
      task.dueDate = event.target.value.getTime();
      this.dataService.updateTask(task);
    }
  }

  addTask() {
    this.task = {};
    let taskTitle = this.taskTitle.nativeElement.value;
    if (taskTitle.length > 0) {
      this.taskTitle.nativeElement.value = "";
      this.task.title = taskTitle;
      this.task.done = false;
      this.task.listId = this.listId;
      this.task.created = Date.now();
      this.task.order = this.tasks.length;
      this.dataService.createTask(this.task, this.list);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
