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
import { SnackbarService } from 'src/app/core/services/snackbar.service'
import { DeleteDialogComponent } from '../dialog/delete/delete-dialog.component'
import { Order, OrderCategory } from 'src/app/core/interfaces/Order'
import { OrderService } from 'src/app/core/services/order.service'
import { DatePipe } from '@angular/common'
import { OrderCategoryService } from 'src/app/core/services/orderCategory.service'


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  orderCategories: OrderCategory[] = [{ id: null, name: 'Всички' }];
  displayedColumns: string[] = ['number', 'about', 'shortDate', 'filePath', 'category', 'action'];
  dataSource = new MatTableDataSource<any>();
  title = 'Заповеди';
  isLoading = true;

  pageNumber: number = 1;
  VOForm: FormGroup;
  isEditableNew: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  datePipeString: string;

  FormCategory: FormGroup;
  selectedState = ['1'];

  statusFilter = new FormControl('');
  sourceFilter = new FormControl('');
  filterValues: any = {
    status: '',
    source: ''
  }
  private fieldListener() {
    this.statusFilter.valueChanges
      .subscribe(
        status => {
          this.filterValues.status = status;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.sourceFilter.valueChanges
      .subscribe(
        source => {
          this.filterValues.source = source;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }
  private createFilter(): (contact: Order, filter: string) => boolean {
    let filterFunction = function (contact, filter): boolean {
      let searchTerms = JSON.parse(filter);

      return contact.status.indexOf(searchTerms.status) !== -1
        && contact.source.indexOf(searchTerms.source) !== -1;
    }

    return filterFunction;
  }
  clearFilter() {
    this.sourceFilter.setValue('');
    this.statusFilter.setValue('');
  }



  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private orderCategoryService: OrderCategoryService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.orderCategoryService.getData().subscribe(
      {
        next: (result) => {
          this.orderCategories = result;
        }
      });

    this.orderService.getData().subscribe(
      {
        next: (result) => {
          this.orders = result as Order[];
          this.orders.map(o => {
            o.shortDate = this.datePipe.transform(o.date, 'dd-MM-yyyy', 'bg-BG');
          })
          this.prepareDataSource();
        },
        error: (error) => {
          this.snackbar.error('Грешка при получаване на данни за заповедите');
        }
      });

    this.datePipeString = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy', 'bg-BG');
    //console.log(this.datePipeString);
  }

  onChangeCategory(event) {
    let toggle = event.source;

    if (toggle?.value != 1) {
      //this.selectedState = ['1'];
      this.selectedState = event.value.filter(b => b !== '1');
    } else {
      this.selectedState = event.value.filter(b => b === '1');
    }

    console.log(toggle);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  loadFilter() {
    this.dataSource.filterPredicate = ((data, filter) => {
      const b = !data.value.category || data.value.category.toLowerCase().includes(filter);
      //const a = !filter.position || data.position === filter.position;
      //const c = !filter.symbol || data.symbol === filter.symbol;
      //return a && b && c;
      return b;
    }) as (Order, string) => boolean;

    // const filterPredicate = this.dataSource.filterPredicate;
    // this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
    //   return filterPredicate.call(this.dataSource, data.value, filter);
    // }


    // //Custom filter according to name column
    // // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
    // //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
  }

  prepareDataSource(): void {
    this.VOForm = this.fb.group({
      VORows: this.fb.array([]),
    })

    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.orders.map((val) =>
          this.fb.group({
            id: new FormControl(val.id),
            number: new FormControl(val.number),
            about: new FormControl(val.about),
            shortDate: new FormControl(val.shortDate),
            filePath: new FormControl(val.filePath),
            category: new FormControl(val.orderCategory.name),
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
    element.get('isEditable').patchValue(false);
    // this.isEditableNew = true;
  }


  saveVO(element) {
    if (element.status !== 'VALID') {
      this.snackbar.error('Невалидни данни!');
      return;
    }

    let newOrder = this.generateOrder(element);
    if (newOrder === null) return;

    let recordType = element.value.action;

    if (recordType === 'newRecord') {
      this.orderService.createItem(newOrder).subscribe({
        next: (data) => {
          this.snackbar.success('Успешно добавяне на записа');
          element.get('isEditable').patchValue(true);
          element.get('action').patchValue('existingRecord');
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при добавяне на записа! ' + error.message);
        },
      });
    } else {
      this.orderService.updateItem(newOrder).subscribe({
        next: (data) => {
          this.snackbar.success('Успешно обновяване на записа');
          element.get('isEditable').patchValue(true);
        },
        error: (error) => {
          this.snackbar.error('Възникна грешка при обновяване на записа! ' + error.message);
        },
      });
    }
  }

  deleteSVO(element) {
    let id = element.value.id;
    let orderNumber = element.value.number;

    if (!id) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize), 1);
      this.dataSource.data = data;
      return;
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, { data: { name: 'Сигурни ли сте, че искате да изтриете записа за: ' + orderNumber + '?' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.orderService.deleteItem(id)
          .subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(item => item != element);
              this.snackbar.success('Записът беше изтрит');
            },
            error: (error) => {
              this.snackbar.error('Грешка при изтриване на запис!');
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
      number: new FormControl('', [Validators.required]),
      about: new FormControl('', [Validators.required]),
      shortDate: new FormControl('', [Validators.required]),
      filePath: new FormControl('', [Validators.required]),
      orderCategory: new FormControl('', [Validators.required]),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }


  private generateOrder(element): Order {
    return {
      id: element.value.id,
      number: element.value.number,
      about: element.value.about,
      date: element.value.shortDate,
      filePath: element.value.filePath,
      orderCategory: element.value.orderCategory,
    } as Order;
  }
}
