import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';

/*import { AppRoutingModule } from './app-routing.module';*/

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuItemComponent } from './navigation/header/menu-item/menu-item.component';
import { RoutingModule } from './routing/routing.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './navigation/header/header.component';
import { MaterialModule } from './material/material.module';
import { AngularMaterialMenuComponent } from './navigation/angular-material-menu/angular-material-menu.component';
import { MenuItemAMComponent } from './navigation/angular-material-menu/menu-item/menu-item.component';
import { MenuComponent } from './admin/components/menu/menu.component';
import { SingleMenuItemComponent } from './admin/components/single-menu-item/single-menu-item.component';
import { ContactComponent } from './components/contact/contact.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DisableControlDirective } from './core/directives/disable-control.directive';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UploadButtonComponent } from './components/shared/upload-button/upload-button.component';
import { EllipsifyMeDirective } from './core/directives/ellipsify-me.directive';
import { IsoListComponent } from './components/iso-list/iso-list.component';
import { UploadFileWithCategoryComponent } from './components/shared/upload-file-with-category/upload-file-with-category.component';
import { ModalDialogComponent } from './components/dialog/modal/modal-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddFileComponent } from './components/dialog/add-file/add-file.component';
import { DeleteDialogComponent } from './components/dialog/delete/delete-dialog.component';
import { IMaskModule } from 'angular-imask';
import { fullNameValidatorDirective } from './components/validators/full-name-validator.directive';
import { LastItemsComponent } from './components/shared/last-items/last-items.component';
import { LOCALE_ID } from '@angular/core';
import bg from '@angular/common/locales/bg';
import { registerLocaleData } from '@angular/common';
import { OrdersComponent } from './components/orders/orders.component';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderDialogComponent } from './components/orders/order-dialog/order-dialog.component';
import { EmailComponent } from './components/email/email.component';
import { ServerErrorInterceptor } from './server-error.interceptor';
import { GlobalErrorHandler } from './global-error-handler';
import { JL } from 'jsnlog';
import { ErrorLogsComponent } from './components/error-logs/error-logs.component';
import { StateNewspaperComponent } from './components/state-newspaper/state-newspaper.component';
import { StateNewspaperModalDialogComponent } from './components/state-newspaper/state-newspaper/state-newspaper-modal.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SanitizeHtmlPipe } from './core/pipes/sanitizeHtmlPipe';
import { HomeModalDialogComponent } from './components/home/modal/home-modal.component';

registerLocaleData(bg);

// configure the JL logger
var logger = JL();
logger.setOptions({
  'appenders': [
      JL.createAjaxAppender('ajax')
        .setOptions({'url': 'http://localhost:5000/logging'})]
    });


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuItemComponent,
    HeaderComponent,
    AngularMaterialMenuComponent,
    MenuItemAMComponent,
    MenuComponent,
    SingleMenuItemComponent,
    DeleteDialogComponent,
    ModalDialogComponent,
    ContactComponent,
    DisableControlDirective,
    NotFoundComponent,
    UploadButtonComponent,
    UploadFileWithCategoryComponent,
    EllipsifyMeDirective,
    IsoListComponent,
    FooterComponent,
    AddFileComponent,
    fullNameValidatorDirective,
    LastItemsComponent,
    OrdersComponent,
    OrderDialogComponent,
    EmailComponent,
    ErrorLogsComponent,
    StateNewspaperComponent,
    StateNewspaperModalDialogComponent,
    SanitizeHtmlPipe,
    HomeModalDialogComponent,
  ],
  entryComponents: [
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    IMaskModule,
    MatNativeDateModule,
    EditorModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }
    },
    {
      provide: LOCALE_ID, useValue: 'bg-BG'
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: 'JSNLOG', useValue: JL },
    DatePipe,
    SanitizeHtmlPipe,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
