import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { viewClassName } from '@angular/compiler';
import { PagerService } from '../../../service/pager.service';
import checkPermissions from "../../../service/user-permission.service";


@Component({
  selector: 'app-project-milestone',
  templateUrl: './project-milestone.component.html',
  styleUrls: ['./project-milestone.component.scss']
})
export class ProjectMilestoneComponent implements OnInit {

  @ViewChild('htmlNewMilestoneModal') public htmlNewMilestoneModal: ModalDirective;

  public newMilestoneForm: FormGroup;
  submitAttempt: boolean = false;

  projectId: any;
  Milestonelist: any;
  url: any;
  permissions: any;
  userID: any;
  agencyId: any;

  isActive = 1;

  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {

    this.newMilestoneForm = this.formBuilder.group({
      id: ['0'],
      projectId: this.projectId,
      milestone: ['', Validators.required],
      amount: ['', Validators.required],
    });

    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;

    this.permissions = checkPermissions(userdata.roleName);

    await Promise.all([this.getprojectmilestonelist()]);

  }

  //Milestone List
  getprojectmilestonelist() {

    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.getprojectmilestonelistByProjectID + '?projectId=' + this.projectId + '&isActive=' + this.isActive, null).subscribe((data: any) => {
      this.Milestonelist = data.dataList;
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  //editmode milestone
  editMilestone(Milestone) {

    this.newMilestoneForm.patchValue({
      id: Milestone?.id,
      milestone: Milestone?.milestone,
      amount: Milestone?.amount
    });

    this.htmlNewMilestoneModal.show();
  }

  AddProjectMileStone() {
    console.log(this.newMilestoneForm.value.id)
    this.submitAttempt = true;
    if (this.newMilestoneForm.valid) {
      var data = {
        "projectId": this.projectId,
        "milestone": this.newMilestoneForm.value.milestone,
        "amount": this.newMilestoneForm.value.amount,
      }
      if (this.newMilestoneForm.value.id === '0' || this.newMilestoneForm.value.id === null) {
        data['id'] = 0;
        this.url = AppSettings.addprojectmilestone;
      }
      else {
        data['id'] = this.newMilestoneForm.value.id;
        this.url = AppSettings.updateprojectmilestone;
      }
      this.sharedService.showLoading();
      this.httpCallService.post(this.url, data).subscribe((data: any) => {
        this.sharedService.hideLoading();
        this.submitAttempt = false;
        this.newMilestoneForm.reset();
        this.htmlNewMilestoneModal.hide();
        this.toaster.success(data.message);
        this.getprojectmilestonelist();
      }, (error: any) => {
        this.sharedService.hideLoading();
      });
    }
  }

  DeleteMilestone(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this file?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deleteMileStone + '?Id=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.getprojectmilestonelist();
          this.toaster.success('Milestone Deleted Successfully');
        }).catch((err) => {
        });
      }
    })
  }

  filterData(event) {

    this.isActive = Number(event.target.value);
    this.getprojectmilestonelist();
  }
  openModal() {
    this.newMilestoneForm.reset();
  }
}