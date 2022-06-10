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
    const filterValue = this.searchField.nativeElement.value ? this.searchField.nativeElement.value.trim().toLowerCase()  : '';

    
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
            date: new FormControl({ value: val.date, disabled: true }),
            filePath: new FormControl(val.filePath),
            categoryId: new FormControl({ value: val.orderCategory.id, disabled: true }),
            categoryName: new FormControl({ value: val.orderCategory.name, disabled: true }),
            categories: new FormControl(this.orderCategories),
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


  downloadFile(element) {
    this.fileService.downloadFile(element.get('id').value, this.endPointPath);
  }


  // this function will enabled the select field for editd
  editSVO(element) {
    element.get('isEditable').patchValue(false);
    element.get('date').enable(true);
    element.get('categoryId').enable(true);
    // this.isEditableNew = true;
  }

  // At the file input element
  onFileChange(event: any, element) {
    if (event.target.files.length > 0) {
      this.uploadFile = event.target.files[0];
      element.get('filePath').patchValue(this.uploadFile.name);
    }
  }


  saveVO(element) {
    if (element.status !== 'VALID') {
      this.snackbar.error('Невалидни данни!');
      return;
    }

    let newOrder = this.generateOrder(element);
    if (newOrder === null) return;
    if (this.uploadFile == undefined) {
      console.log("No file selected!");
      return;
    }

    if (newOrder.orderCategoryId == null) {
      console.log("No item ID!");
      return;
    }

    let recordType = element.value.action;

    if (recordType === 'newRecord') {
      this.upload(element, newOrder, true);
    } else {
      this.upload(element, newOrder, false);
    }
  }

  upload(element, order, newRecord){

    let formData = new FormData();
    formData.append('file', this.uploadFile);
    formData.append('id', order.id?.toString());
    formData.append('number', order.number);
    formData.append('date', new Date(order.date).toISOString());
    formData.append('about', order.about);
    formData.append('filePath', order.filePath);
    formData.append('orderCategoryId', order.orderCategoryId.toString());

    this.fileService.uploadFile(formData, this.endPointPath, newRecord)
    .subscribe(
      {
        next: (event) => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            this.fileInfoMessage = `Файлът е ${percentDone}% качен.`;

          } else if (event instanceof HttpResponse) {
            this.fileInfoMessage = 'Файлът е качен!';
            this.fileInfoMessage = event.body;
            element.get('isEditable').patchValue(true);
            element.get('action').patchValue('existingRecord');
            element.get('filePath').disable(false);
            element.get('date').disable(false);
            element.get('categoryId').disable(false);
            this.prepareDataSource();
          }
        },
        error: (error) => {
          this.snackbar.error(`Upload Error: ${JSON.stringify(error.error)}`);
        }
        ,
        complete: () => {
          //this.fileInfoMessage = 'Upload done: ID - ' + this.fileInfoMessage;
          this.snackbar.infoWitHide('Заповедта беше записана');
        }
      });
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
    element.get('date').disable(false);
    element.get('categoryId').disable(false);
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
      date: new FormControl('', [Validators.required]),
      filePath: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      categoryName: new FormControl(''),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
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
