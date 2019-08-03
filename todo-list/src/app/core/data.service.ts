import { Injectable } from '@angular/core';
import { TaskService } from './task.service';
import { List } from '../models/list.model';
import { Task } from '../models/task.model';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

//Basically mimics the taskSerivce but holds a local copy of lists and tasks to use for the website
//couldve been avoided with better architecture but decreases read operations to the databse
export class DataService {

  private tasks: Task[];
  private lists: List[];

  private destroy$ = new Subject<boolean>();
  private lists$ = new Subject<List[]>();
  private tasks$ = new Subject<Task[]>();

  constructor(
    private taskService: TaskService,

  ) { }


  initalize() {
    this.destroy$.next(false);
    this.taskService.getLists().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lists = [];
      res.forEach(doc => {
        let list = doc.data();
        list.listId = doc.id;
        this.lists.push(list);
      })
      this.lists$.next(this.lists);
    });

    this.taskService.getTasks().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.tasks = []
      res.forEach((doc: QueryDocumentSnapshot<Task>) => {
        let task = doc.data();
        task.taskId = doc.id;
        this.tasks.push(task);
      });
      this.tasks$.next(this.tasks);
    });
  }

  createToDoList(list: List) {
    list.listId = this.generateRandomId();
    this.lists.push(list)
    this.lists$.next(this.lists)
    this.taskService.createList(list);
  }

  public getTodoLists(): Observable<List[]> {
    return this.lists$.asObservable();
  }

  updateToDoList(listToUpdate: List) {
    this.lists.forEach((list: List, index) => {
      if (list.listId === listToUpdate.listId)
        this.lists[index] = listToUpdate;
    });
    this.taskService.updateList(listToUpdate);
    this.lists$.next(this.lists);
  }

  deleteToDoList(listToDelete: List) {
    this.taskService.deleteList(listToDelete.listId)
    this.lists = this.lists.filter((list: List) => list.listId !== listToDelete.listId);
    this.lists$.next(this.lists);
  }

  createTask(task: Task, list: List) {
    task.taskId = this.generateRandomId();
    this.tasks.push(task);
    this.tasks$.next(this.tasks);
    this.taskService.createTask(list.listId, task);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  updateTask(taskToUpdate: Task) {
    this.tasks.forEach((task: Task, index) => {
      if (task.taskId === taskToUpdate.taskId)
        this.tasks[index] = taskToUpdate;
    });
    this.taskService.updateTask(taskToUpdate);
    this.tasks$.next(this.tasks);
  }

  deleteTask(taskToDelete: Task) {
    this.taskService.deleteTask(taskToDelete.taskId)
    this.tasks = this.tasks.filter((task: Task) => task.taskId !== taskToDelete.taskId)
    this.tasks$.next(this.tasks)
  }

  cleanUp() {
    this.destroy$.next(true);
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 16);
  }

}
