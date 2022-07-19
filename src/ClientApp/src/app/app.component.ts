import { Component, Inject } from '@angular/core';
import { JL } from 'jsnlog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ClientApp';
  openedSubject = new Subject<boolean>();

  dismissSidebar() {
    this.openedSubject.next(false);
  }


  _logger: JL.JSNLog;

  constructor(@Inject('JSNLOG') jl: JL.JSNLog) {
    this._logger = jl;
  }
}
