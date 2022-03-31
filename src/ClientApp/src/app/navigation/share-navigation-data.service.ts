import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, ObservableInput, ReplaySubject, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareNavigationDataService {
  private menuListSubject = new BehaviorSubject(null);

  get menuList$():Observable<any>{
    return this.menuListSubject.asObservable();
  }
  
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }


  getData(): void {
    var url = this.baseUrl + 'api/menu';
    this.menuListSubject.next(null);

    this.http.get<any>(url).subscribe({
      next: (data) => this.menuListSubject.next(data)
    });
  }

}
