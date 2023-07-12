import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../service/http-call.service";
import { SharedService } from "../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
@Component({
  selector: 'app-today-activity',
  templateUrl: './today-activity.component.html',
  styleUrls: ['./today-activity.component.scss']
})
export class TodayActivityComponent implements OnInit {
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  projectId: any;
  workerid: any;
  WeekData: any;
  projectName: any;
  WorkerActivity: any;
  OpenApplicationList: any;
  ScreenShotKeyBoardMouseClickList: any;
  CurrentDate: any;
  originalImage: any;
  weekFirstDate: any;
  weekLastDate: any;
  checkweekFirstDate: any;
  checkweekLastDate: any;
  prevCount = 0;
  nextCount = 0;
  showNextBtnFlag: boolean = false;
  selectedDate: any;
  activeDate: any;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.productid || null;
    this.workerid = this.route.snapshot.params.workerid || null;
  }

  async ngOnInit() {

    let currentDate = moment();
    let weekStart = currentDate.clone().startOf('week').add(1, 'day');
    let weekEnd = currentDate.clone().endOf('week');
    this.weekFirstDate = weekStart.format('MM-DD-YYYY');
    this.weekLastDate = weekEnd.format('MM-DD-YYYY');
    this.checkweekFirstDate = weekStart.format('MM-DD-YYYY');
    this.checkweekLastDate = weekEnd.format('MM-DD-YYYY');
    this.projectName = '';
    let date: Date = new Date();
    this.CurrentDate = date;
    this.activeDate = moment(this.CurrentDate).format('YYYY-MM-DD')+'T00:00:00'
    this.selectedDate = moment(Date.now()).format("MM-DD-YYYY");

    await Promise.all([
      this.getprojectdatails()
    ]);
  }

  gettodaydatewiseappandscreen() {

    //this.sharedService.showLoading();

    var data =
    {
      "projectId": this.projectId,
      "workerId": this.workerid,
      "operatingSystem": 'Microsoft Windows',
      "SelectedDate": this.selectedDate,
    }

    this.httpCallService.post(AppSettings.gettodaydatewiseappandscreen, data).subscribe((data: any) => {

      this.sharedService.hideLoading();
      this.OpenApplicationList = data.data.openApplication;
      this.ScreenShotKeyBoardMouseClickList = data.data.todayWorkerActivities;
     
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  async getprojectdatails() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectdatails + '?projectId=' + this.projectId).subscribe(async (data: any) => {
      //this.sharedService.hideLoading();

      this.projectName = data.data.projectName;
      localStorage.setItem('_workerStatus', JSON.stringify(data.data))
      await this.getworkersweekenddata();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  getworkersweekenddata() {
    // debugger;
    //this.sharedService.showLoading();

    var data =
    {
      "projectId": this.projectId,
      "workerId": this.workerid,
      "operatingSystem": 'Microsoft Windows',
      "StartDate": this.weekFirstDate,
      "EndDate": this.weekLastDate,
    }

    this.httpCallService.post(AppSettings.getworkersweekenddata, data).subscribe((data: any) => {
      //this.sharedService.hideLoading();
      this.WeekData = data.data;
     
      this.gettodaydatewiseappandscreen();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  // getTimesheetThisWeekData(){
  //   debugger;
  //   this.sharedService.showLoading();
  //   this.httpCallService.get(AppSettings.gettimesheetthisweekdata + '?projectId=' + this.projectId).subscribe((data: any) => {
  //     debugger;
  //     this.sharedService.hideLoading();
  //     //this.thisWeekData = data.dataList;     
  //   },
  //   (error : any) => {
  //     this.sharedService.hideLoading();
  //   });
  // } 


  openOriginalImage(screenShot) {
    this.originalImage = screenShot.originalScreenshotPath;
  }
  moveToPreviousWeek() {
    this.prevCount = this.prevCount + 1;
    let currentDate = moment();
    let subtractDate = moment(this.weekFirstDate).subtract(1, 'week');
    let weekStart = subtractDate.clone().startOf('week').add(1, 'day');
    let weekEnd = subtractDate.clone().endOf('week');
    this.weekFirstDate = weekStart.format('MM-DD-YYYY');
    this.weekLastDate = weekEnd.format('MM-DD-YYYY');
    this.getworkersweekenddata();
    this.showNextBtnFlag = true;
    if (this.weekLastDate === this.checkweekLastDate && this.weekFirstDate === this.checkweekFirstDate) {
      this.showNextBtnFlag = false;
    }
  }
  moveToNextWeek() {
    this.prevCount = 0
    this.nextCount = this.nextCount + 1;
    let currentDate = moment();
    let subtractDate = moment(this.weekFirstDate).add(1, 'week');
    let weekStart = subtractDate.clone().startOf('week').add(1, 'day');
    let weekEnd = subtractDate.clone().endOf('week');
    this.weekFirstDate = weekStart.format('MM-DD-YYYY');
    this.weekLastDate = weekEnd.format('MM-DD-YYYY');
    this.getworkersweekenddata();
    this.showNextBtnFlag = true;
    if ((this.weekLastDate === this.checkweekLastDate && this.weekFirstDate === this.checkweekFirstDate) || (this.weekLastDate > this.checkweekLastDate && this.weekFirstDate > this.checkweekFirstDate)) {
      this.showNextBtnFlag = false;
    }
  }

  showDateWiseData(date) {
   
    this.activeDate = date;
    this.selectedDate = moment(date).format('MM-DD-YYYY');
    this.CurrentDate = new Date(date);
    this.gettodaydatewiseappand();
  }

  gettodaydatewiseappand() {

    this.sharedService.showLoading();

    var data =
    {
      "projectId": this.projectId,
      "workerId": this.workerid,
      "operatingSystem": 'Microsoft Windows',
      "SelectedDate": this.selectedDate,
    }

    this.httpCallService.post(AppSettings.gettodaydatewiseappandscreen, data).subscribe((data: any) => {

      this.sharedService.hideLoading();
      this.OpenApplicationList = data.data.openApplication;
      this.ScreenShotKeyBoardMouseClickList = data.data.todayWorkerActivities;
      // this.getworkersweekenddata();

     
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
}

