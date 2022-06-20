import { Component, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { Department } from 'src/app/core/interfaces/Department'
import { DepartmentService } from 'src/app/core/services/department.service'
import { SnackbarService } from 'src/app/core/services/snackbar.service'
import { fullNameValidator } from 'src/app/components/validators/validators'
import { Contact } from '../../core/interfaces/Contact'
import { ContactService } from '../../core/services/contact.service'
import { DeleteDialogComponent } from '../dialog/delete/delete-dialog.component'


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  minWorkPhoneLen = 9;
  maxWorkPhoneLen = 10;
  minPrivatePhoneLen = 9;
  maxPrivatePhoneLen = 10;
  phoneLen = 6;
  positionMaxLen = 100;
  roomMaxLen = 50;

  contacts: Contact[] = [];
  departments: Department[] = [];
  displayedColumns: string[] = ['id', 'fullName', 'position', 'room', 'phone', 'workPhone', 'privatePhone', 'email', 'departments', 'action'];
  dataSource = new MatTableDataSource<any>();
  title = 'Контакти';
  isLoading = true;

  pageNumber: number = 1;
  VOForm: FormGroup;
  isEditableNew: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private departmentService: DepartmentService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(
      {
        next: (result) => {
          this.departments = result;
        },
        error: (error) => {
          this.snackbar.error('Грешка при получаване на данни за дирекцията');
        }
      });

    this.contactService.getData().subscribe(
      {
        next: (result) => {
          this.contacts = result as Contact[];
          this.contacts.forEach(
            (x) => (x.fullName = [x.firstName, x.middleName, x.lastName].join(' ')),
          )
          this.prepareDataSource();
        },
        error: (error) => {
          this.snackbar.error('Грешка при получаване на данни за контактите');
        }
      });
  }


  loadFilter() {
    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    }


    //Custom filter according to name column
    // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
    //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
  }

  prepareDataSource(): void {
    this.VOForm = this.fb.group({
      VORows: this.fb.array([]),
    })

    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.contacts.map((val) =>
          this.fb.group({
            id: new FormControl(val.id),
            fullName: new FormControl(val.fullName),
            position: new FormControl(val.position),
            room: new FormControl(val.room),
            phone: new FormControl(val.phone),
            workPhone: new FormControl(val.workPhone),
            privatePhone: new FormControl(val.privatePhone),
            email: new FormControl(val.email, Validators.email),
            departmentId: new FormControl({ value: val.departmentId, disabled: true }),
            departments: new FormControl(this.departments),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          }),
        ),
      ), //end of fb array
    }) // end of form group cretation
    this.isLoading = false;
    this.dataSource = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
    this.dataSource.paginator = this.paginator;
    this.onPaginateChange(this.paginator, this.paginatorList);
    this.loadFilter();
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

  exportContacts(){
    this.contactService.exportToExcel();
  }

  // @ViewChild('table') table: MatTable<PeriodicElement>;
  AddNewRow() {
    // Do not add new record if last is not added correctly
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].value.action === 'newRecord') {
        return;
      }
    }

    const control = this.VOForm.get('VORows') as FormArray;
    control.insert(0, this.initiateNewRow());
    this.dataSource = new MatTableDataSource(control.controls);
  }

  // this function will enabled the select field for editd
  editSVO(element) {
    element.get('departmentId').enable(true);
    element.get('isEditable').patchValue(false);

    // this.isEditableNew = true;
  }


  saveVO(element) {
    if (element.status !== 'VALID') {
      this.snackbar.error('Невалидни данни!');
      return;
    }

    let contact = this.generateContact(element);
    if (contact === null) return;

    let recordType = element.value.action;

    if (recordType === 'newRecord') {
      this.contactService.createItem(contact).subscribe({
        next: (data) => {
          this.snackbar.success('Успешно добавяне на записа');
          element.get('isEditable').patchValue(true);
          element.get('action').patchValue('existingRecord');
          element.get('departmentId').disable(true);
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при добавяне на записа! ' + error.message);
        },
      });
    } else {
      this.contactService.updateItem(contact).subscribe({
        next: (data) => {
          this.snackbar.success('Успешно обновяване на записа');
          element.get('isEditable').patchValue(true);
          element.get('departmentId').disable(true);
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при обновяване на записа! ' + error.message);
        },
      });
    }
  }

  deleteSVO(element) {
    let id = element.value.id;
    let fullName = element.value.fullName;


    if (!id) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize), 1);
      this.dataSource.data = data;
      return;
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, { data: { name: 'Сигурни ли сте, че искате да изтриете контакт: ' + fullName + '?' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.contactService.deleteItem(id)
          .subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(item => item != element);
              this.snackbar.success('Контакта беше изтрит');
            },
            error: (error) => {
              this.snackbar.error('Грешка при изтриване на кoнтакт!');
            }
          });
      } else {
        console.log(`Dialog result is: ${result}`);
      }
    });
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  cancelSVO(element) {
    this.prepareDataSource();
    element.get('departmentId').disable(false);
    element.get('isEditable').patchValue(true);
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


  private initiateNewRow(): FormGroup {
    return this.fb.group({
      id: new FormControl(),
      fullName: new FormControl('', [Validators.required, Validators.maxLength(300), fullNameValidator()]),
      position: new FormControl('', [Validators.required, Validators.maxLength(this.positionMaxLen)]),
      room: new FormControl('', [Validators.required, Validators.maxLength(this.roomMaxLen)]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(this.phoneLen), Validators.maxLength(this.phoneLen)]),
      workPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(this.minWorkPhoneLen), Validators.maxLength(this.maxWorkPhoneLen)]),
      privatePhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(this.maxPrivatePhoneLen), Validators.maxLength(this.maxPrivatePhoneLen)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.email]),
      departmentId: new FormControl('', Validators.required),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }


  private generateContact(element): Contact {
    let names = element.value.fullName.trim().split(/[\s,]+/);

    if (names.length === 2) {
      names.push(names[1]);
      names[1] = '';
    }

    return {
      id: element.value.id,
      firstName: names[0],
      middleName: names[1],
      lastName: names[2],
      position: element.value.position,
      room: element.value.room,
      phone: element.value.phone,
      workPhone: element.value.workPhone,
      privatePhone: element.value.privatePhone,
      email: element.value.email,
      departmentId: element.value.departmentId,
    } as Contact;
  }
}
