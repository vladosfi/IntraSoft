import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderCategory } from 'src/app/core/interfaces/Order';
import { OrderCategoryService } from 'src/app/core/services/orderCategory.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css']
})
export class OrderDialogComponent implements OnInit {
  orderForm: FormGroup;
  title = 'Добавяне на заповед';
  orderCategories: OrderCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private orderCategoryService: OrderCategoryService,
  ) {

  }

  ngOnInit(): void {
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
      number: new FormControl('', Validators.required),
      about: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      categories: new FormControl(this.orderCategories, Validators.required),
      categoryId: new FormControl({ value: '', disabled: false }, Validators.required),
      categoryName: new FormControl({ value: '', disabled: false }),
      filePath: new FormControl('', Validators.required),
      file: new FormControl(''),
      buttonCategories: this.fb.array([]),
    });
  }


  onFileChange(event: any) {
    if (event.target.files[0]) {

    }
  }
}
