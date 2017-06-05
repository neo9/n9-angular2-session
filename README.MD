# n9-angular2-session

## Installation

To install this library, run:

```bash
$ npm install n9-angular2-session --save
```

## Consuming your library

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { N9SessionModule } from 'n9-angular2-session';

export interface TestExtend extends SessionType {
	deviceType: string
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify the library as an import and implement your SessionType extend if you want to add new field to the default SessionType
    N9SessionModule.forRoot<TestExtend>()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Gaetan SENN](mailto:gaetan.senn@gmail.com)
