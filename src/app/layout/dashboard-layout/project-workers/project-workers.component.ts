import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-project-workers',
  templateUrl: './project-workers.component.html',
  styleUrls: ['./project-workers.component.scss']
})
export class ProjectWorkersComponent implements OnInit {
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  projectId: any;
  userID: any;
  //Declaration
  workersList = [];
  workersActivityList = [];
  projectdatail: any;

  rateType: any;
  workerForm: FormGroup;
  submitted: boolean = false;
  deletedId: '';
  selectedMember = [];
  allMemberList: any;
  agencyId: any;
  workerList = [];
  selectedItems = [];
  agencyWiseData:any = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {

    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.workerForm = this.formBuilder.group({
      worker: ['', Validators.required]
    })
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch: true
    };

    await Promise.all([this.GetWorkersActivityList()]);

  }

  GetWorkerDetailsByID() {

    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.GetWorkerDetailsByDashBoard + '?userId=' + this.userID + '&projectId=' + this.projectId).toPromise().then((res) => {
      this.sharedService.hideLoading();
      this.workersList = res.dataList;

    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  GetWorkersActivityList() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getworkersActivitylist + '?projectId=' + this.projectId).toPromise().then((res) => {

      this.workersActivityList = res.dataList;
      const result = [];
      const finalArray = [];
      this.workersActivityList.map(ele => {
        result.push(ele.agencyId);
      })
      var dups = [];
      var arr = result.filter(function (el) {
        // If it is not a duplicate, return true
        if (dups.indexOf(el) == -1) {
          dups.push(el);
          return true;
        }

        return false;

      });

      console.log(arr);
      arr.map(ele => {
        console.log(ele);
        const json = {};
        json['agencyId'] = ele;
        json['childArray'] = [];
        this.workersActivityList.map(ele1 => {
          if (ele === ele1.agencyId && ele1.workerStatus !== 'Parent') {
            json['childArray'].push(ele1);
            // ele['childArray'].push(ele1)
          }
        })
        finalArray.push(json);
      })
      console.log('ssss', finalArray);
      this.agencyWiseData = finalArray;
      // this.sharedService.hideLoading();
      this.GetWorkerDetailsByID();
      this.sharedService.hideLoading();

    }).catch((err) => {

    });
  }

  AddWorker() {
    this.submitted = true;
    // console.log(data)

    if (this.selectedItems.length > 0) {
      const workerArray = [];
      this.selectedItems.map(ele => {
        const data = {
          "projectId": this.projectId,
          "workerId": ele.id,
          "rateType": this.rateType,
          "amount": "0",
        };
        workerArray.push(data);
      })

      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.assignproject, workerArray)
        .subscribe((data: any) => {
          this.submitted = false;
          this.sharedService.hideLoading();
          if (data.status == 1) {
            this.toaster.success(data.message);
            this.workerForm.reset();
            this.selectedItems = [];
            this.GetWorkersActivityList();
          }
          else {
            this.toaster.error(data.message);
          }
        },
          (error: any) => {
            this.sharedService.hideLoading();

          });
    }
  }

  public AssignProject(workerId) {

    var data = {
      "projectId": this.projectId,
      "workerId": workerId,
      "rateType": this.rateType,
      "amount": "0",
    };

    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.assignproject, data)
      .subscribe((data: any) => {
        this.sharedService.hideLoading();

        if (data.status == 1) {
          this.toaster.success(data.message);
          this.GetWorkersActivityList();
        }
        else {
          this.toaster.error(data.message);
        }
      },
        (error: any) => {
          this.sharedService.hideLoading();

        });

  }

  deleteUser(worker) {


    this.deletedId = worker.workerId
    Swal.fire({
      text: 'Are you sure want to delete worker?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        $(':focus').blur()
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.DeleteAssignWorker + '?workerId=' + Number(worker.workerId) + '&projectId=' + Number(this.projectId), null).subscribe((data: any) => {
          this.sharedService.hideLoading();
          Swal.fire('Worker Deleted Successfully.');
          this.GetWorkersActivityList();
        }, (err: any) => {

        })
      } else {
        this.AddWorker();
        $('#profile-tr').click();
      }
    })
  }

  onItemSelect(item: any) {

  }

  onSelectAll(items: any) {

  }

  onFilterChange(event) {

    if (event === "") {
      this.workerList = new Array;
      return;
    } else {
      this.httpCallService.get(AppSettings.FilterSuggestedWorker + '?workername=' + event + '&projectId=' + this.projectId + '&agencyId=' + this.agencyId).subscribe((res) => {
        if (event === "") {
          this.workerList = new Array;
        } else {
          this.workerList = res.dataList;
        }
      })
    }
  }

  onDropDownClose() {
    this.workerList = []
  }

}
