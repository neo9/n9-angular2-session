import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import "rxjs/add/observable/from";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { N9StorageService } from "@neo9/n9-angular2-storage";

export declare type SessionType = {
  token: string;
}

@Injectable()
export class N9SessionService<T extends SessionType> {
  private session: T;
  private loggedIn: Subject<any> = new Subject<any>();
  private loggedOut: Subject<any> = new Subject<any>();

  constructor(public storage: N9StorageService) { }

  public load(): Observable<T> {
    return Observable.from(this.storage.get('session')).do((session: T) => {
      this.session = session;
      this.loggedIn.next(session);
    });
  }

  public open(session: T, rememberMe: boolean): Observable<T> {
    return new Observable((observer: any) => {
      this.storage.del('session');

      return observer.next(session);
    }).do(() => {
      this.loggedIn.next(session);
      this.session = session;

      if (rememberMe) this.storage.set('session', session);
    });
  }

  public get(): T {
    return this.session;
  }

  public close(): Observable<any> {
    this.session = null;

    return new Observable((observer: any) => {
      this.storage.del('session');

      return observer.next({});
    }).do(() => {
      this.loggedOut.next({});
    });
  }

  public getLoggedIn(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  public getLoggedOut(): Observable<any> {
    return this.loggedOut.asObservable();
  }
}
