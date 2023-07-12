import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { HttpCallService } from '../../service/http-call.service';
import { SharedService } from '../../service/shared.service';
import { ToastrService } from "ngx-toastr";
import { AppSettings } from 'src/app/config/app.config';
import { ThrowStmt } from '@angular/compiler';
import { error } from 'selenium-webdriver';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-worker-details',
  templateUrl: './worker-details.component.html',
  styleUrls: ['./worker-details.component.scss']
})
export class WorkerDetailsComponent implements OnInit {
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

  workerId:any;
  agencyId: any;
  constructor(private route: ActivatedRoute,public sharedService: SharedService,
    public httpCallService: HttpCallService, private formBuilder: FormBuilder,
    private toaster: ToastrService, private userManagementService: UserManagementService) {
      this.workerId = this.route.snapshot.params.id || null;
     }

  async ngOnInit() {
    const userdata = this.userManagementService.getCurrentUserData();
    this.agencyId = userdata.agencyId;

    this.accountForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      mobileNo: ['', Validators.required],
      experience: ['', Validators.required],
      workerType: ['', Validators.required],
      availability: ['', Validators.required],
      privateHourlyRate: ['', Validators.required],
      publicHourlyRate: ['', Validators.required],
      skills: ['', Validators.required],
      project: [''],
    });
    this.url = "../../../assets/img/profile.png";

    await Promise.all([this.getDropDownSkills()
    ]);

  }

  onItemSelect(item: any) {
   
  }

  onSelectAll(items: any) {
   
  }

  getWorkerDetails() {

    this.sharedService.showLoading();
   
    
    this.httpCallService.get(AppSettings.getworker+'?workerId='+ parseInt(this.workerId))
      .subscribe((data: any) => {
        this.sharedService.hideLoading();
        
        this.workerDetail = data.data;

       
        
        this.selectedItems = data.data.skills;
        this.selectedItems1 = data.data.assignProjects;;

        this.accountForm.patchValue({
          firstName: this.workerDetail?.firstName,
          lastName: this.workerDetail?.lastName,
          emailId: this.workerDetail?.emailId,
          mobileNo: this.workerDetail?.mobileNo,
          experience: this.workerDetail?.experience,
          workerType: this.workerDetail?.workerType,
          availability: this.workerDetail?.availability,
          privateHourlyRate: this.workerDetail?.privateHourlyRate,
          publicHourlyRate: this.workerDetail?.publicHourlyRate,
        });

        this.url = this.workerDetail.profileImage;

      }, (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  updateProfile() {
    
    this.submitAttempt = true;
    if (this.accountForm.valid) {
      this.sharedService.showLoading();
      const formValues = this.accountForm.value;

      for (let i = 0; i < this.selectedItems.length; i++) {
        if (i == 0) {
          formValues.skills = this.selectedItems[i].id;
        }

        else {
          formValues.skills += "," + this.selectedItems[i].id;
        }
      }

      const callurl = AppSettings.updateworkerdetais + '?workerId=' + this.userId;
      var data = {
        "id": this.workerDetail.workerId,
        "agencyId": this.workerDetail.agencyId,
        "userId": this.workerDetail.userId,
        "firstName": formValues.firstName,
        "lastName": formValues.lastName,
        "email": formValues.emailId,
        "profileImage": "",
        "mobileNo": formValues.mobileNo,
        "password": "",
        "workerType": formValues.workerType,
        "availability": formValues.availability,
        "privateHourlyRate": formValues.privateHourlyRate,
        "publicHourlyRate": formValues.publicHourlyRate,
        "experience": formValues.experience,
        "loginId": 0,
        "skillIds": formValues.skills
      }
      this.httpCallService.post(callurl, data)
        .subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.toaster.success(data.message);
        }, (error: any) => {
          this.sharedService.hideLoading();
          this.toaster.error(error.message);
        });
    }
  }

  getDropDownSkills() {
    this.sharedService.showLoading();

    this.httpCallService.get(AppSettings.getDropDownSkillsURL+'?agencyId='+this.agencyId).toPromise().then((res) => {

      this.skillList = res.dataList;
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
      this.getDropDownProjects();
      this.sharedService.hideLoading();
    }).catch((err) => {
     
      this.sharedService.hideLoading();
    });
  }

  getDropDownProjects() {
    this.sharedService.showLoading();

    this.httpCallService.post(AppSettings.getDropDownProjectsURL, null).toPromise().then((res) => {

      this.projectList = res.dataList;
      this.dropdownSettings1 = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
      this.getDropDownHourlyRates();
      this.sharedService.hideLoading();
    }).catch((err) => {
     
      this.sharedService.hideLoading();
    });
  }

  getDropDownHourlyRates() {
    this.sharedService.showLoading();

    this.httpCallService.get(AppSettings.getDropDownHourlyRatesURL).toPromise().then((res) => {
      this.hourlyRatesList = res.dataList;
      this.getWorkerDetails();
      this.sharedService.hideLoading();
    }).catch((err) => {
     
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
 
    this.httpCallService.uploaddataFile(AppSettings.UploadProfilePic, this.fileToUpload, this.workerDetail.userId).subscribe((data: any) => {
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });

  }

}
