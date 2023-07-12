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
  selector: 'app-task-priority',
  templateUrl: './task-priority.component.html',
  styleUrls: ['./task-priority.component.scss']
})
export class TaskPriorityComponent implements OnInit {

  //Modal Called Object
  @ViewChild('htmlModal') public htmlModal: ModalDirective;
  //formdeclaration
  public TaskPriority: FormGroup;
  submitAttempt: boolean = false;

  priorityList: any;

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
    this.TaskPriority = this.formBuilder.group({
      priorityName: ['', Validators.required],
      priorityColor: ['', Validators.required],
      agencyId: ['0'],
      loginId: ['0'],
      id: ['0']

    });
    this.GetTaskPriorityByAgency(1);
  }

  GetTaskPriorityByAgency(pageNo) {

    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.getprioritydetail + '?AgencyId=' + this.agencyId + '&Page=' + pageNo, null).subscribe((data: any) => {
      this.sharedService.hideLoading();

      this.MypageNumber = data.data.paginationDetails.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.priorityList = data.data.resultList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddTaskPriority() {

    this.submitAttempt = true;
    if (this.TaskPriority.valid) {
      var data = {
        "agencyId": this.agencyId,
        "loginId": this.userID,
        "priorityName": this.TaskPriority.value.priorityName,
        "priorityColor": this.TaskPriority.value.priorityColor,
      }
      if (this.TaskPriority.value.id == 0 || this.TaskPriority.value.id === null) {
        data['id'] = 0;
        this.url = AppSettings.insertprioritydetails;
      }
      else {
        // data = null;
        this.url = AppSettings.UpdatePriorityDetails + '?Id=' + this.TaskPriority.value.id + '&PriorityName=' + this.TaskPriority.value.priorityName + '&Color=' + this.TaskPriority.value.priorityColor
      }
      this.httpCallService.post(this.url, data).subscribe((data: any) => {

        this.submitAttempt = false;
        this.sharedService.hideLoading();
        if (this.TaskPriority.value.id == 0 || this.TaskPriority.value.id === null) {
          this.toastr.success("Project Task Priority Added Successfully.");
        }
        else if (this.TaskPriority.value.id > 0) {
          this.toastr.success("Project Task Priority Updated Successfully.");
        }
        this.TaskPriority.patchValue({
          priorityName: '',
          priorityColor: '',
          id: 0
        });
        this.htmlModal.hide();
        this.GetTaskPriorityByAgency(1);
      },
        (error: any) => {

        });

    }
  }


  DeletePriority(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this priority?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {

      if (result.value) {

        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deletedprioritydetails + '?Id=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.toastr.success("Project Task Priority Deleted Successfully.");
          this.GetTaskPriorityByAgency(1);
        }).catch((err) => {
        });
      }
    })
  }

  //editmode skill
  editPriority(priority) {

    this.TaskPriority.patchValue({
      agencyId: priority?.agencyId,
      priorityName: priority?.priorityName,
      priorityColor: priority?.priorityColor,
      loginId: priority?.loginId,
      id: priority?.id
    });
    this.htmlModal.show();
  }
  openModal() {
    this.TaskPriority.reset();
  }
}
