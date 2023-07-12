import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/common/directives/must-match.validator';
import { AppSettings } from '../../config/app.config';
import { AuthService } from 'src/app/service/auth.service';
import { LoginService } from 'src/app/service/login.service';
import { SharedService } from 'src/app/service/shared.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import { HttpCallService } from "../../service/http-call.service";
import { ValidatorService } from "../../service/validator.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public changeForm: FormGroup;
  public userData: any;
  public registerSubmitted = false;
  showOldPassword: Boolean = false;
  showNewPassword: Boolean = false;
  showConformPassword: Boolean = false;
  showRegexError;
  passwordStrength;
  passwordRegex;
  errorMsg;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private sharedService: SharedService,
    private authService: AuthService,
    private userManagementService: UserManagementService,
    public httpcallService: HttpCallService,
    public validatorService: ValidatorService,
  ) { }

  ngOnInit(): void {

    this.changeForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
        validator: MustMatch('newPassword', 'confirmPassword')
    }
    );

    [this.passwordRegex, this.errorMsg] =  this.validatorService.createPasswordRule()
  }    

  onnewChangePassword() {
    this.registerSubmitted = true;
    const userdata = this.userManagementService.getCurrentUserData();
    const userId = userdata.userId;
    if (this.changeForm.valid && !this.showRegexError) {
      const data = {
        "oldPassword": this.changeForm.controls.oldPassword.value,
        "newPassword": this.changeForm.controls.newPassword.value,
        "userId": userId
      }
   
      this.sharedService.showLoading();
       
       this.httpcallService.post(AppSettings.Changeyourpassword, data).subscribe((res: any) => {
        if (res.status == 1) {
          this.toastr.success('Reset password link has been sent to your registered E-mail address. Please check your E-mail.');
          this.authService.logout();
          this.sharedService.hideLoading();
          this.router.navigate(['/login']);
        }
        else{
          this.toastr.error(res.message);
          this.sharedService.hideLoading();
        }
      }, (err) => {
        this.sharedService.hideLoading();
      })
    }
  }

  checkPassword() {
    const patt = new RegExp(this.passwordRegex);
    if (!patt.test(this.changeForm.controls.newPassword.value)) {
      this.showRegexError = true;
    } else {
      this.showRegexError = false;
    }
    this.passwordStrength = this.validatorService.checkPasswordStregnth(this.changeForm.controls.newPassword.value); 
  }

  toggleShowOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }
  toggleShowNewPassword() { 
    this.showNewPassword = !this.showNewPassword;
  }
  toggleShowConfirmPassword() {
    this.showConformPassword = !this.showConformPassword;
  }
}
  