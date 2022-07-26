import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { StateNewspaper } from '../interfaces/StateNewspaper';

@Injectable({
  providedIn: 'root',
})
export class StateNewspaperService {
  endPoint = this.baseUrl + 'api/statenewspapers'
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {}

  getData<StateNewspaper>(): Observable<StateNewspaper[]> {
    var params = new HttpParams();

    return this.http.get<StateNewspaper[]>(this.endPoint, { params })
    .pipe(map(result => result as StateNewspaper[]));
  }

  getItemById<StateNewspaper>(id: number): Observable<StateNewspaper> {
    var params = new HttpParams();
    return this.http.get<StateNewspaper>(this.endPoint + '/' + id, { params }).pipe(map(result => result as StateNewspaper));
  }

  deleteItem(itemId: number): any {
    return this.http.delete(this.endPoint + `/${itemId}`);
  }

  updateItem(item: StateNewspaper): Observable<StateNewspaper> {
    return this.http
      .put<StateNewspaper>(this.endPoint + `/${item.id}`, item);
  }

  createItem(itemId: StateNewspaper): Observable<StateNewspaper> {
    return this.http.post<StateNewspaper>(this.endPoint, itemId);
  }
}
