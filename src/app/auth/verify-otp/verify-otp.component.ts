import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MustMatch } from "../../common/directives/must-match.validator";
import { AuthService } from "../../service/auth.service";
import { AppSettings } from "../../config/app.config";
import { SharedService } from 'src/app/service/shared.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import { LoginService } from 'src/app/service/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  public changeForm: FormGroup
 // showOtp: Boolean = false;
  showNewPassword: Boolean = false;
  showConformPassword: Boolean = false;
  public registerSubmitted = false;
  public userData: any;
  submitAttempt: boolean = false;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private sharedService: SharedService,
    private authService: AuthService,
    private userManagementService: UserManagementService
  ) { }

  ngOnInit(): void { 
    this.changeForm = this.formBuilder.group({
      Otp: ['', Validators.required]     
    });
  }

  verifyOtp() {
   
    this.submitAttempt = true;

    if (this.changeForm.valid) {

      const data = {
        "toEmail": "",
        "actionType": "ForgotPassWordOTP",
        "value": this.changeForm.value.Otp
      }  
   
      this.loginService.verifyCodeOTP(data).subscribe((res: any) => {      
        if (res.status==1) {          
          this.toastr.success("OTP Verified Successfully"); 
          this.userManagementService.setForgotID(res.id);      
          this.router.navigate(['/forgot']);   
        }
        else{
          this.toastr.error(res.message); 
        }
      }, (err) => {  
        this.toastr.error(err.error.message);
      });

    }
    else
    {
      this.toastr.error("Please enter valid OTP")
    }

  }

}
     