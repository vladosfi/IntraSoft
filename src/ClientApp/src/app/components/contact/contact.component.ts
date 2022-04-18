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
  contacts: Contact[] =[];
  displayedColumns: string[] = [
    'id',
    'fullName',
    'phone',
    'email',
    'action',
  ]
  dataSource = new MatTableDataSource<any>()

  isLoading = true

  pageNumber: number = 1
  VOForm: FormGroup
  isEditableNew: boolean = true
  constructor(
    private fb: FormBuilder, 
    private _formBuilder: FormBuilder, 
    private contactService: ContactService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,) {}

  ngOnInit(): void {

    this.contactService.getData().subscribe((result) => {
          this.contacts = result as Contact[]
          this.contacts.forEach(
            (x) => (x.fullName = [x.firstName, x.middleName, x.lastName].join(' ')),
          )
          //this.dataSource = new MatTableDataSource(this.contacts);
          this.initiateForm();
        })
  }


  initiateForm(){

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

  @ViewChild(MatPaginator) paginator: MatPaginator

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
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  // @ViewChild('table') table: MatTable<PeriodicElement>;
  AddNewRow() {
    // this.getBasicDetails();
    const control = this.VOForm.get('VORows') as FormArray
    control.insert(0, this.initiateVOForm())
    this.dataSource = new MatTableDataSource(control.controls)
    // control.controls.unshift(this.initiateVOForm());
    // this.openPanel(panel);
    // this.table.renderRows();
    // this.dataSource.data = this.dataSource.data;
  }

  // this function will enabled the select field for editd
  EditSVO(VOFormElement, i) {
    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false)
    // this.isEditableNew = true;
  }

  // On click of correct button in table (after click on edit) this method will call
  SaveVO(VOFormElement, i) {
    //alert('SaveVO')
    alert(JSON.stringify(VOFormElement.get('VORows').at(i).value));
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true)
  }

  DeleteSVO(VOFormElement, i){
    alert(JSON.stringify(VOFormElement.get('VORows').at(i).value));
    VOFormElement.get('VORows').at(i).delete;

    // let dialogRef = this.dialog.open(DialogComponent, { data: { name: 'Are you sure you want to delete contact ' + this.currentMenu.text + '?' } });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'true') {
    //     var res = this.contactService.deleteContactItem(this.currentMenu.id)
    //       .subscribe({
    //         next: () => {
    //           //this.currentMenu = null;
    //           this.snackbar.success('Contact has been deleted');
    //         },
    //         error: (error) => {
    //           this.snackbar.error('Failed to delete Contact!');
    //         }
    //       });
    //   } else {
    //     console.log(`Dialog result is: ${result}`);
    //   }
    // });

  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement, i) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true)
  }

  paginatorList: HTMLCollectionOf<Element>
  idx: number
  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(
      (idx) => {
        let from = paginator.pageSize * paginator.pageIndex + 1

        let to =
          paginator.length < paginator.pageSize * (paginator.pageIndex + 1)
            ? paginator.length
            : paginator.pageSize * (paginator.pageIndex + 1)

        let toFrom = paginator.length == 0 ? 0 : `${from} - ${to}`
        let pageNumber =
          paginator.length == 0
            ? `0 of 0`
            : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`
        let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`

        if (list.length >= 1) list[0].innerHTML = rows
      },
      0,
      paginator.pageIndex,
    )
  }

  initiateVOForm(): FormGroup {
    return this.fb.group({
      position: new FormControl(234),
      name: new FormControl(''),
      weight: new FormControl(''),
      symbol: new FormControl(''),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    })
  }
}
