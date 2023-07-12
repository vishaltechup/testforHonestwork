import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { HttpCallService } from "../../../service/http-call.service";
import { SharedService } from "../../../service/shared.service";
import { ToastrService } from "ngx-toastr";
import { AppSettings } from "../../../config/app.config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/service/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import checkPermissions from "../../../service/user-permission.service";
import { PagerService } from 'src/app/service/pager.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-project-task',
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.scss']
})
export class ProjectTaskComponent implements OnInit {
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  projectId: any;
  agencyId: any;
  userID: any;
  taskList: any;
  Statuslist: any;
  Taglist: any;
  Workerslist: any;
  Milestonelist: any;
  submitAttempt: boolean = false;
  milesubmitAttempt: boolean = false;
  projectdatail: any;
  permissions: any;
  taskTagList: any = [];
  priorityList: any = [];
  public taskStatusForm: FormGroup;
  public taskForm: FormGroup;
  public mileStoneForm: FormGroup;
  public StatusForm: FormGroup;
  public filterby: FormGroup;
  viewasstatus: boolean = false;
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  MypageNumber: number;
  dropdownSettings = {};
  selectedItems: any;
  isActive = 1;
  PriorityId = 0;
  constructor(private route: ActivatedRoute, private location: Location,
    public sharedService: SharedService,
    public httpCallService: HttpCallService,
    public UserManagementService: UserManagementService,
    public PagerService: PagerService,
    private toaster: ToastrService, private formBuilder: FormBuilder) {
    this.projectId = this.route.snapshot.params.id || null;
  }

  async ngOnInit() {

    this.viewasstatus = false;
    this.taskForm = this.formBuilder.group({
      projectMileStoneId: ['', Validators.required],
      task: ['', Validators.required],
      estimatedHours: ['', Validators.required],
      tagId: ['', Validators.required],
      WorkerId: ['', Validators.required],
      TaskDescription: ['', Validators.required],
      taskStatusId: ['', Validators.required],
      priorityId: ['', Validators.required]
    });

    this.mileStoneForm = this.formBuilder.group({
      milestone: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this.StatusForm = this.formBuilder.group({
      statusId: ['', Validators.required],
    });

    this.taskStatusForm = this.formBuilder.group({
      viewas: ['', Validators.required],
      filterby: ['', Validators.required],
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'tagName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;

    this.permissions = checkPermissions(userdata.roleName);

    await Promise.all([this.getdrptagdetails(), this.GetTaskTagByAgency(1), this.GetTaskPriorityByAgency(),this.gettasklistbyprojectid(1)]);
  }

  OnChangeviewas(viewas) {
    if (viewas == "Grid") {
      this.viewasstatus = true;
    }
    else {
      this.viewasstatus = false;
    }
  }

  gettasklistbyprojectid(pageNo) {
   //his.sharedService.showLoading();
    const formValues = this.taskStatusForm.value; 
    this.httpCallService.get(AppSettings.gettasklistbyprojectid + '?projectId=' + this.projectId + '&agencyId=' + this.agencyId + '&Page=' + pageNo + '&isActive=' + this.isActive + '&PriorityId=' + this.PriorityId).subscribe((data: any) => {
      this.MypageNumber = data.data.paginationDetails?.currentPage;
      this.pager = this.PagerService.getPager(data.data.paginationDetails?.totalCount, this.MypageNumber);
      this.taskList = data.data.resultList;
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  onItemSelect(item: any) {
  }

  onSelectAll(items: any) {
  }
  getdrpstatusdetails() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getdrpstatusdetails + '?AgencyId=' + this.agencyId).subscribe((data: any) => {
      // this.sharedService.hideLoading();
      this.Statuslist = data.dataList;
      this.getprojectworkerslist();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  GetTaskTagByAgency(pageNo) {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.gettagdetail + '?agencyId=' + this.agencyId + '&Page=' + pageNo).subscribe((data: any) => {
      //this.sharedService.hideLoading();
      this.taskTagList = data.data.resultList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  GetTaskPriorityByAgency() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.GetDrpPriorityList + '?AgencyId=' + this.agencyId).subscribe((data: any) => {
      //this.sharedService.hideLoading();
      this.priorityList = data.dataList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  getdrptagdetails() {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getdrptagdetails + '?agencyId=' + this.agencyId).subscribe((data: any) => {
      // this.sharedService.hideLoading();
      this.Taglist = data.dataList;
      this.getprojectmilestonelist();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  getprojectmilestonelist() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectmilestonelist + '?projectId=' + this.projectId).subscribe((data: any) => {
      //this.sharedService.hideLoading();
      this.Milestonelist = data.dataList;
      this.getdrpstatusdetails();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  getprojectworkerslist() {
    //this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.getprojectworkerslist + '?projectId=' + this.projectId).subscribe((data: any) => {
      // this.sharedService.hideLoading();
      this.Workerslist = data.dataList;
      this.gettasklistbyprojectid(1);
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  AddProjectTask() {
    this.submitAttempt = true;
    console.log(this.taskForm)
    if (this.taskForm.valid) {
      const tagIdArray = [];
      const formValues = this.taskForm.value;
      formValues.tagId.map(tag => {
        tagIdArray.push(tag.id)
      })

      var data = {
        "id": 0,
        "projectId": Number(this.projectId),
        "task": formValues.task,
        "estimatedHours": formValues.estimatedHours,
        "statusId": Number(formValues.taskStatusId),
        "projectMileStoneId": Number(formValues.projectMileStoneId),
        "loginId": Number(this.userID),
        "tagId": tagIdArray.toString(),
        "workerId": Number(formValues.WorkerId),
        "taskDescription": formValues.TaskDescription,
        "agencyId": Number(this.agencyId),
        "priorityId": Number(formValues.priorityId)
      }

      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.insertprojecttaskdetails, data).subscribe((data: any) => {
        this.sharedService.hideLoading();
        this.submitAttempt = false;
        //this.taskForm.reset();
        this.taskForm.patchValue({
          task: '',
          estimatedHours: '',
          projectMileStoneId: '',
          WorkerId: '',
          tagId: '',
          TaskDescription: '',
          priorityId: ''
        });
        this.htmlAddModal.hide();
        this.toaster.success("Task Submitted Successfully.");
        this.gettasklistbyprojectid(1);

      },
        (error: any) => {
          this.sharedService.hideLoading();
        });
    }
  }

  //updateprojecttaskstatus
  UpdateProjectTaskStatus(statusId, taskId) {

    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.updateprojecttaskstatus + '?projectId=' + this.projectId + '&taskId=' + taskId + '&statusId=' + statusId, null).subscribe((data: any) => {
      this.sharedService.hideLoading();
      this.toaster.success("Task Submitted Successfully.");
      this.gettasklistbyprojectid(1);
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }

  //addprojectmilestone
  AddProjectMileStone() {
    this.milesubmitAttempt = true;
    if (this.mileStoneForm.valid) {

      const formValues = this.mileStoneForm.value;

      var data =
      {
        "id": 0,
        "projectId": this.projectId,
        "milestone": formValues.milestone,
        "amount": formValues.amount,
      }

      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.addprojectmilestone, data).subscribe((data: any) => {
        this.sharedService.hideLoading();
        this.milesubmitAttempt = false;
        this.mileStoneForm.reset();
        this.htmlAddModal.hide();
        this.toaster.success("Milestone Added Successfully.");
        this.getprojectmilestonelist();
      },
        (error: any) => {
          this.sharedService.hideLoading();
        });
    }
  }

  addMilestone() {
    this.htmlAddModal.show();
  }

  filterData(event) {
    this.isActive = Number(event.target.value);
    this.gettasklistbyprojectid(1);
  }

  filterPriority(event) {
    this.PriorityId = Number(event.target.value);
    this.gettasklistbyprojectid(1);
  }

  CloseTask(task) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to close this task?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        this.httpCallService.post(AppSettings.CloseTask + '?taskId=' + task.id, null).toPromise().then((res) => {
          this.sharedService.hideLoading();
          this.gettasklistbyprojectid(1);
          this.toaster.success('Task Closed Successfully');
        }).catch((err) => {
        });
      }
    })
  }
  openModal() {
    this.submitAttempt = false;
    //this.taskForm.reset();
    this.taskForm.patchValue({
      task: '',
      estimatedHours: '',
      projectMileStoneId: '',
      WorkerId: '',
      tagId: '',
      TaskDescription: ''
    });

  }
}
