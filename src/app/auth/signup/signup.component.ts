import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/service/login.service';
import { MustMatch } from 'src/app/common/directives/must-match.validator';
import { SharedService } from 'src/app/service/shared.service';
import { ValidatorService } from "../../service/validator.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public registerForm: FormGroup;
  passwordType = false;
  public registerSubmitted = false;
  showRegexError;
  passwordStrength;
  passwordRegex;
  errorMsg;
  authToken: any;
  userId: any;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toaster: ToastrService,
    public SharedService: SharedService,
    public validatorService: ValidatorService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authToken = this.route.snapshot.params["id"];
    this.registerForm = this.formBuilder.group({
      agencyName: [null, [Validators.required]],
      emailId: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      mobileNo: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
    [this.passwordRegex, this.errorMsg] = this.validatorService.createPasswordRule()
    if (this.authToken != null) {
      this.loginService.agencyDetailsByVerificationCode(this.authToken).subscribe((data: any) => {
        console.log(data);
        this.userId = data.data.userId;
        this.registerForm.patchValue({
          agencyName: data.data.agencyName,
          emailId: data.data.agencyEmailId,
        })
      })
    }
  }
  public onSubmitRegister() {
    console.log(this.authToken)
    this.registerSubmitted = true;
    if (this.registerForm.valid) {
      if (this.authToken !== null && this.authToken !== undefined && this.authToken !== '') {
        const data = {
          "agencyName": this.registerForm.value.agencyName,
          "password": this.registerForm.value.password,
          "mobileNo": this.registerForm.value.mobileNo,
          "userId": this.userId,
        }
        this.SharedService.showLoading();
        this.loginService.signupWithVerificationCode(data).subscribe((res: any) => {
          this.SharedService.hideLoading();
          if (res) {
            if (res.id == "-1" && res.message == "Please enter unique email address.") {
              this.toaster.error(res.message);
              return false;
            }
            this.registerSubmitted = false;
            this.toaster.success(res.message);
            this.router.navigate(['login']);
          }
        }, (err) => {
          this.toaster.error(err.error.message);
          this.registerSubmitted = false;
        }
        )
      } else {
        const data = {
          "agencyName": this.registerForm.value.agencyName,
          "agencyEmailId": this.registerForm.value.emailId,
          "password": this.registerForm.value.password,
          "contactNo": this.registerForm.value.mobileNo,
          "agencyType": "M",
          "workingday": 6,
        }
        this.SharedService.showLoading();
        this.loginService.registerUser(data).subscribe((res: any) => {
          this.SharedService.hideLoading();
          if (res) {
            if (res.id == "-1" && res.message == "Please enter unique email address.") {
              this.toaster.error(res.message);
              return false;
            }
            this.registerSubmitted = false;
            this.toaster.success(res.message);
            this.router.navigate(['login']);
          }
        }, (err) => {
          this.toaster.error(err.error.message);
          this.registerSubmitted = false;
        }
        )
      }
    }
  }

  checkPassword() {
    const patt = new RegExp(this.passwordRegex);
    if (!patt.test(this.registerForm.controls.password.value)) {
      this.showRegexError = true;
    } else {
      this.showRegexError = false;
    }
    this.passwordStrength = this.validatorService.checkPasswordStregnth(this.registerForm.controls.password.value);
  }

  togglePasswordFieldTypes() {
    this.passwordType = !this.passwordType;
  }

}
