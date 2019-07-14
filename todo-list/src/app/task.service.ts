import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { List } from "src/app/list.model";
import { Task } from "src/app/task.model";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore) { }

  
}
