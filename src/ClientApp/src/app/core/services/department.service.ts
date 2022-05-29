import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Department } from '../interfaces/Department'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  endPoint = this.baseUrl + 'api/departments'
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) { }


  // getAllWithIsoServices(): Observable<Department[]> {
  //   var params = new HttpParams();

  // let data = this.http.get<Department[]>(this.endPoint + '/GetAllWithIsoServices', { params })
  //     .pipe(map(result => result as Department[]));

  // data = this.departments.map(val =>
  //   val.isoServices.map(svc =>
  //     Object.assign({ departmentId: val.id }, svc)))
  //   .reduce((l, n) => l.concat(n), []);
  //return data;
  // }

  getAllDepartments(withoutDirectionDepartment: boolean = false): Observable<Department[]> {
    var params = new HttpParams();
    //const headers = new HttpHeaders().set('withoutDirectionDepartment', "true");

    params = params.append('withoutDirectionDepartment', withoutDirectionDepartment);

    return this.http.get<Department[]>(this.endPoint, {params})
      .pipe(map(result => result as Department[]));
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
