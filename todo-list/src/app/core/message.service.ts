import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

export interface Msg {
  content: string;
  style: string;
}

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  private $msgSource = new Subject<Msg>();

  msg = this.$msgSource.asObservable();

  update(content: string, style: 'error' | 'info' | 'success') {
    const msg: Msg = { content, style };
    this.$msgSource.next(msg);
  }

  clear() {
    this.$msgSource.next(null);
  }

  constructor() { }
}
