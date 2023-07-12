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
  selector: 'app-worker-skills',
  templateUrl: './worker-skills.component.html',
  styleUrls: ['./worker-skills.component.scss']
})
export class WorkerSkillsComponent implements OnInit {

  //Modal Called Object
  @ViewChild('htmlModal') public htmlModal: ModalDirective;
  //formdeclaration
  public SkillForm: FormGroup;
  submitAttempt: boolean = false;

  skillList: any;

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
    this.SkillForm = this.formBuilder.group({
      skill: ['', Validators.required],
      agencyId: ['0'],
      loginId: ['0'],
      id: ['0']

    });
    this.GetSkillByAgency(1);
  }

  GetSkillByAgency(pageNo) {

    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getskillbyagency + '?agencyId=' + this.agencyId + '&Page=' + pageNo).subscribe((data: any) => {
      this.sharedService.hideLoading();

      // this.MypageNumber = data.data.paginationDetails.currentPage;
      // this.pager = this.pagerService.getPager(data.data.paginationDetails.totalCount, this.MypageNumber);
      this.skillList = data.data.resultList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddSkill() {
    this.submitAttempt = true;
    if (this.SkillForm.valid) {
      var data = {
        "agencyId": this.agencyId,
        "loginId": this.userID,
        "skillName": this.SkillForm.value.skill,
      }
      if (this.SkillForm.value.id == 0 || this.SkillForm.value.id === null) {
        data['id'] = 0
        this.url = AppSettings.insertskilldetails;
      }
      else {

        data['id'] = this.SkillForm.value.id
        this.url = AppSettings.updateskilldetails;
      }
      this.httpCallService.post(this.url, data).subscribe((data: any) => {

        this.submitAttempt = false;
        this.sharedService.hideLoading();
        if (this.SkillForm.value.id == 0 || this.SkillForm.value.id === null) {
          this.toastr.success('Worker Skills Added Successfully.');
        }
        else if (this.SkillForm.value.id > 0) {
          this.toastr.success('Worker Skills Updated Successfully.');
        }
        this.SkillForm.patchValue({
          skill: '',
          id: 0
        });
        this.htmlModal.hide();
        this.GetSkillByAgency(1);
      },
        (error: any) => {

        });

    }
  }


  DeleteSkill(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this skill?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.deletedskilldetails + '?skillId=' + id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.toastr.success('Worker Skills Deleted Successfully.');
          this.GetSkillByAgency(1);
        }).catch((err) => {
        });
      }
    })
  }

  //editmode skill
  editSkill(skill) {

    this.SkillForm.patchValue({
      agencId: skill?.AgencyId,
      skill: skill?.skillName,
      useId: skill?.LoginId,
      id: skill?.id
    });
    this.htmlModal.show();
  }
  openModal() {
    this.SkillForm.reset();
  }
}