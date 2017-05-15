import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import "rxjs/add/observable/from";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { N9StorageService } from "n9-angular2-storage";

export declare type SessionType = {
  token: string;
}

@Injectable()
export class N9SessionService {
  private session: SessionType;
  private loggedIn: Subject<any> = new Subject<any>();
  private loggedOut: Subject<any> = new Subject<any>();

  constructor(public storage: N9StorageService) { }

  public load(): Observable<SessionType> {
    return Observable.from(this.storage.get('session')).do((session: SessionType) => {
      this.session = session;
      this.loggedIn.next(session);
    });
  }

  public open(session: any, rememberMe: boolean): Observable<any> {
    return new Observable((observer: any) => {
      this.storage.del('session');

      return observer.next({ token: session.token });
    }).do(() => {
      this.loggedIn.next(session.token);
    }).map(() => {
      let parsedSession = this.session = {
        token: session.token
      };

      if (rememberMe) {
        this.storage.set('session', parsedSession);
        return this.session;
      } else {
        return this.session;
      }
    });
  }

  public get() {
    return this.session;
  }

  public close(): Observable<any> {
    this.session = null;

    return new Observable((observer: any) => {
      this.storage.del('session');

      observer.next();
    }).do(() => {
      this.loggedOut.next();
    });
  }

  public getLoggedIn(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  public getLoggedOut(): Observable<any> {
    return this.loggedOut.asObservable();
  }
}
