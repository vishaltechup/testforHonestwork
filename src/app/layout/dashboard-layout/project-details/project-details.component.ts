import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import checkPermissions from "../../../service/user-permission.service";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})

export class ProjectDetailsComponent implements OnInit {
  projectId: any;
  userID: any;
  projectdatail: any;

  TimesheetList: any;
  permissions: any;

  AllTimesheetList: any;
  symbol: any;

  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {

    this.symbol = '$';

    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;

    this.permissions = checkPermissions(userdata.roleName);
    // await Promise.all([
    //   this.projectStatus = JSON.parse(localStorage.getItem('_workerStatus'))
    //   // this.getprojectdatails()
    // ]);
    // this.getprojectdatails()
    await Promise.all([this.GetTimesheetList()]);

  }

  GetTimesheetList() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.gettimesheetthisweekdata + '?projectId=' + this.projectId).toPromise().then((res) => {
      this.TimesheetList = res.dataList;
      this.GetAllTimesheetandPaymentList();
      this.sharedService.hideLoading();
    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  GetAllTimesheetandPaymentList() {
    this.httpCallService.get(AppSettings.GetAllTimesheetandPayment + '?projectId=' + this.projectId).toPromise().then((res) => {
      
      this.AllTimesheetList = res.dataList;
     // this.sharedService.hideLoading();
    }).catch((err) => {
      this.sharedService.hideLoading();
    });
  }

  navigateBack() {
    this.location.back();
  }


}
