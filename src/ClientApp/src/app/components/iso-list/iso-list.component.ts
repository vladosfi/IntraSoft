import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Department } from 'src/app/core/interfaces/Department';
import { DepartmentService } from 'src/app/core/services/department.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FileService } from 'src/app/core/services/file.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IIsoService } from 'src/app/core/interfaces/IsoService';
import { IsoService } from 'src/app/core/services/iso.service';
import { AddFileComponent } from '../dialog/add-file/add-file.component';
import { DeleteDialogComponent } from '../dialog/delete/delete-dialog.component';


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
  allIsoServices: IIsoService[] = [];


  dataSource = new MatTableDataSource<any>();
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
    private isoService: IsoService,
  ) { }

  ngOnInit(): void {

    this.VOForm = this.fb.group({
      VORows: this.fb.array([]),
    });

    this.departmentService.getAllDepartments(true).subscribe(
      {
        next: (result) => {
          this.departments = result;
        },
        error: (error) => {
          this.snackbar.error('Грешка при получаване на данни за дирекцията');
        }        
      });

    this.isoService.getIsoServices().subscribe(
      {
        next: (result) => {
          this.allIsoServices = result;
          this.isLoading = false;
          this.prepareDataSource();
        },
        error: (error) => {
          this.snackbar.error('Грешка при получаване на данни за услугите');
        }     
      });
  }


  prepareDataSource(): void {
    let data: IIsoService[] = [];
    data = this.allIsoServices;

    //console.log(data);

    this.dataSource = this.getDataSource(data);

    this.dataSource.paginator = this.paginator;
    this.onPaginateChange(this.paginator, this.paginatorList);



    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    }
    //this.dataSource.filter = 'оа';
    //Custom filter according to name column
    // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
    //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
    //this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  getDataSource(data: IIsoService[]): MatTableDataSource<AbstractControl> {

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
    });

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

  addNewRow(): void {
    // Do not add new record if last is not added correctly
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].value.action === 'newRecord') {
        return;
      }
    }

    const control = this.VOForm.get('VORows') as FormArray;
    control.insert(0, this.initiateVOForm());
    this.dataSource = new MatTableDataSource<any>(control.controls);
    this.dataSource.paginator = this.paginator;
  }

  editSVO(event, element) {
    element.get("isEditable").patchValue(false);
    element.get("departmentId").enable(true);
    // this.isEditableNew = true;
  }

  saveVO(element) {
    if (element.status !== 'VALID') {
      this.snackbar.error('Невалидни данни!');
      return;
    }
    let isoServiceItem = this.generateServiceElement(element);
    let recordType = element.value.action;

    if (recordType === 'newRecord') {
      this.isoService.createIsoItem(isoServiceItem).subscribe({
        next: (data) => {
          isoServiceItem = Object.assign(isoServiceItem, data);
          this.snackbar.success('Успешно добавяне на записа');
          element.get("isEditable").patchValue(true);
          element.get("action").patchValue('existingRecord');
          element.get("departmentId").disable(false);
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при добавяне на записа! ' + error.message);
        },
      });
    } else {
      this.isoService.updateIsoItem(isoServiceItem).subscribe({
        next: (data) => {
          this.snackbar.success('Успешно обновяване на записа');
          element.get("isEditable").patchValue(true);
          element.get("departmentId").disable(false);
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при обновяване на записа! ' + error.message);
        },
      });
    }
  }

  deleteService(element) {
    let serviceId = element.value.isoServiceId;
    let serviceName = element.value.isoServiceName;
    //console.log(this.dataSource.filteredData.indexOf(element))

    if (!serviceId) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize), 1);
      this.dataSource.data = data;
      return;
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, { data: { name: 'Сигурни ли сте, че искате да изтриете услугата: ' + serviceName + '?' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.fileService.deleteFile(serviceId, this.endPointPath)
          .subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(item => item != element);
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

  cancelSVO(element) {
    element.get("departmentId").disable(false);
    element.get("isEditable").patchValue(true);
  }

  downloadFile(fileId: string) {
    this.fileService.downloadFile(fileId, this.pathToFile);
  }

  addFile(element) {

    const dialogRef = this.dialog.open(AddFileComponent, {
      width: '50%',
      data: {
        title: `Добавяне на файл за услуга номер ${element.value.isoServiceNumber}`,
        serviceNumber: element.value.isoServiceNumber,
        serviceName: element.value.isoServiceName,
        serviceId: element.value.isoServiceId
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result: " + JSON.stringify(result));
      console.log('The dialog was closed');
      this.updateServiceItem(element);
    });
  }

  expandRow(event, element) {
    if (!element.get("isEditable").value) {
      event.stopPropagation();
    }
  }

  private updateServiceItem(element) {
    let isoServiceId = element.value.isoServiceId;
    this.isoService.getIsoServiceById<IIsoService>(isoServiceId)
      .subscribe(result => {
        element.get("isoFiles").patchValue(result.isoFiles);
      });
  }

  private generateServiceElement(element) {
    return Object.assign({},
      {
        id: element.value.isoServiceId,
        name: element.value.isoServiceName,
        number: element.value.isoServiceNumber,
        departmentId: element.value.departmentId,
        isoFiles: null,
      }) as IIsoService;
  }

  private initiateVOForm(): FormGroup {
    return this.fb.group({
      departmentId: new FormControl({ value: "", disabled: true }, Validators.required),
      isoServiceName: new FormControl("", Validators.required),
      isoServiceNumber: new FormControl("", Validators.required),
      isoServiceId: new FormControl(""),
      isoFiles: new FormControl(""),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false),
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
