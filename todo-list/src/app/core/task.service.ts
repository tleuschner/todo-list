import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { List } from "src/app/models/list.model";
import { Task } from "src/app/models/task.model";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore) { }

  
}
