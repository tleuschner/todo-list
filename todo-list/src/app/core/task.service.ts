import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { List } from "src/app/models/list.model";
import { Task } from "src/app/models/task.model";
import { Observable } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  userId: string;
  userListRef: AngularFirestoreCollection<List>;
  userTaskRef: AngularFirestoreCollection<Task>

  constructor(
    private db: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private messageService: MessageService ) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        this.userListRef = db.collection(`lists/${this.userId}/lists`);
        this.userTaskRef = db.collection(`tasks/${this.userId}/tasks`);
      }
    });
  }

  createList(list: List) {
    if (!this.userId) return;
    this.userListRef.doc(list.listId).set(list);
  }

  getLists(): Observable<QuerySnapshot<List>> {
    return this.userListRef.get();
  }

  updateList(updatedList: List) {
    this.userListRef.doc(updatedList.listId).set(updatedList);
  }

  deleteList(listId: string) {
    //ToDo delete Tasks that are in this list
    this.userListRef.doc(listId).delete();
  }

  createTask(listId: string, task: Task) {
    task.listId = listId;
    this.userTaskRef.doc(task.taskId).set(task);
  }

  getTasks(): Observable<QuerySnapshot<Task>> {
    return this.userTaskRef.get();
  }

  updateTask(updatedTask: Task) {
    this.userTaskRef.doc(updatedTask.taskId).set(updatedTask);
  }

  deleteTask(taskId: string) {
    this.userTaskRef.doc(taskId).delete();
  }
  
}
