import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { HttpCallService } from '../../service/http-call.service';
import { SharedService } from '../../service/shared.service';
import { ToastrService } from "ngx-toastr";
import { AppSettings } from 'src/app/config/app.config';
import { ThrowStmt } from '@angular/compiler';
import { error } from 'selenium-webdriver';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-account',
  templateUrl: './client-account.component.html',
  styleUrls: ['./client-account.component.scss']
})
export class ClientAccountComponent implements OnInit {

  public accountForm: FormGroup;
  submitAttempt: boolean = false;
  workerDetail: any;
  userId: any;
  fileToUpload: File;
  url: string;

  skillList = [];
  selectedItems = [];
  dropdownSettings = {};

  projectList = [];
  selectedItems1 = [];
  dropdownSettings1 = {};

  hourlyRatesList = [];

  constructor(public sharedService: SharedService,
    public httpCallService: HttpCallService,private formBuilder: FormBuilder,
    private toaster: ToastrService, private userManagementService: UserManagementService) { }

    async  ngOnInit() {

    this.accountForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', Validators.required],
      mobileNo: ['', Validators.required],      
    });
    this.url = "../../../assets/img/profile.svg";  
     this.getWorkerDetails();
  }
  getWorkerDetails() {

    this.sharedService.showLoading();
    const currentUser = this.userManagementService.getCurrentUserData();
    this.userId = currentUser.userId;
    const callurl = AppSettings.getworkerdetailsbyid + '?workerId=' + this.userId;
    this.httpCallService.get(callurl)
      .subscribe((data: any) => {
        this.sharedService.hideLoading();

        this.workerDetail=data.data;

       

        this.selectedItems = data.data.skills;       
        this.selectedItems1 = data.data.assignProjects;;

        this.accountForm.patchValue({
          firstName: this.workerDetail?.firstName,
          lastName: this.workerDetail?.lastName,
          emailId: this.workerDetail?.emailId,
          mobileNo: this.workerDetail?.mobileNo,
        });

        this.url = this.workerDetail.profileImage;
        
      }, (error: any) => {
        this.sharedService.hideLoading();
      });
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
    
    this.httpCallService.uploaddataFile(AppSettings.UploadProfilePic, this.fileToUpload,currentUser.userId).subscribe((data: any) => {
      this.sharedService.hideLoading();      
    },
    (error: any) => {
        this.sharedService.hideLoading();       
     });
    
  }

}

