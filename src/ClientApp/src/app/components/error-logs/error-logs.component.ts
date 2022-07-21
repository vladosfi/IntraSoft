import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JL } from 'jsnlog';
import { ErrorLog } from 'src/app/core/interfaces/ErrorLog';
import { ErrorService } from 'src/app/core/services/error.service';
import { NotificationService } from 'src/app/core/services/notification.service';


@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.css']
})
export class ErrorLogsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['id', 'level', 'message', 'stackTrace','exception','logger','url','hostName','createdOn', 'action'];

  dataSource: MatTableDataSource<ErrorLog>;

  logs: ErrorLog[] = [];
  datePipeString: string;
  _logger: JL.JSNLog;



  constructor(
    @Inject('JSNLOG') jl: JL.JSNLog,
    private errorLogService: ErrorService,
    private datePipe: DatePipe,
    private snackbar: NotificationService,
  ) {
    this._logger = jl;




  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.errorLogService.getData().subscribe(
      {
        next: (result) => {
          this.logs = result as ErrorLog[];

          // Assign the data to the data source for the table to render
          this.dataSource = new MatTableDataSource(this.logs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });

    //this.datePipeString = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy', 'bg-BG');
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  buttonClickHandler() {
    this._logger().error("Hi from the client");
  }

  onDelete(row) {
    //alert("deletebutton");
    this.errorLogService.deleteItem(row.id)
          .subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(item => item != row);
              this.snackbar.success('Записът беше изтрит');
            }
          });
  }
}
