import { Component, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { Department } from 'src/app/core/interfaces/Department'
import { DepartmentService } from 'src/app/core/services/department.service'
import { SnackbarService } from 'src/app/core/services/snackbar.service'
import { Contact } from '../../core/interfaces/Contact'
import { ContactService } from '../../core/services/contact.service'
import { DialogComponent } from '../dialog/dialog.component'


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contacts: Contact[] = [];
  departments: Department[] = [];
  displayedColumns: string[] = ['id', 'fullName', 'phone', 'email','department', 'action'];
  dataSource = new MatTableDataSource<any>();
  title = 'Контакти';
  isLoading = true;

  pageNumber: number = 1;
  VOForm: FormGroup;
  isEditableNew: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private contactService: ContactService,
    private departmentService: DepartmentService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.contactService.getData().subscribe((result) => {
      this.contacts = result as Contact[];
      this.contacts.forEach(
        (x) => (x.fullName = [x.firstName, x.middleName, x.lastName].join(' ')),
      )
      this.initiateForm();
    });

    this.departmentService.getData().subscribe((result =>{
        this.departments = result as Department[];
    }));    
  }

  initiateForm() {
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    })

    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.contacts.map((val) =>
          this.fb.group({
            id: new FormControl(val.id),
            fullName: new FormControl(val.fullName),
            phone: new FormControl(val.phone),
            email: new FormControl(val.email),
            department: new FormControl("Department"),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          }),
        ),
      ), //end of fb array
    }) // end of form group cretation
    this.isLoading = false
    this.dataSource = new MatTableDataSource(
      (this.VOForm.get('VORows') as FormArray).controls,
    )
    this.dataSource.paginator = this.paginator

    const filterPredicate = this.dataSource.filterPredicate
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter)
    }

    //Custom filter according to name column
    // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
    //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
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
    this.dataSource.paginator = this.paginator
    this.paginatorList = document.getElementsByClassName(
      'mat-paginator-range-label',
    )

    this.onPaginateChange(this.paginator, this.paginatorList)

    this.paginator.page.subscribe(() => {
      // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList)
    })
  }

  applyFilter(event: Event) {
    //  debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    control.insert(0, this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls);
  }

  // this function will enabled the select field for editd
  EditSVO(VOFormElement, i) {
    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false)
    // this.isEditableNew = true;
  }

  SaveVO(VOFormElement, i) {
    let contact = this.generateContact(VOFormElement, i);
    let recordType = VOFormElement.get('VORows').at(i).get('action').value;

    if (contact === null) {
      return;
    }

    if (recordType === 'newRecord') {
      this.contactService.addContactItem(contact).subscribe({
        next: (data) => {
          this.snackbar.success('Успешно добавяне на записа');
          VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
          VOFormElement.get('VORows').at(i).get('action').patchValue('existingRecord');
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при добавяне на записа! ' + error.message);
        },
      });
    } else {
      this.contactService.updateContactItem(contact).subscribe({
        next: (data) => {
          this.snackbar.success('Успешно обновяване на записа');
          VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при обновяване на записа! ' + error.message);
        },
      });
    }
  }

  DeleteSVO(VOFormElement, i) {
    let id = VOFormElement.get('VORows').at(i).value.id;
    let fullName = VOFormElement.get('VORows').at(i).value.fullName;

    if (!id) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize), 1);
      this.dataSource.data = data;
      return;
    }

    let dialogRef = this.dialog.open(DialogComponent, { data: { name: 'Сигурни ли сте, че искате да изтриете контакт: ' + fullName + '?' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.contactService.deleteContactItem(id)
          .subscribe({
            next: () => {
              const data = this.dataSource.data;
              data.splice((this.paginator.pageIndex * this.paginator.pageSize) + i, 1);
              this.dataSource.data = data;
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
  CancelSVO(VOFormElement, i) {
    //this.initiateForm();
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  paginatorList: HTMLCollectionOf<Element>
  idx: number
  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(
      (idx) => {
        paginator.pageIndex = 0;
        let from = paginator.pageSize * paginator.pageIndex + 1;

        let to =
          paginator.length < paginator.pageSize * (paginator.pageIndex + 1)
            ? paginator.length
            : paginator.pageSize * (paginator.pageIndex + 1);

        let toFrom = paginator.length == 0 ? 0 : `${from} - ${to}`;
        let pageNumber =
          paginator.length == 0
            ? `0 of 0`
            : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
        let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

        if (list.length >= 1) list[0].innerHTML = rows;
      },
      0,
      paginator.pageIndex,
    )
  }

  private initiateVOForm(): FormGroup {
    return this.fb.group({
      id: new FormControl(),
      fullName: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      department: new FormControl(''),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }

  private generateContact(VOFormElement: any, i): Contact {

    let names = VOFormElement.get('VORows')
      .at(i)
      .value.fullName.trim()
      .split(/[\s,]+/);

    if (names.length !== 3) {
      this.snackbar.infoWitHide('Въведете трите имена');
      return null;
    }

    return {
      id: VOFormElement.get('VORows').at(i).value.id,
      firstName: names[0],
      middleName: names[1],
      lastName: names[2],
      phone: VOFormElement.get('VORows').at(i).value.phone,
      email: VOFormElement.get('VORows').at(i).value.email,
      department: VOFormElement.get('VORows').at(i).value.department,
    } as Contact;
  }
}
