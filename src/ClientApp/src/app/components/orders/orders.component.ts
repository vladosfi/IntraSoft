import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
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
import { FileService } from 'src/app/core/services/file.service'
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { OrderDialogComponent } from './order-dialog/order-dialog.component'




@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  orderCategories: OrderCategory[] = [{ id: null, name: 'Всички' }];
  displayedColumns: string[] = ['number', 'about', 'date', 'categories', 'filePath', 'action'];
  dataSource = new MatTableDataSource<any>();
  title = 'Заповеди';
  endPointPath = 'api/orders';
  isLoading = true;
  uploadFile: any;
  fileInfoMessage = '';

  pageNumber: number = 1;
  VOForm: FormGroup;
  isEditableNew: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchField') searchField: ElementRef;
  datePipeString: string;

  FormCategory: FormGroup;
  selectedState = ['0'];



  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private orderCategoryService: OrderCategoryService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private ref: ChangeDetectorRef,
    private fileService: FileService,
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
          // this.orders.map(o => {
          //   o.shortDate = this.datePipe.transform(o.date, 'dd-MM-yyyy', 'bg-BG');
          // })
          this.prepareDataSource();
        },
        error: (error) => {
          this.snackbar.error('Грешка при получаване на данни за заповедите');
        }
      });

    this.datePipeString = this.datePipe.transform(Date.now(), 'dd-MMM-yyyy', 'bg-BG');
    //console.log(this.datePipeString);
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  onChangeCategory(event) {
    let toggle = event.source;

    if (toggle?.value != '0') {
      this.selectedState = event.value.filter(b => b !== '0');
      this.applyFilter(event);
    } else {
      this.selectedState = event.value.filter(b => b === '0');
      this.applyFilter(event);
    }
  }

  clearSearchField() {
    this.searchField.nativeElement.value = '';
    this.dataSource.filter = '';
    this.selectedState = ['0'];
  }

  applyFilter(event: Event) {
    //const filterValue = (event.target as HTMLInputElement)?.value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
    const filterValue = this.searchField.nativeElement.value ? this.searchField.nativeElement.value.trim().toLowerCase() : '';


    this.dataSource.filter = {
      about: filterValue,
      number: filterValue,
      category: this.selectedState,
    } as unknown as string;
  }


  loadFilter() {
    this.dataSource.filterPredicate = ((data, filter) => {
      const a = !filter.about || data?.value.about.toLowerCase().includes(filter.about);
      const b = !filter.number || data?.value.number.toLowerCase().includes(filter.number);
      const c = !filter.category || filter.category.find(element => {
        if (element == 0) return true;
        console.log(data);
        return element == data?.controls?.categoryId?.value;
      });

      return (a || b) && c;
    }) as (Order, string) => boolean;
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
            date: new FormControl(val.date),
            filePath: new FormControl(val.filePath),
            categoryId: new FormControl(val.orderCategory.id),
            categoryName: new FormControl(val.orderCategory.name),
            categories: new FormControl(this.orderCategories),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          }),
        ),
      ), //end of fb array
    }) // end of form group cretation
    this.isLoading = false;
    this.prepairTableView();
  }

  prepairTableView() {
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

  downloadFile(element) {
    this.fileService.downloadFile(element.get('id').value, this.endPointPath);
  }

  addNewRow() {
    const dialogRef = this.dialog.open(OrderDialogComponent,
      {
        data: {
          title: "Добавяне на заповед",
          number: 121212,
          about: 'asdasd',
          orderCategoryId: 1,
          date: new Date(),
          newRecord: true
        },
        width: '50%'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const control = this.VOForm.get('VORows') as FormArray;
        control.insert(0, this.initiateNewRow(result));
        this.prepairTableView();
        this.snackbar.infoWitHide('Заповедта беше записана');
      }
    });
  }

  // this function will enabled the select field for editd
  editSVO(element) {
    const order = this.generateOrder(element);

    const dialogRef = this.dialog.open(OrderDialogComponent,
      {
        data: {
          title: "Редактиране на заповед",
          id: order.id,
          number: order.number,
          about: order.about,
          orderCategoryId: order.orderCategoryId,
          date: order.date,
          filePath: order.filePath,
          newRecord: false
        },
        width: '50%'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        element.get('isEditable').patchValue(true);
        element.get('number').patchValue(result.number);
        element.get('about').patchValue(result.about);
        element.get('date').patchValue(result.date);
        element.get('orderCategoryName').patchValue(result.orderCategoryName);
        element.get('orderCategoryId').patchValue(result.orderCategoryId);
        element.get('action').patchValue('existingRecord');
        this.prepairTableView();
        this.snackbar.infoWitHide('Заповедта беше записана');
      }
    });
  }

  private deleteSVO(element) {
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

  paginatorList: HTMLCollectionOf<Element>;
  idx: number;
  private onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
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



  private initiateNewRow(order: Order): FormGroup {
    return this.fb.group({
      id: new FormControl(order.id || ''),
      number: new FormControl(order.number || ''),
      about: new FormControl(order.about || ''),
      date: new FormControl(order.date || ''),
      filePath: new FormControl(order.filePath || ''),
      categoryId: new FormControl(order.orderCategoryId || ''),
      categoryName: new FormControl(order.orderCategoryName || ''),
      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false),
    });
  }

  private generateOrder(element): Order {
    return {
      id: element.value.id,
      number: element.value.number,
      date: element.value.date,
      about: element.value.about,
      filePath: element.value.filePath,
      orderCategoryId: element.value.categoryId,
    } as Order;
  }
}
