import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { List } from "src/app/models/list.model";
import { Task } from "src/app/models/task.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  lists: AngularFireList<List[]> = null;
  userId: string;

  constructor(
    private database: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,) { 
      this.angularFireAuth.authState.subscribe(user => {
        if(user) {
          this.userId = user.uid
        }
      });
    }


    getToDoLists(): AngularFireList<List[]> {
      if(!this.userId) return;
      this.lists = this.database.list<List[]>(`lists/${this.userId}`);
      console.log(this.lists);
      return this.lists;
    }
  
    createList(list: List) {
      if(!this.userId) return;
     this.database.list(`lists/${this.userId}`).push(list);
    }
}
