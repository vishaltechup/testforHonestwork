import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { HttpCallService } from '../../service/http-call.service';
import { SharedService } from '../../service/shared.service';
import { ToastrService } from "ngx-toastr";
import { AppSettings } from 'src/app/config/app.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/common/directives/must-match.validator';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ValidatorService } from "../../service/validator.service";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { LoginService } from 'src/app/service/login.service';
@Component({
  selector: 'app-agency-account',
  templateUrl: './agency-account.component.html',
  styleUrls: ['./agency-account.component.scss']
})
export class AgencyAccountComponent implements OnInit {
  public accountForm: FormGroup;
  submitAttempt: boolean = false;
  agencyDetail: any;
  agencyId: any;
  userId: any;
  fileToUpload: File;
  url: string;
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
  constructor(public sharedService: SharedService,
    public httpCallService: HttpCallService, private formBuilder: FormBuilder,
    private toaster: ToastrService, private userManagementService: UserManagementService,
    private toastr: ToastrService,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    public httpcallService: HttpCallService,
    public validatorService: ValidatorService,) { }

  async ngOnInit() {
    const userdata = this.userManagementService.getCurrentUserData();
    this.userId = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.accountForm = this.formBuilder.group({
      agencyType: [''],
      agencyName: ['', Validators.required],
      agencyEmailId: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(11)]],
      password: [''],
      profileImage: [''],
      workingDay: ['', [Validators.required, Validators.max(7), Validators.min(1)]]
    });

    this.url = "../../../assets/img/profile.png";
    this.changeForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      }
    );

    [this.passwordRegex, this.errorMsg] = this.validatorService.createPasswordRule()
    await Promise.all([this.getAgencyDetails()]);
  }


  getAgencyDetails() {

    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.getAgencyDetails + '?id=' + this.userId, null).toPromise().then((res) => {

      this.sharedService.hideLoading();
      this.agencyDetail = res.data;

      this.accountForm.patchValue({
        agencyName: this.agencyDetail?.agencyName,
        agencyEmailId: this.agencyDetail?.agencyEmailId,
        contactNo: this.agencyDetail?.contactNo,
        workingDay: this.agencyDetail?.workingday
      });

      this.url = this.agencyDetail.profileImage;

    }, (error: any) => {

      this.sharedService.hideLoading();
    });
  }

  updateProfile() {
    console.log(this.accountForm)
    this.submitAttempt = true;
    if (this.accountForm.valid) {
      this.sharedService.showLoading();
      const formValues = this.accountForm.value;

      var data = {
        "id": this.agencyId,
        "userId": this.agencyDetail.userId,
        "agencyType": this.agencyDetail.agencyType,
        "agencyName": formValues.agencyName,
        "agencyEmailId": formValues.agencyEmailId,
        "contactNo": formValues.contactNo,
        "workingday": formValues.workingDay,
        "loginId": 0
      }

      this.httpCallService.post(AppSettings.updateagencydetais, data)
        .subscribe((data: any) => {
          this.sharedService.hideLoading();
          if (data.status == 1) {
            this.toaster.success("Profile Updated Successfully.");
          }
          else {
            this.toaster.error(data.message);
          }

        }, (error: any) => {
          this.sharedService.hideLoading();
          this.toaster.error(error.message);
        });
    }
  }


  readUrl(event: any) {
    var Size = event.target.files.item(0);
    if (Size.size <= '1000000') {
      this.fileToUpload = event.target.files.item(0);
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
          this.url = (<FileReader>event.target).result.toString();
        }
        reader.readAsDataURL(event.target.files[0]);
        this.PhotoUpload();
      }
    }
    else {
      //this.toastr.error('Please upload less than 1MB image.', 'Error');
    }
  }

  PhotoUpload() {
    this.sharedService.showLoading();
    const currentUser = this.userManagementService.getCurrentUserData();

    this.httpCallService.uploaddataFile(AppSettings.UploadProfilePic, this.fileToUpload, currentUser.userId).subscribe((data: any) => {
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });

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
        else {
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

