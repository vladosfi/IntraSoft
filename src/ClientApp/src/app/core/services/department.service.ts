import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Department } from '../interfaces/Department'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  endPoint = this.baseUrl + 'api/department'
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {}


  getAllWithIsoServices(): Observable<Department[]> {
    var params = new HttpParams();

    return this.http.get<Department[]>(this.endPoint + '/GetAllWithIsoServices', { params })
      .pipe(map(result => result as Department[]));
  }

  getData<Department>(): Observable<Department> {
    var params = new HttpParams();
    return this.http.get<Department>(this.endPoint, { params });
  }

  deleteDepartmentItem(departmentId: number): any {
    return this.http.delete(this.endPoint + `/${departmentId}`);
  }

  updateDepartmentItem(departmentItem: Department): Observable<Department> {
    return this.http
      .put<Department>(this.endPoint + `/${departmentItem.id}`, departmentItem);
  }

  addDepartmentItem(departmentItem: Department): Observable<Department> {
    return this.http.post<Department>(this.endPoint, departmentItem);
  }
}
