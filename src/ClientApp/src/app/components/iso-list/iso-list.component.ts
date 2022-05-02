import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-iso-list',
  templateUrl: './iso-list.component.html',
  styleUrls: ['./iso-list.component.css']
})
export class IsoListComponent implements OnInit {
  name = 'Angular 5';
  options={
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    };
    files = ['File','File','File','File'];

constructor( ) {
      // Create 100 users
    const users: UserData[] = [];
    var users1=[];
    for (let i = 11000; i <= 11100; i++) { /*users.push(createNewUser(i));*/    
      users1.push({"cnt" : i,
      "name":"Lorem Ipsum is simply dummy text of the printing and typesetting industry."+i});
     }

     

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users1);
}
 
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(){
  
}

//displayedColumns = ['number', 'name', 'department', 'files'];
displayedColumns = ['number', 'name', 'department'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}
