import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCallService } from "../../service/http-call.service";
import { SharedService } from "../../service/shared.service";
import { AppSettings } from "../../config/app.config";
import { PagerService } from '../../service/pager.service';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from "jquery";
import checkPermissions from 'src/app/service/user-permission.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { from } from 'rxjs';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss']
})
export class TaskStatusComponent implements OnInit {

  //Modal Called Object
  @ViewChild('htmlModal') public htmlModal: ModalDirective;
  //formdeclaration
  public TaskStatus: FormGroup;
  submitAttempt: boolean = false;

  statusList: any;

  pagedItems: any[];
  MypageNumber: number;
  pager: any = {};
  permissions: any;
  userID: any;
  agencyId: any;
  url: any;
  constructor(public sharedService: SharedService, public httpCallService: HttpCallService, private pagerService: PagerService, private router: Router,
    private toastr: ToastrService, private useManagementService: UserManagementService,
    private formBuilder: FormBuilder, public datepipe: DatePipe) {
  }

  ngOnInit(): void {
    const userdata = this.useManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.permissions = checkPermissions(userdata.roleName);
    this.TaskStatus = this.formBuilder.group({
      statusName: ['', Validators.required],
      agencyId: ['0'],
      loginId: ['0'],
      id: ['0']

    });
    this.GetTaskStatusByAgency(1);
  }


  GetTaskStatusByAgency(pageNo) {

    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getstatusdetail + '?agencyId=' + this.agencyId + '&Page=' + pageNo).subscribe((data: any) => {
      this.sharedService.hideLoading();

      this.MypageNumber = data.data.paginationDetails.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.statusList = data.data.resultList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddTaskStatus() {
    this.submitAttempt = true;
    if (this.TaskStatus.valid) {
      var data = {
        "agencyId": this.agencyId,
        "loginId": this.userID,
        "statusName": this.TaskStatus.value.statusName,
      }
      if (this.TaskStatus.value.id == 0 || this.TaskStatus.value.id === null) {
        data['id'] = 0;
        this.url = AppSettings.insertstatusdetails;
      }
      else {
        data['id'] = this.TaskStatus.value.id;
        this.url = AppSettings.updatestatusdetails;
      }
      this.httpCallService.post(this.url, data).subscribe((data: any) => {

        this.submitAttempt = false;
        this.sharedService.hideLoading();
        if (this.TaskStatus.value.id == 0 || this.TaskStatus.value.id === null) {
          this.toastr.success('Project Task Status Added Successfully.');
        }
        else if (this.TaskStatus.value.id > 0) {
          this.toastr.success('Project Task Status Updated Successfully.');
        }
        this.TaskStatus.patchValue({
          statusName: '',
          id: 0
        });
        this.htmlModal.hide();
        this.GetTaskStatusByAgency(1);
      },
        (error: any) => {

        });

    }
  }


  Deletestatus(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this status?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {

      if (result.value) {

        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deletedstatusdetails + '?statusId=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.toastr.success("Project Task Status Deleted Successfully");
          this.GetTaskStatusByAgency(1);
        }).catch((err) => {
        });
      }
    })
  }

  //editmode skill
  editstatus(status) {

    this.TaskStatus.patchValue({
      agencyId: status?.agencyId,
      statusName: status?.statusName,
      loginId: status?.loginId,
      id: status?.id
    });
    this.htmlModal.show();
  }
  openModal() {
    this.TaskStatus.reset();
  }
}
