import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import "rxjs/add/observable/from";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import 'rxjs/add/observable/fromPromise';

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

  public load(options?: any): Observable<T> {
    return Observable.from(this.storage.get('session')).map((session: T) => {
      this.session = session;

      this.loggedIn.next({ options: options || {}, session })

      return session;
    });
  }

  public open(session: T, options?: any): Observable<T> {
    return new Observable((observer: any) => {
      this.storage.del('session');
      this.session = session;

      if (options && options.rememberMe) this.storage.set('session', session);

      this.loggedIn.next({ options: options || {}, session });
      return observer.complete(session);
    });
  }

  public refresh(session: T): Observable<T> {
    return Observable.fromPromise(this.storage.set('session', session).then(() => {
      return session;
    }));
  }

  public get(): T {
    return this.session;
  }


  public close(): Observable<any> {
    this.session = null;

    return Observable.fromPromise(this.storage.del('session').then(() => {
      this.loggedOut.next({});
    }));
  }

  public getLoggedIn(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  public getLoggedOut(): Observable<any> {
    return this.loggedOut.asObservable();
  }
}
