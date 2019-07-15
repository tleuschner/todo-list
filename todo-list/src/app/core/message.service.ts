import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

export interface Msg {
  content: string;
  style: string;
}

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  private $msgSource = new BehaviorSubject<Msg>({content:'', style: ''});

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
