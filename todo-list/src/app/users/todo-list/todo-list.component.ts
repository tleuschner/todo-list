import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataService } from 'src/app/core/data.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
// import { slideInAnimation } from 'src/app/animations';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  // animations: [
  //   slideInAnimation
  // ]
})

export class TodoListComponent implements OnInit, OnDestroy {
  @ViewChild('listTitle', { static: true }) listTitle: ElementRef;

  todoLists: List[] = undefined;
  tasks: Task[];
  list: List = {};
  showTodos = false;
  icon = 'expand_more';
  overdue: number = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dataService: DataService,
    private router: Router,
    public dialog: MatDialog,
  ) { }
  public expand: boolean = false;

  ngOnInit() {
    if (this.dataService.isInitialized === false) { this.dataService.initalize(); }

    this.dataService.getTodoLists().pipe(takeUntil(this.destroy$)).subscribe((lists: List[]) => {
      this.todoLists = lists.sort((a: List, b: List) => a.created - b.created);
    });
    this.dataService.getTasks().pipe(takeUntil(this.destroy$)).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.updateListProps(this.todoLists);
    });
    this.dataService.setInput(this.listTitle);
  }

  showTasks(list) {
    this.router.navigate(['list', list.listId, 'tasks'])
  }


  toggleTodos() {
    this.showTodos = !this.showTodos;
    if (this.icon == "expand_more") this.icon = "expand_less";
    else this.icon = "expand_more";
  }

  addList() {
    this.list = {};
    let listTitle = this.listTitle.nativeElement.value;
    if (listTitle.length > 0) {
      this.listTitle.nativeElement.value = "";
      this.list.title = listTitle;
      this.list.created = Date.now();
      this.list.remainingTasks = 0;
      this.list.doneTasks = 0;
      this.list.taskCount = 0;
      this.list.priority = 5;
      this.list.overdue = 0;
      this.dataService.createToDoList(this.list);
    }
  }

  delete(list: List) {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '90vw',
      maxWidth: '700px',
      data: list.title,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let listTasks = this.tasks.filter(task => task.listId == list.listId);

        for (const task of listTasks) {
          this.dataService.deleteTask(task);
        }
        this.dataService.deleteToDoList(list);

      }
    });
  }

  updateListProps(lists: List[]) {
    for (const list of lists) {
      let listTasks = this.tasks.filter(task => task.listId == list.listId);
      let overdue = 0;
      let doneTasks = 0;
      let now = Date.now();
      for (let task of listTasks) {
        if (task.done) doneTasks++;
        if (!task.done && task.dueDate && (task.dueDate - now <= 0)) overdue++;
      }
      list.remainingTasks = listTasks.length - doneTasks;
      list.taskCount = listTasks.length;
      list.overdue = overdue;
      list.doneTasks = doneTasks;
      this.dataService.updateToDoList(list);
    }
  }



  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
  ) { }
}