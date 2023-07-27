import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // temporary service

  private user = new Subject<boolean>()

  constructor() { }

  getUser() {
    return this.user.asObservable()
  }

  setUser(value: boolean) {
    this.user.next(value)
  }
}
