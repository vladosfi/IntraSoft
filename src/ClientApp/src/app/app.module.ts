import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/*import { AppRoutingModule } from './app-routing.module';*/

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuItemComponent } from './navigation/menu-item/menu-item.component';
import { RoutingModule } from './routing/routing.module';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './navigation/header/header.component';
import { MaterialModule } from './material/material.module';
import { SidenavListItemComponent } from './navigation/sidenav-list-item/sidenav-list-item.component';
import { AngularMaterialMenuComponent } from './navigation/angular-material-menu/angular-material-menu.component';
import { MenuItemAMComponent } from './navigation/angular-material-menu/menu-item/menu-item.component';
import { MenuComponent } from './admin/components/menu/menu.component';
import { SingleMenuItemComponent } from './admin/components/single-menu-item/single-menu-item.component';
import { DialogComponent } from './components/dialog/dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuItemComponent,
    HeaderComponent,
    SidenavListComponent,
    SidenavListItemComponent,
    AngularMaterialMenuComponent,
    MenuItemAMComponent,
    MenuComponent,
    SingleMenuItemComponent,
    DialogComponent,
  ],
  entryComponents:[
    DialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
