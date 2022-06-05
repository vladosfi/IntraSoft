import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { Order } from '../interfaces/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  endPoint = this.baseUrl + 'api/orders'
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {}

  getData<Order>(): Observable<Order[]> {
    var params = new HttpParams();

    return this.http.get<Order[]>(this.endPoint, { params })
    .pipe(map(result => result as Order[]));
  }

  deleteItem(orderId: number): any {
    return this.http.delete(this.endPoint + `/${orderId}`);
  }

  updateItem(item: Order): Observable<Order> {
    return this.http
      .put<Order>(this.endPoint + `/${item.id}`, item);
  }

  createItem(orderId: Order): Observable<Order> {
    return this.http.post<Order>(this.endPoint, orderId);
  }
}
