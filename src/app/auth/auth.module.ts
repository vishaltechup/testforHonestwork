import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { AuthService } from '../service/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { VerificationComponent } from './verification/verification.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Login'
    },
    redirectTo: 'login',
  },
  {
    path: 'login',
    data: {
      title: 'Login'
    },
    component: LoginComponent
  },
  {
    path: 'register',
    data: {
      title: 'Register'
    },
    component: SignupComponent
  },
  {
    path: 'signup/:id',
    data: {
      title: 'Register'
    },
    component: SignupComponent
  },
  {
    path: 'invitation/:id',
    data: {
      title: 'Login'
    },
    component: LoginComponent
  },
  {
    path: 'logout',
    data: {
      title: 'Log out'
    },
    component: LogoutComponent
  },
  {
    path: 'change-password',
    data: {
      title: 'Change Password'
    },
    component: ChangePasswordComponent
  },
  {
    path: 'forgot',
    data: {
      title: 'Forgot Password'
    },
    component: ForgotpasswordComponent
  },
  {
    path: 'verify-otp',
    data: {
      title: 'Verify OTP'
    },
    component: VerifyOtpComponent
  },
  {
    path: 'verification/:id',
    data: {
      title: 'Verification'
    },
    component: VerificationComponent
  }
]

@NgModule({
  declarations: [LoginComponent, SignupComponent, LogoutComponent, ChangePasswordComponent, ForgotpasswordComponent, VerifyOtpComponent, VerificationComponent],
  imports: [
    CommonModule,
    ModalModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxMaskModule.forRoot(maskConfig),
  ],
  exports: [LoginComponent, SignupComponent],
  providers: [AuthenticationService, AuthService]
})
export class AuthModule { }
