import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MustMatch } from "../../common/directives/must-match.validator";
import { AuthService } from "../../service/auth.service";
import { AppSettings } from "../../config/app.config";
import { SharedService } from 'src/app/service/shared.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpCallService } from '../../service/http-call.service';
import { ValidatorService } from "../../service/validator.service";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  public changeForm: FormGroup
  // showOtp: Boolean = false;
  showNewPassword: Boolean = false;
  showConformPassword: Boolean = false;
  public registerSubmitted = false;
  public userData: any;
  submitAttempt: boolean = false;
  showRegexError;
  passwordStrength;
  passwordRegex;
  errorMsg;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public httpCallService: HttpCallService,
    private sharedService: SharedService,
    private authService: AuthService,
    private userManagementService: UserManagementService,
    public validatorService: ValidatorService,
  ) { } 

  ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      }
    );
    [this.passwordRegex, this.errorMsg] =  this.validatorService.createPasswordRule()
  }

  setNewPassword() {
    this.registerSubmitted = true;
    
    if (this.changeForm.valid) {
      const forgotdata = this.userManagementService.getForgotID();
    
      const data = {
        "password": this.changeForm.controls.newPassword.value,
        "userId": forgotdata
      }
      const callurl= AppSettings.forgotPassword+'?userId='+forgotdata+'&password='+this.changeForm.controls.newPassword.value;
      this.httpCallService.post(callurl,null).subscribe((res: any) => {
        if (res.status == 1) {
          this.toastr.success("Password Updated Successfully");
          localStorage.removeItem(AppSettings.localStorage_keys.forgotData);
          this.router.navigate(['/login']);
        }
        else{
          this.toastr.error(res.message);
        }
      }, (err) => {
        this.toastr.error(
          err.error.message)
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


  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowConfirmPassword() {
    this.showConformPassword = !this.showConformPassword;
  }

}
