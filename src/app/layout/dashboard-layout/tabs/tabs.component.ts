import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import checkPermissions from "../../../service/user-permission.service";
import { UserManagementService } from 'src/app/service/user-management.service';
import { HttpCallService } from 'src/app/service/http-call.service';
import { AppSettings } from "../../../config/app.config";
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  projectId: any;
  permissions: any;
  agencyId: any;
  userID: any;
  workerID: any;
  projectStatus: any;
  constructor(private route: ActivatedRoute,
    public router: Router,
    public UserManagementService: UserManagementService, private httpCallService: HttpCallService) {
    this.projectId = this.route.snapshot.params.id || null;
    // if (this.router.url.indexOf('/test/sort') > -1) {
    //   this.active = 0;
    // }
  }

  ngOnInit() {
    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.workerID = userdata.workerId;

    this.permissions = checkPermissions(userdata.roleName);
    if (localStorage.getItem('_workerStatus') !== undefined && localStorage.getItem('_workerStatus') !== null && localStorage.getItem('_workerStatus') !== '') {
      this.projectStatus = JSON.parse(localStorage.getItem('_workerStatus')).projectStatus
    }
  }
}
