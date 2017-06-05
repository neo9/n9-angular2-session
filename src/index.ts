import { NgModule, ModuleWithProviders } from '@angular/core';
import { N9SessionService, SessionType } from "./n9-session.service";
import { N9StorageModule, N9StorageService } from "n9-angular2-storage";

export function createSessionService<T extends SessionType>(neo9Storage: N9StorageService) {
  return new N9SessionService(neo9Storage);
}

export * from './n9-session.service';

@NgModule({
  imports: [
    N9StorageModule
  ]
})
export class N9SessionModule {
  static forRoot<T extends SessionType>(): ModuleWithProviders {
    return {
      ngModule: N9SessionModule,
      providers: [
        { provide: N9SessionService, useFactory: (createSessionService), deps: [N9StorageService] }
      ]
    };
  }
}
