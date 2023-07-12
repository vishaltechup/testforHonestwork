import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SharedService } from 'src/app/service/shared.service';
import { ValidatorService } from 'src/app/service/validator.service';
import { ToastrService } from "ngx-toastr";
import { AuthService } from 'src/app/service/auth.service';
import { AppSettings } from 'src/app/config/app.config';
import { LoginService } from 'src/app/service/login.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;

  public loginForm: FormGroup;
  public FrgPwd: FormGroup;
  public fireloginForm: FormGroup;

  public returnUrl: any;
  passwordType = false;
  token: any;
  public loginSubmitted = false;
  public showPassword: Boolean = false;
  submitAttempt: boolean = false;
  authToken: any;
  userId: any;
  ref = firebase.database().ref('users/');

  constructor(
    public auth: AuthenticationService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loginService: LoginService,
    private userManagementService: UserManagementService,
    private router: Router,
    public Sharedservice: SharedService, public route: ActivatedRoute
  ) {
    this.token = localStorage.getItem(AppSettings.localStorage_keys.token);
  }

  ngOnInit(): void {
    this.authToken = this.route.snapshot.params["id"];
    this.loginForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      password: [null, [Validators.required, ValidatorService.passwordValidator]],
    });
    this.FrgPwd = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
    });

    this.fireloginForm = this.formBuilder.group({
      nickname: [null, Validators.required]
    });
    if (this.authToken != null) {
      this.loginService.agencyDetailsByVerificationCode(this.authToken).subscribe((data: any) => {
        console.log(data);
        this.userId = data.data.userId;
        this.loginForm.patchValue({
          emailId: data.data.agencyEmailId,
        })
      })
    }

  }

  public onSubmitLogin() {
    this.loginSubmitted = true;
    if (this.loginForm.valid) {
      const data = {
        "emailId": this.loginForm.value.emailId,
        "password": this.loginForm.value.password
      }
      this.Sharedservice.showLoading();
      this.loginService.loginUser(data).subscribe((res: any) => {
        if (res) {
          this.Sharedservice.hideLoading();
          this.toastr.success("Login Successfully")
          this.token = res.data.accessToken;

          localStorage.setItem(AppSettings.localStorage_keys.token, this.token);
          this.userManagementService.setUserData(res.data);

          this.fireloginForm.patchValue({
            nickname: res.data.userName,
          });

          this.firbaseLogin(this.fireloginForm.value);

          if (res.data.roleName == "Worker" || res.data.roleName == "Client") {
            this.router.navigate(['w/dashboard']);
          }
          else {
            this.router.navigate(['/dashboard']);
          }

        }
      }, (err) => {
        this.Sharedservice.hideLoading();
        this.toastr.error(
          err.error.message)
      })
    }
  }

  togglePasswordFieldTypes() {
    this.passwordType = !this.passwordType;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    const input = document.getElementById("exampleInputPassword1")
    if (this.showPassword) {
      input.setAttribute('type', 'text');
    } else {
      input.setAttribute('type', 'password');
    }
  }

  sendMail() {
    this.submitAttempt = true;
    if (this.FrgPwd.valid) {
      const data = {
        "toEmail": this.FrgPwd.value.emailid,
        "actionType": "ForgotPassWordOTP",
        "value": ""
      }
      this.Sharedservice.showLoading();
      this.loginService.forgotPasswordrequest(data).subscribe((res: any) => {
        this.Sharedservice.hideLoading();
        debugger;
        if (res.status==1) {
          this.toastr.success(res.message);
          this.htmlAddModal.hide();
          this.FrgPwd.reset();
          this.submitAttempt = false;
        }
        else{
          this.toastr.error(res.message);
          this.htmlAddModal.hide();
          this.FrgPwd.reset();
          this.submitAttempt = false;
        }
      }, (err) => {
        this.toastr.error(err.error.message);
      })
    }
    else {
      //this.toastr.error("Please enter valid email")
    }
  }
  openModal() {
    this.FrgPwd.reset();
    this.submitAttempt = false;
  }
  firbaseLogin(form: any) {
    const login = form;

    this.ref.orderByChild('nickname').equalTo(login.nickname).once('value', snapshot => {
      if (snapshot.exists()) {
        localStorage.setItem('nickname', login.nickname);
      } else {
        const newUser = firebase.database().ref('users/').push();
        newUser.set(login);
        localStorage.setItem('nickname', login.nickname);
      }
    });
  }


}
