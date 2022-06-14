import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order, OrderCategory } from 'src/app/core/interfaces/Order';
import { FileService } from 'src/app/core/services/file.service';
import { OrderCategoryService } from 'src/app/core/services/orderCategory.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css']
})
export class OrderDialogComponent implements OnInit {
  orderForm: FormGroup;
  title = 'Добавяне на заповед';
  orderCategories: OrderCategory[] = [];
  selectedFile: any;
  fileInfoMessage: any = '';
  endPointPath = 'api/orders';
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderCategoryService: OrderCategoryService,
    private snackbar: SnackbarService,
    private fileService: FileService,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
  ) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.orderCategoryService.getData().subscribe(
      {
        next: (result) => {
          this.orderCategories = result;
          this.prepairForm();
        }
      });
  }

  prepairForm() {
    this.orderForm = this.fb.group({
      number: new FormControl(this.data.number || '', Validators.required),
      about: new FormControl(this.data.about || '', Validators.required),
      date: new FormControl(this.data.date || '', Validators.required),
      categories: new FormControl(this.orderCategories, Validators.required),
      orderCategoryId: new FormControl({ value: this.data.orderCategoryId || '', disabled: false }),
      orderCategoryName: new FormControl({ value: this.data.orderCategoryName || '', disabled: false }),
      filePath: new FormControl(this.data.filePath || '', Validators.required),
      file: new FormControl(this.data.file || ''),
    });
  }

  // At the file input element
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.orderForm.get('filePath').patchValue(event.target.files[0].name);
    }
  }




  onSaveClick(event: any) {

    if (this.orderForm.status !== 'VALID') {
      for (const field in this.orderForm.controls) { // 'field' is a string
        this.orderForm.controls[field].markAllAsTouched();
      }

      return;
    }

    let newOrder = this.generateOrderFormData();
    this.uploadOrder(newOrder);

    // for (var pair of newOrder.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

  }

  uploadOrder(order) {
    this.fileService.uploadFile(order, this.endPointPath, this.data.newRecord)
      .subscribe(
        {
          next: (event) => {
            if (event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              this.fileInfoMessage = `Файлът е ${percentDone}% качен.`;

            } else if (event instanceof HttpResponse) {
              this.fileInfoMessage = 'Файлът е качен!';
              this.fileInfoMessage = event.body;
            }
          },
          error: (error) => {
            this.snackbar.error(`Грешка при качване: ${JSON.stringify(error.message)}`);
          }
          ,
          complete: () => {
            //this.fileInfoMessage = 'Upload done: ID - ' + this.fileInfoMessage;
            this.snackbar.infoWitHide('Заповедта беше записана');
            this.closeDialog();
          }
        });
  }


  private closeDialog() {
    this.dialogRef.close(this.generateOrder());
  }

  private generateOrderFormData(): FormData {
    let formData = new FormData();
    //formData.append('id', this.orderForm.get('id').value);
    formData.append('number', this.orderForm.get('number').value);
    formData.append('date', new Date(this.orderForm.get('date').value).toISOString());
    formData.append('about', this.orderForm.get('about').value);
    formData.append('orderCategoryId', this.orderForm.get('orderCategoryId').value.toString());
    formData.append('file', this.selectedFile);
    formData.append('filePath', this.orderForm.get('filePath').value);

    return formData;
  }

  private generateOrder(): Order {
    return {
      id: this.fileInfoMessage.id,
      number: this.orderForm.get('number').value,
      date: new Date(this.orderForm.get('date').value).toISOString(),
      about: this.orderForm.get('about').value,
      orderCategoryId: this.orderForm.get('orderCategoryId').value,
      orderCategoryName: this.orderCategories[this.orderForm.get('orderCategoryId').value].name,
      filePath: this.orderForm.get('filePath').value,
    } as Order;
  }
}
