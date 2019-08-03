import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { trigger, transition, animate, style } from '@angular/animations';
import { MessageService } from 'src/app/core/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataService } from 'src/app/core/data.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateListDialog } from '../overview/overview.component';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})

export class TodoListComponent implements OnInit, OnDestroy {
  @Input() todoList: List;
  @ViewChild('taskTitle', { static: false }) taskTitle: ElementRef;

  tasks: Task[] = [];
  task: Task = {};
  showTodos = false;
  icon = 'expand_more';
  overdue: number = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
  ) { }
  public expand: boolean = false;

  ngOnInit() {
    this.dataService.getTasks().pipe(takeUntil(this.destroy$)).subscribe((tasks: Task[]) => {
      this.tasks = tasks
        .filter(task => task.listId == this.todoList.listId)
        .sort((a: Task, b: Task) => a.order - b.order);

        this.todoList.doneTasks = 0;
        this.overdue = 0;
        let now = Date.now();
        for(let task of this.tasks) {
          if(task.done) this.todoList.doneTasks++;
          if(!task.done && task.dueDate && (task.dueDate - now <=0)) this.overdue++;
        }
        this.todoList.remainingTasks = tasks.length - this.todoList.doneTasks;
    });
  }


  toggleTodos() {
    this.showTodos = !this.showTodos;
    if (this.icon == "expand_more") this.icon = "expand_less";
    else this.icon = "expand_more";
  }

  addTask() {
    this.task = {};
    let taskTitle = this.taskTitle.nativeElement.value;
    if (taskTitle.length > 0) {
      this.taskTitle.nativeElement.value = "";
      this.task.title = taskTitle;
      this.task.done = false;
      this.task.listId = this.todoList.listId;
      this.task.created = Date.now();
      this.task.order = this.tasks.length;
      this.dataService.createTask(this.task, this.todoList);
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.updateTaskArray();
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '90vw',
      maxWidth: '700px',
      data: this.todoList.title,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (const task of this.tasks) {
          this.dataService.deleteTask(task);
        }
        this.dataService.deleteToDoList(this.todoList);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private updateTaskArray() {
    this.tasks.forEach((task, index) => {
      task.order = index;
      this.dataService.updateTask(task);
    });
  }
}

@Component({
  selector: 'delete-dialog',
  template: `<h1 mat-dialog-title style="margin: 0 auto"><em>{{title}}</em> löschen?</h1>
            <div mat-dialog-content style="overflow:hidden">
                <div mat-dialog-actions>
                    <button mat-button color="warn" [mat-dialog-close]="true" >Löschen</button>
                    <button mat-button mat-dialog-close>Abbrechen</button>
                </div>
            </div>`,
})
export class DeleteDialog { 
  constructor(
    @Inject(MAT_DIALOG_DATA) public title: string,
  ) {}
}