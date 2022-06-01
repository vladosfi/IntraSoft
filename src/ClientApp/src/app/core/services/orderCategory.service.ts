import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { Order, OrderCategory } from '../interfaces/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderCategoryService {
  endPoint = this.baseUrl + 'api/orderCategories'
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) { }

  getData(): Observable<OrderCategory[]> {
    var params = new HttpParams();

    return this.http.get<OrderCategory[]>(this.endPoint, { params })
      .pipe(map(result => result as OrderCategory[]));
  }

  deleteItem(itemId: number): any {
    return this.http.delete(this.endPoint + `/${itemId}`);
  }

  updateItem(itemId: OrderCategory): Observable<OrderCategory> {
    return this.http
      .put<OrderCategory>(this.endPoint + `/${itemId.id}`, itemId);
  }

  createItem(itemId: OrderCategory): Observable<OrderCategory> {
    return this.http.post<OrderCategory>(this.endPoint, itemId);
  }
}
