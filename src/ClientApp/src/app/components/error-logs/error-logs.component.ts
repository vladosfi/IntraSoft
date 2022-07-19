import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JL } from 'jsnlog';
import { ErrorLog } from 'src/app/core/interfaces/ErrorLog';
import { ErrorService } from 'src/app/core/services/error.service';


@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.css']
})
export class ErrorLogsComponent implements OnInit {
logs: ErrorLog[] = [];
datePipeString: string;
_logger: JL.JSNLog;


name = 'Angular 5';
options={
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(
      @Inject('JSNLOG') jl: JL.JSNLog,
      private errorLogService: ErrorService,
      private datePipe: DatePipe,
    ) {
      this._logger = jl;




            // Create 100 users
    const users: UserData[] = [];
    var users1=[];
    for (let i = 1; i <= 100; i++) { /*users.push(createNewUser(i));*/

      users1.push({"cnt" : i,"name":"batr"+i});

     }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users1);

     }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.errorLogService.getData().subscribe(
      {
        next: (result) => {
          this.logs = result as ErrorLog[];
          console.log(this.logs);
        }
      });

    //this.datePipeString = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy', 'bg-BG');
  }

  buttonClickHandler() {
    this._logger().error("Hi from the client");
  }





















  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

 addbut(){
   window.alert("addbutton");
 }
 editbut(){
   window.alert("editbutton");
 }


}


/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];





export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}
