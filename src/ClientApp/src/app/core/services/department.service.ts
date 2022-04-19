import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Department } from '../interfaces/Department'

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  url = this.baseUrl + 'api/department'
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {}

  getData<Department>(): Observable<Department> {
    var params = new HttpParams()
    return this.http.get<Department>(this.url, { params })
  }

  deleteDepartmentItem(departmentId: number): any {
    return this.http.delete(this.url + `/${departmentId}`);
  }

  updateDepartmentItem(departmentItem: Department): Observable<Department> {
    return this.http
      .put<Department>(this.url + `/${departmentItem.id}`, departmentItem);
  }

  addDepartmentItem(departmentItem: Department): Observable<Department> {
    return this.http.post<Department>(this.url, departmentItem);
  }
}
