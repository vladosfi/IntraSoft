import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from 'src/app/core/interfaces/Contact';
import { Department } from 'src/app/core/interfaces/Department';
import { DepartmentService } from 'src/app/core/services/department.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IIsoFiles } from 'src/app/core/interfaces/IsoFiles';
import { EditDialogComponent } from '../dialog/edit/edit-dialog.component';


@Component({
  selector: 'app-iso-list',
  templateUrl: './iso-list.component.html',
  styleUrls: ['./iso-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IsoListComponent implements OnInit {
  contacts: Contact[] = [];
  departments: Department[] = [];
  columnNames: string[] = ['isoServicenumber', 'isoServiceName', 'department', 'action'];
  //columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  expandedElement: null;

  dataSource = new MatTableDataSource<any>();
  title = 'Услуги';
  isLoading = true;

  pageNumber: number = 1;
  isEditableNew: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.departmentService.getAllWithIsoServices().subscribe(
      {
        next: (result) => {
          this.departments = result as Department[];

          // this.departments.forEach(svc => {
          //   //console.log(svc.isoServices);
          //   svc.isoServices.forEach(element => {
          //     //console.log(element.isoFiles);                  
          //     element.isoFiles.forEach(file => {
          //       console.log(file.filePath);
          //       console.log(file.isoFileCategory.name);
          //     });
          //   });
          // });


          this.initiateTableData();
        }
      });
  }

  initiateTableData() {
    // this.departments.map((val) => {
    //   console.log(val)
    // });

    const result = [].concat(...this.departments.map((item) =>
      item.isoServices.map((isoService) =>
        Object.assign({}, item,
          {
            isoServiceName: isoService.name, isoServiceNumber: isoService.number,
            isoFiles: isoService.isoFiles.map(f =>
              <IIsoFiles>{ filePath: f.filePath, categoryName: f.isoFileCategory.name })
          }
        ))));

    this.dataSource.data = result;


    this.isLoading = false;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.onPaginateChange(this.paginator, this.paginatorList);

    //this.dataSource.filter = 'оа';
  }

  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName('mat-paginator-range-label');

    this.onPaginateChange(this.paginator, this.paginatorList);

    this.paginator.page.subscribe(() => { // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // @ViewChild('table') table: MatTable<PeriodicElement>;
  AddNewRow(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80%',
      data: { title: 'Добавяне на услуга', serviceNumber: '234234' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
      console.log('The dialog was closed');
    });

  }


  paginatorList: HTMLCollectionOf<Element>;
  idx: number;
  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout((idx) => {
      let from = (paginator.pageSize * paginator.pageIndex) + 1;

      let to = (paginator.length < paginator.pageSize * (paginator.pageIndex + 1))
        ? paginator.length
        : paginator.pageSize * (paginator.pageIndex + 1);

      let toFrom = (paginator.length == 0) ? 0 : `${from} - ${to}`;
      let pageNumber = (paginator.length == 0) ? `0 of 0` : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
      let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

      if (list.length >= 1)
        list[0].innerHTML = rows;

    }, 0, paginator.pageIndex);
  }

}
