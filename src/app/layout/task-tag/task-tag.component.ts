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
  selector: 'app-task-tag',
  templateUrl: './task-tag.component.html',
  styleUrls: ['./task-tag.component.scss']
})
export class TaskTagComponent implements OnInit {
  //Modal Called Object
  @ViewChild('htmlModal') public htmlModal: ModalDirective;
  //formdeclaration
  public TaskTag: FormGroup;
  submitAttempt: boolean = false;

  tagList: any;

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
    this.TaskTag = this.formBuilder.group({
      tagName: ['', Validators.required],
      tagColor: ['', Validators.required],
      agencyId: ['0'],
      loginId: ['0'],
      id: ['0']

    });
    this.GetTaskTagByAgency(1);
  }

  GetTaskTagByAgency(pageNo) {

    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.gettagdetail + '?agencyId=' + this.agencyId + '&Page=' + pageNo).subscribe((data: any) => {
      this.sharedService.hideLoading();

      this.MypageNumber = data.data.paginationDetails.currentPage;
      this.pager = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.tagList = data.data.resultList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddTaskTag() {

    this.submitAttempt = true;
    if (this.TaskTag.valid) {
      var data = {
        "agencyId": this.agencyId,
        "loginId": this.userID,
        "tagName": this.TaskTag.value.tagName,
        "tagColor": this.TaskTag.value.tagColor
      }
      if (this.TaskTag.value.id == 0 || this.TaskTag.value.id === null) {
        data['id'] = 0
        this.url = AppSettings.inserttagdetails;
      }
      else {
        data['id'] = this.TaskTag.value.id
        this.url = AppSettings.UpdateTagDetails;
      }
      this.httpCallService.post(this.url, data).subscribe((data: any) => {

        this.submitAttempt = false;
        this.sharedService.hideLoading();
        if (this.TaskTag.value.id == 0 || this.TaskTag.value.id === null) {
          this.toastr.success("Project Task Tag Added Successfully.");
        }
        else if (this.TaskTag.value.id > 0) {
          this.toastr.success("Project Task Tag Updated Successfully.");
        }
        this.TaskTag.patchValue({
          tagName: '',
          tagColor: '',
          id: 0
        });
        this.htmlModal.hide();
        this.GetTaskTagByAgency(1);
      },
        (error: any) => {

        });

    }
  }


  DeleteTag(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this tag?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {

      if (result.value) {

        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deletedtagdetails + '?tagId=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.toastr.success("Project Task Tag Deleted Successfully.");
          this.GetTaskTagByAgency(1);
        }).catch((err) => {
        });
      }
    })
  }

  //editmode skill
  editTag(tag) {

    this.TaskTag.patchValue({
      agencyId: tag?.agencyId,
      tagName: tag?.tagName,
      tagColor: tag?.tagColor,
      loginId: tag?.loginId,
      id: tag?.id
    });
    this.htmlModal.show();
  }
  openModal() {
    this.TaskTag.reset();
  }
}
