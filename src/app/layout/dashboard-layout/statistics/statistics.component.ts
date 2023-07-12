import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import checkPermissions from 'src/app/service/user-permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  myVar1: any;
  projectId: any;
  userID: any;
  workerId: any;
  agencyId: any;
  permissions: any;

  TechstackList = [];
  selectedItems = [];
  dropdownSettings = {};
  ScopeDocumentList = [];
  scopeDocumentDetailList = [];

  fileToUpload: File;
  url: string;
  submitAttempt: boolean = false;
  projectdatail: any;
  projectName: any;
  Scopeedit: boolean = false;
  BuildQuoteedit: boolean = false;
  PartnerQuotededit: boolean = false;
  totalAmountsReceivableedit: boolean = false;
  totalAmountsOwededit: boolean = false;

  symbol: any;
  Budget: any;
  EstimatedProfilt: any;
  BudgetActivityLevelPer: any;

  SinceStarthours: any;
  SinceStartPaid: any;
  SinceStartActivityLevelPer: any;

  ThisWeekhours: any;
  ThisWeekhourslimit: any;
  ThisWeekActivityLevelPer: any;

  LastWokedhours: any;
  LastWoked: any;
  LastWokedActivityLevelPer: any;

  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService) {

  }

  async ngOnInit() {

    this.projectName = '';
    this.symbol = '';
    this.Budget = '';
    this.EstimatedProfilt = '';
    this.BudgetActivityLevelPer = '';

    this.SinceStarthours = '';
    this.SinceStartPaid = '';
    this.SinceStartActivityLevelPer = '';

    this.ThisWeekhours = '';
    this.ThisWeekhourslimit = '';
    this.ThisWeekActivityLevelPer = '';

    this.LastWokedhours = '';
    this.LastWoked = '';
    this.LastWokedActivityLevelPer = '';
    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.workerId = userdata.workerId;
    this.agencyId = userdata.agencyId;
    this.Scopeedit = false;
    this.BuildQuoteedit = false;
    this.PartnerQuotededit = false;
    this.totalAmountsReceivableedit = false;
    this.totalAmountsOwededit = false;
    this.permissions = checkPermissions(userdata.roleName);
    this.projectId = localStorage.getItem('projectId') !== null && localStorage.getItem('projectId') !== undefined && localStorage.getItem('projectId') !== '' ? Number(localStorage.getItem('projectId')) : null;

    await Promise.all([
      this.getprojectdatails()
    ]);

  }

  async getprojectdatails() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectdatails + '?projectId=' + this.projectId).subscribe(async (data: any) => {
      this.sharedService.hideLoading();

      this.projectName = data.data.projectName;
      localStorage.setItem('_workerStatus', JSON.stringify(data.data))
      await this.getprojectsatatics();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  async getprojectsatatics() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectsatatics + '?projectId=' + this.projectId).subscribe((data: any) => {
      this.sharedService.hideLoading();

      this.Budget = data.data.budget;

      this.EstimatedProfilt = data.data.estimatedProfilt;
      this.BudgetActivityLevelPer = data.data.budgetActivityLevelPer;

      this.SinceStarthours = data.data.sinceStarthours;
      this.SinceStartPaid = data.data.sinceStartPaid;
      this.SinceStartActivityLevelPer = data.data.sinceStartActivityLevelPer;

      this.ThisWeekhours = data.data.thisWeekhours;
      this.ThisWeekhourslimit = data.data.thisWeekhourslimit;
      this.ThisWeekActivityLevelPer = data.data.thisWeekActivityLevelPer;

      this.LastWokedhours = data.data.lastWokedhours
      this.LastWoked = data.data.lastWoked
      this.LastWokedActivityLevelPer = data.data.lastWokedActivityLevelPer;



    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  navigateBack() {
    this.location.back()
  }
}
