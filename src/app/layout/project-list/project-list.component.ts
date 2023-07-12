import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCallService } from "../../service/http-call.service";
import { SharedService } from "../../service/shared.service";
import { AppSettings } from "../../config/app.config";
import { PagerService } from '../../service/pager.service';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import checkPermissions from 'src/app/service/user-permission.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projectList = [];
  permissions: any;
  userID: any;
  agencyId: any;
  roleName: any;

  constructor(public sharedService: SharedService, public httpCallService: HttpCallService, private pagerService: PagerService, private router: Router,
    private toastr: ToastrService, private useManagementService: UserManagementService,
    private formBuilder: FormBuilder, public datepipe: DatePipe) { }

  ngOnInit(): void {
    const userdata = this.useManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.roleName = userdata.roleName;
    this.permissions = checkPermissions(userdata.roleName);
    this.getProjectList();
  }

  getProjectList() {

    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getProjectList).subscribe((data: any) => {
      this.projectList = data.data.resultList;
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  deleteProject(projectId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this project?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.Deleteproject + '?projectId=' + projectId, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.toastr.success('Project Deleted Successfully');
          this.getProjectList();
        }).catch((err) => {
        });

      }
    })
  }
  navigateToProject(project) {
    localStorage.setItem('_workerStatus', JSON.stringify(project))
    if (this.roleName !== 'Agency') {
      this.router.navigate(['/project/details/' + project.id]);
    } else {
      this.router.navigate(['/project/note/' + project.id]);
    }
  }
}
