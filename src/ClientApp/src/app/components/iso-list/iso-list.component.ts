import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Department } from 'src/app/core/interfaces/Department';
import { DepartmentService } from 'src/app/core/services/department.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IIsoFiles } from 'src/app/core/interfaces/IsoFiles';
import { ModalDialogComponent } from '../dialog/modal/modal-dialog.component';
import { FileService } from 'src/app/core/services/file.service';
import { DialogComponent } from '../dialog/delete/dialog.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IIsoService } from 'src/app/core/interfaces/IsoService';


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
  columnsToDisplay: string[] = ['isoServiceNumber', 'isoServiceName', 'departments', 'action'];
  expandedElement: Department | null;
  VOForm: FormGroup;
  @ViewChild(MatTable) table: MatTable<any>;
  filterField = new FormControl('');
  departments: Department[] = [];


  dataSource = new MatTableDataSource();
  title = 'Услуги';
  isLoading = true;
  pathToFile = 'api/isofile';
  endPointPath = 'api/isoservice';
  pageNumber: number = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private fileService: FileService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {  
    this.departmentService.getAllWithIsoServices().subscribe(
      {
        next: (result) => {
          this.departments = result as Department[];
          this.isLoading = false;
          this.prepareDataSource();
        }
      });
  }

  prepareDataSource(): void {
    this.dataSource = this.getDataSource();
    this.dataSource.paginator = this.paginator;
    this.onPaginateChange(this.paginator, this.paginatorList);

    console.log(this.dataSource.data);

    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    }


    //this.dataSource.filter = 'оа';
    //this.dataSource.filter = '1011';

    //Custom filter according to name column
    // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
    //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
  }

  getDataSource() {
    
    let data: IIsoService[] = [];

    this.VOForm = this.fb.group({
      VORows: this.fb.array([]),
    })

    //const result = [].concat(...this.departments.map((item) => item.isoServices));
    let result = this.departments.map(value =>
      value.isoServices.map(child => Object.assign({ departmentId: value.id, departmentName: value.name }, child))).reduce((l, n) => l.concat(n), []);

      data = result.map((val) => Object.assign(
      {
        id: val.id,
        departmentId: val.departmentId,
        name: val.name,
        number: val.number,
        isoServiceId: val.id,
        isoFiles: val.isoFiles.map(f =>
          <IIsoFiles>{ id: f.id, filePath: f.filePath, categoryName: f.isoFileCategory.name })
      }));

    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        data.map((val) =>
          this.fb.group({
            departmentId: new FormControl({ value: val.departmentId, disabled: true }),
            isoServiceName: new FormControl(val.name),
            isoServiceNumber: new FormControl(val.number),
            isoServiceId: new FormControl(val.id),
            isoFiles: new FormControl(val.isoFiles),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          }),
        ),
      ), 
    }) 

    //this.dataSource = new MatTableDataSource(this.dataSource.data);
    return new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
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
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '60%',
      data: { title: 'Добавяне на услуга', serviceNumber: '234234' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
      console.log('The dialog was closed');
    });

  }

  downloadFile(fileId: string) {
    this.fileService.downloadFile(fileId, this.pathToFile);
  }

  // this function will enabled the select field for editd
  EditSVO(event, VOFormElement, i) {
    event.stopPropagation();
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
    VOFormElement.get('VORows').at(i).get('departmentId').enable(true);
    // this.isEditableNew = true;
  }

  SaveVO(event, VOFormElement, i, element) {
    event.stopPropagation();
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    VOFormElement.get('VORows').at(i).get('departmentId').disable(false);
  }

  CancelSVO(event, VOFormElement, i) {
    event.stopPropagation();
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    VOFormElement.get('VORows').at(i).get('departmentId').disable(false);
  }

  deleteService(event, VOFormElement, i, element) {
    event.stopPropagation();
    let serviceId = element.value.isoServiceId;
    let serviceName = element.value.isoServiceName;
    //console.log(this.dataSource.filteredData.indexOf(element))
    console.log(i);

    if (!serviceId) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize), 1);
      this.dataSource.data = data;
      return;
    }

    let dialogRef = this.dialog.open(DialogComponent, { data: { name: 'Сигурни ли сте, че искате да изтриете услугата: ' + serviceName + '?' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.fileService.deleteFile(serviceId, this.endPointPath)
          .subscribe({
            next: () => {
              this.removeDepartment(element);
              this.table.renderRows();
              
              this.snackbar.success('Услугата беше изтрита');
            },
            error: (error) => {
              this.snackbar.error('Грешка при изтриване на услуга!');
            }
          });
      } else {
        console.log(`Dialog result is: ${result}`);
      }
    });
  }

  removeDepartment(element: any): void {
    this.dataSource.data = this.dataSource.data.filter(item => item != element);
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
