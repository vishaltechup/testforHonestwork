import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../service/http-call.service";
import { SharedService } from "../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import checkPermissions from "../../service/user-permission.service";
import { PagerService } from "../../service/pager.service";
import * as firebase from 'firebase';
export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
@Component({
  selector: 'app-worker-activity',
  templateUrl: './worker-activity.component.html',
  styleUrls: ['./worker-activity.component.scss']
})
export class WorkerActivityComponent implements OnInit {

  workerId: any;
  WeekData: any;
  projectName: any;
  WorkerActivity: any;
  OpenApplicationList: any;
  WorkerActivities: any;
  CurrentDate: Date;
  PrevDate: Date;
  NextDate: Date;
  permissions: any;
  projectList = [];

  //pager object
  pagedItems: any[];
  MypageNumber: number;
  pager: any = {};
  roomForm: FormGroup;
  ref = firebase.database().ref('rooms/');
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  nickname = '';
  originalImage: any;

  constructor(private route: ActivatedRoute,
    private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private pagerService: PagerService, private router: Router) {
    firebase.database().ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
    });
  }

  ngOnInit(): void {

    this.CurrentDate = new Date();
    this.PrevDate = new Date();
    this.PrevDate.setDate(this.PrevDate.getDate() - 1);

    this.NextDate = null;
    const userdata = this.UserManagementService.getCurrentUserData();
    this.workerId = userdata.workerId;
    this.getTodayProjectWorkerActivity();
    this.getProjectList(1);
    this.permissions = checkPermissions(userdata.roleName);
    this.roomForm = this.formBuilder.group({
      'roomname': [null, Validators.required]
    });
  }

  getTodayProjectWorkerActivity() {

    this.sharedService.showLoading();

    var data =
    {
      "workerId": this.workerId,
      "operatingSystem": 'Microsoft Windows',
      "curruntTime": this.CurrentDate,
    }

    this.httpCallService.post(AppSettings.getdatewiseworkeractivty, data).subscribe((data: any) => {

      this.sharedService.hideLoading();
      this.OpenApplicationList = data.data.openApplication;
      this.WorkerActivities = data.data.todayWorkerActivities;

     
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  PrevgetTodayProjectWorkerActivity(newdate) {

    this.sharedService.showLoading();
    let date: Date = new Date();
    this.CurrentDate = new Date(newdate);

    let prevDate: Date = new Date(newdate);
    this.PrevDate.setDate(prevDate.getDate() - 1);

    if (date > this.CurrentDate) {
      let nextDate: Date = new Date(newdate);
      this.NextDate = nextDate;
      this.NextDate.setDate(nextDate.getDate() + 2);
    }
    else {
      this.NextDate = null;
    }

    var data =
    {
      "workerId": this.workerId,
      "operatingSystem": 'Microsoft Windows',
      "curruntTime": this.CurrentDate,
    }

    this.httpCallService.post(AppSettings.getdatewiseworkeractivty, data).subscribe((data: any) => {

      this.sharedService.hideLoading();
      this.OpenApplicationList = data.data.openApplication;
      this.WorkerActivities = data.data.todayWorkerActivities;

     
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  NextgetTodayProjectWorkerActivity(newdate) {

    this.sharedService.showLoading();
    let date: Date = new Date();

    this.CurrentDate = new Date(newdate);
    let prevDate: Date = new Date(newdate);
    this.PrevDate.setDate(prevDate.getDate() - 1);

    if (date.getDate() > this.CurrentDate.getDate() && (date.getMonth() + 1) == (this.CurrentDate.getMonth() + 1) && date.getFullYear() == this.CurrentDate.getFullYear()) {
      let nextDate: Date = new Date(newdate);
      this.NextDate = nextDate;
      this.NextDate.setDate(nextDate.getDate() + 1);
    }
    else {
      this.NextDate = null;
    }

    var data =
    {
      "workerId": this.workerId,
      "operatingSystem": 'Microsoft Windows',
      "curruntTime": this.CurrentDate,
    }

    this.httpCallService.post(AppSettings.getdatewiseworkeractivty, data).subscribe((data: any) => {

      this.sharedService.hideLoading();
      this.OpenApplicationList = data.data.openApplication;
      this.WorkerActivities = data.data.todayWorkerActivities;

     
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  getProjectList(pageNo) {

    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getProjectList + '?Page=' + pageNo).subscribe((data: any) => {
     

      this.MypageNumber = data.data.paginationDetails.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.projectList = data.data.resultList;
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  Addroom(projectName, Id) {
    //Add room 
    this.roomForm.patchValue({
      'roomname': projectName,
    });

    const room = this.roomForm.value;

    this.ref.orderByChild('roomname').equalTo(this.roomForm.value.roomname).once('value', (snapshot: any) => {
      if (snapshot.exists()) {
        localStorage.setItem('roomname', room.roomname);
        localStorage.setItem('projectId', Id);
        this.enterChatRoom(projectName);
        this.router.navigate(['/project/note', Id]);

      } else {
        const newRoom = firebase.database().ref('rooms/').push();
        newRoom.set(room);
        localStorage.setItem('roomname', room.roomname);
        localStorage.setItem('projectId', Id);
        this.enterChatRoom(projectName);
        this.router.navigate(['/project/note', Id]);
      }

    });
  }

  enterChatRoom(roomname: string) {

    // const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    // chat.roomname = roomname;
    // chat.nickname = this.nickname;
    // chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    // chat.message = `${this.nickname} enter the room`;
    // chat.type = 'join';
    // const newMessage = firebase.database().ref('chats/').push();
    // newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('roomusers/' + user.key);
        userRef.update({ status: 'online' });
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        const newRoomUser = firebase.database().ref('roomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });
  }
  openOriginalImage(screenShot) {
    this.originalImage = screenShot.originalScreenshotPath;
  }
}
