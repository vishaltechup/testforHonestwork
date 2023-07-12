import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from 'src/app/config/app.config';
import { AuthService } from 'src/app/service/auth.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SharedService } from 'src/app/service/shared.service';
import checkPermissions from 'src/app/service/user-permission.service';
import { UserManagementService } from 'src/app/service/user-management.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  session: any;
  id: any;
  permissions: any;
  isShown: boolean = false;
  constructor(
    private authService: AuthService,
    public router: Router,
    private toaster: ToastrService,
    private useManagementService: UserManagementService

  ) { }

  ngOnInit(): void {
    const userdata = this.useManagementService.getCurrentUserData();
    this.permissions = checkPermissions(userdata.roleName);
    if (this.router.url.indexOf('worker-skills') > -1 || this.router.url.indexOf('task-status') > -1 || this.router.url.indexOf('task-tag') > -1 || this.router.url.indexOf('project-techstack') > -1) {
      this.isShown = true;
    }
  }

  logout() {
    this.authService.logout();
    this.toaster.success('Logout Successfully')
    this.router.navigate(['logout']);
  }
  showDrp(flag) {
   
    if (flag) {
      this.isShown = !this.isShown;
    } else {
      this.isShown = true;
    }
  }
  hideBlock() {
    this.isShown = false;
  }
}
