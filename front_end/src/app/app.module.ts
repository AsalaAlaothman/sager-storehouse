import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; // <- HERE
import { LoginComponent } from './auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './layouts/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { HomeModule } from './home/home.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddUserComponent } from './user/add-user/add-user.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { ConfirmationDialogComponent } from './layouts/confirmation-dialog-component/confirmation-dialog-component.component';
import { HomeComponent } from './home/home.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    UserComponent,
    AddUserComponent,
    EditUserComponent,
    CategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    ProductComponent,
    AddProductComponent,
    EditProductComponent,
    UploadImageComponent,
    UploadImageComponent,
    ConfirmationDialogComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    NgChartsModule

  ],

    providers: [AuthService, AuthGuard, UserComponent,CategoryComponent,
    UploadImageComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
