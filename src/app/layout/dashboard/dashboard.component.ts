import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCallService } from "../../service/http-call.service";
import { SharedService } from "../../service/shared.service";
import { AppSettings } from "../../config/app.config";
import { PagerService } from '../../service/pager.service';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from "jquery";
import checkPermissions from 'src/app/service/user-permission.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { from } from 'rxjs';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  public projectForm: FormGroup;
  public searchForm: FormGroup;
  roomForm: FormGroup;

  projectList = [];
  milestonelist = [];
  workersList = [];
  selectedItems = [];
  dropdownSettings = {};

  rdobutton: boolean = false;
  submitAttempt: boolean = false;

  //Dashboard project list pagination properties
  pagedItems: any[];
  MypageNumber: number;
  pager: any = {};
  permissions: any;
  userID: any;
  agencyId: any;
  CurrencyList: any;

  noofOpenProject: any = 0;
  totalAmountsReceivable: any;
  totalAmountsOwed: any;
  profilt: any;

  ref = firebase.database().ref('rooms/');
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  nickname = '';
  milestone: FormArray;
  minDate: string;
  constructor(public sharedService: SharedService, public httpCallService: HttpCallService, private pagerService: PagerService, private router: Router,
    private toastr: ToastrService, private useManagementService: UserManagementService,
    private formBuilder: FormBuilder, public datepipe: DatePipe) {

    this.nickname = localStorage.getItem('nickname');
    firebase.database().ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
    });
    // this.openModal();
  }

  ngOnInit(): void {
    this.rdobutton = false;

    this.GetDrpCurrency();
    this.noofOpenProject = 0;
    this.totalAmountsReceivable = "";
    this.totalAmountsOwed = "";
    this.profilt = "";

    this.searchForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.projectForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      estimatedCompletionDate: ['', Validators.required],
      assignWorker: [''],
      rateType: ['H', Validators.required],
      hourlyRate: ['', Validators.required],
      inviteClient: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      currencyId: ['', Validators.required],
      milestone: this.formBuilder.array([this.createItem()])
    });
    this.GetMileston('1');
    (this.projectForm.controls['milestone'] as FormArray).clear();
    // this.milestonelist.pus h({ milestone: '', amount: 0 });

    const userdata = this.useManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.permissions = checkPermissions(userdata.roleName);

    this.roomForm = this.formBuilder.group({
      'roomname': [null, Validators.required]
    });
  }

  redirectTo() {
    this.router.navigateByUrl("/dashboard/project")
  }
  createItem(): FormGroup {
    return this.formBuilder.group(
      {
        milestone: ['', Validators.required],
        amount: [0, Validators.required]
      }
    );
  }

  add() {
    this.milestone = this.projectForm.get('milestone') as FormArray;
    this.milestone.push(this.createItem());
    // this.milestonelist.push({ milestone: '', amount: 0 });
  }

  remove(index) {
    this.milestone.removeAt(index);
    // this.milestonelist.splice(index, 1);
  }

  getProjectList(pageNo) {

    this.sharedService.showLoading();

    const formValues = this.searchForm.value;
    const startDate = formValues.startDate;
    const endDate = formValues.endDate;

    this.httpCallService.get(AppSettings.getProjectList + '?Page=' + pageNo + '&startDate=' + startDate + '&endDate=' + endDate).subscribe((data: any) => {

      this.MypageNumber = data.data.paginationDetails?.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails?.totalCount, this.MypageNumber);
      this.projectList = data.data.resultList;

      this.GetDashboardStatistics();

      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  GetDashboardStatistics() {
    this.sharedService.showLoading();

    const callurl = AppSettings.getdashboardstatistics + "?userId=" + this.userID + "&userType=Agency";
    this.httpCallService.get(callurl).toPromise().then((res) => {
      this.sharedService.hideLoading();
      if (res.data != null) {
        this.noofOpenProject = res.data.noofOpenProject !== null && res.data.noofOpenProject !== undefined && res.data.noofOpenProject !== '' ? res.data.noofOpenProject : 0;
        this.totalAmountsReceivable = res.data.totalAmountsReceivable;
        this.totalAmountsOwed = res.data.totalAmountsOwed;
        this.profilt = res.data.profilt;
      }
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
    this.sharedService.hideLoading();
  }

  onItemSelect(item: any) {

  }
  onSelectAll(items: any) {

  }

  //Get Milestone Div
  GetMileston(value) {

    if (value == "1") {
      this.rdobutton = true;
      this.projectForm.get('hourlyRate').setValidators([Validators.required]);
      (this.projectForm.controls['milestone'] as FormArray).clear();
      this.projectForm.get('hourlyRate').updateValueAndValidity();
    }
    else {
      this.milestone = this.projectForm.get('milestone') as FormArray;
      this.milestone.push(this.createItem());
      this.projectForm.get('hourlyRate').clearValidators();
      this.projectForm.get('hourlyRate').updateValueAndValidity();
      this.rdobutton = false;
    }
  }
  openModal() {
    this.GetMileston('1');
    this.projectForm.get('rateType').setValue('H');
    this.minDate = moment(new Date()).format('YYYY-MM-DD');
    this.projectForm.reset();
    this.submitAttempt = false;
  }
  //Add Project
  public AddProject() {

    this.submitAttempt = true;
    const formValues = this.projectForm.value;
    console.log(this.projectForm.controls)
    console.log(formValues)
    if (this.projectForm.valid) {
      // if ((formValues.rateType == "H") && (formValues.hourlyRate == "" || formValues.hourlyRate == null || formValues.hourlyRate == undefined)) {
      //   return this.projectForm.controls.hourlyRate.setErrors({ 'required': true });
      // } else if (formValues.rateType === 'F') {
      //   this.projectForm.get('hourlyRate').clearValidators();
      //   this.projectForm.get('hourlyRate').updateValueAndValidity();
      // }
      // //Fix Rate set Milestone
      // if (formValues.rateType == "F") {
      //   this.projectForm.get('hourlyRate').clearValidators();
      //   this.projectForm.get('hourlyRate').updateValueAndValidity();
      //   if (this.milestonelist.length > 0) {
      //     for (let j = 0; j < this.milestonelist.length; j++) {
      //       this.milestonelist[j].milestone = $("#milestone" + j).val();
      //       this.milestonelist[j].amount = $("#amount" + j).val();
      //     }
      //   }
      //   else {
      //     return this.projectForm.controls.milestonelist.setErrors({ 'required': true });
      //   }
      // }
      // else {
      //   //Check Houverly Rate null or empty
      //   if (this.projectForm.value.hourlyRate == "" || this.projectForm.value.hourlyRate == null || this.projectForm.value.hourlyRate == undefined) {
      //     this.toastr.error("Please enter hourly Rate!!!");
      //     return false;
      //   }
      // }

      // //Assign Worker
      // if (this.selectedItems.length > 0) {
      //   for (let i = 0; i < this.selectedItems.length; i++) {
      //     if (i == 0) {
      //       formValues.assignWorker = this.selectedItems[i].id;
      //     }
      //     else {
      //       formValues.assignWorker += "," + this.selectedItems[i].id;
      //     }
      //   }
      // }
      // else {
      //   this.toastr.error("Please assign at least one worker!!!");
      //   return false;
      // }
      console.log(this.milestone)
      const milestoneArray = [];
      this.milestone?.value.map(ele => {
        const json = {};
        json['milestone'] = ele.milestone;
        json['Amount'] = ele.amount;
        milestoneArray.push(json);
      })
      const workerArray = [];
      formValues.assignWorker?.map(s => {
        workerArray.push(s.id)
      }
      )
      var project = {
        "projectName": this.projectForm.value.projectName,
        "estimatedCompletionDate": this.projectForm.value.estimatedCompletionDate,
        "rateType": this.projectForm.value.rateType,
        "agencyId": parseInt(this.agencyId),
        "currencyId": parseInt(this.projectForm.value.currencyId),
      };

      var data = {
        "project": project,
        "inviteClients": this.projectForm.value.inviteClient,
        "assignWorkers": workerArray.toString(),
        "LstMileStrone": milestoneArray,
        "hourlyRate": this.projectForm.value.hourlyRate,
      }
      console.log(data);
      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.insertProjectDetails, data).subscribe((data: any) => {
        this.sharedService.hideLoading();
        this.submitAttempt = false;
        this.htmlAddModal.hide();

        if (data.status == 1) {

          this.toastr.success("Project Created Successfully");
          this.projectForm.reset();
          this.getProjectList(1);
        }
        else {
          this.toastr.success(data.message);
        }
      },
        (error: any) => {
          this.sharedService.hideLoading();
          this.toastr.error(error)
        });
    }
  }

  getDropDownworkers() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getdrpworkerdetail).toPromise().then((res) => {

      this.workersList = res.dataList;
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
      this.getProjectList(1);
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
    this.sharedService.hideLoading();
  }

  Addroom(projectName, Id) {
    console.log('dddddddddddddddd')
    //Add room 
    this.roomForm.patchValue({
      'roomname': projectName,
    });

    const room = this.roomForm.value;

    this.ref.orderByChild('roomname').equalTo(this.roomForm.value.roomname).once('value', (snapshot: any) => {
      console.log('sssss', snapshot)
      this.getprojectdatails(Id);
      setTimeout(() => {
        if (snapshot.exists()) {
          console.log('iffffffffffffffffffffffffffffffff')
          localStorage.setItem('roomname', room.roomname);
          localStorage.setItem('projectId', Id);
          this.enterChatRoom(projectName);
          this.router.navigate(['/project/details', Id]);
        } else {
          console.log('elseeeeeeeeeeeee')
          const newRoom = firebase.database().ref('rooms/').push();
          newRoom.set(room);
          localStorage.setItem('roomname', room.roomname);
          localStorage.setItem('projectId', Id);
          this.enterChatRoom(projectName);
          this.router.navigate(['/project/details', Id]);
        }
      }, 1500)

    });
  }
  getprojectdatails(Id) {
    // this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectdatails + '?projectId=' + Id).subscribe(async (data: any) => {
      // this.sharedService.hideLoading();
      localStorage.setItem('_workerStatus', JSON.stringify(data.data))
      // this.projectStatus = data.data.projectStatus;

      // await this.getprojectsatatics();
    },
      (error: any) => {
        // this.sharedService.hideLoading();
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

  GetDrpCurrency() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.GetDrpCurrency).toPromise().then((res) => {
      //this.sharedService.hideLoading();
      this.CurrencyList = res.dataList;
      this.getDropDownworkers();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
    this.sharedService.hideLoading();
  }
  getProjectName(project){
    return project.projectName;
  }
}

