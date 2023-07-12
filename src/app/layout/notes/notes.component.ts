import { Component, OnInit, ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { HttpCallService } from '../../service/http-call.service';
import { SharedService } from '../../service/shared.service';
import { PagerService } from '../../service/pager.service';
import { AppSettings } from 'src/app/config/app.config';
import { Router } from '@angular/router';
import { $ } from 'protractor';
import { ThrowStmt } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserManagementService } from 'src/app/service/user-management.service';
import { async } from '@angular/core/testing';
import checkPermissions from "../../service/user-permission.service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  @ViewChild('htmlConvertTaskModal') public htmlConvertTaskModal: ModalDirective;
  @ViewChild('htmlDescriptionModal') public htmlDescriptionModal: ModalDirective;
  public ReplyNoteForm: FormGroup;
  submitAttempt: boolean = false;
  public taskForm: FormGroup;
  submitattemp: boolean = false;
  taskSubmitAttempt: boolean = false;

  noteList = [];
  projectList = [];
  noteReplyList: [];
  projectNoteId: any;
  private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  MypageNumber: number;
  projectFrom: FormGroup;
  Projectnote: any;

  Statuslist: any;
  Taglist: any;
  Workerslist: any;
  Milestonelist: any;
  userID: any;
  permissions: any;
  agencyId: any;
  noteDescription: any;

  constructor(
    public SharedService: SharedService,
    public httpcallService: HttpCallService,
    public PagerService: PagerService,
    private toaster: ToastrService,
    public router: Router,
    private formBuilder: FormBuilder,
    public UserManagementService: UserManagementService
  ) { }

  ngOnInit(): void {
    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.ReplyNoteForm = this.formBuilder.group({
      id: [''],
      reply: ['', Validators.required],
    });

    this.projectFrom = this.formBuilder.group({
      projectId: ['', Validators.required],
      Page: ['', Validators.required]
    });

    this.taskForm = this.formBuilder.group({
      projectMileStoneId: ['', Validators.required],
      task: ['', Validators.required],
      estimatedHours: ['', Validators.required],
      tagId: ['', Validators.required],
      WorkerId: ['', Validators.required],
      projectNoteId: [0, Validators.required],
      projectId: [0, Validators.required],
      taskDescription: ['', Validators.required],
    });
    this.permissions = checkPermissions(userdata.roleName);
    this.getProjectList();
  }

  getProjectnotebyId(projectId) {
    this.SharedService.showLoading();
    this.httpcallService.post(AppSettings.getNoteList + '&ProjectId=' + projectId, null).toPromise().then((res) => {
      this.SharedService.hideLoading();
      this.Projectnote = res.data.resultList;

      this.projectFrom.patchValue({
        projectId: this.Projectnote?.projectId
      });

    },
      (error: any) => {
        this.SharedService.hideLoading();
      });

  }

  getProjectnotebypagination(pageno) {

    this.SharedService.showLoading();
    this.httpcallService.post(AppSettings.getNoteList + '?Page=' + pageno, null).toPromise().then((res) => {
      this.MypageNumber = res.data.paginationDetails.currentPage;
      this.pager = this.PagerService.getPager(res.data.paginationDetails.totalCount, this.MypageNumber);

      this.noteList = res.data.resultList;
      this.SharedService.hideLoading();

    }).catch((err) => {
      this.SharedService.hideLoading();
    });
  }

  getnoteList(id) {
    this.SharedService.showLoading();
    this.httpcallService.post(AppSettings.getNoteList + '?Page=0&ProjectId=' + id, null).toPromise().then((res) => {

      this.MypageNumber = res.data.paginationDetails.currentPage;
      this.pager = this.PagerService.getPager(res.data.paginationDetails.totalCount, this.MypageNumber);

      this.noteList = res.data.resultList;

      this.SharedService.hideLoading();
    }).catch((err) => {
      this.SharedService.hideLoading();
    });
  }

  getProjectList() {
    this.SharedService.showLoading();
    this.httpcallService.post(AppSettings.getDropDownProjectsURL, null).subscribe((data: any) => {

      this.projectList = data.dataList;
      this.SharedService.hideLoading();

      if (this.projectList != null) {
        this.getProjectnotebypagination(0);
      }

    },
      (error: any) => {
        this.SharedService.hideLoading();
      });
  }

  getnoteListbyID(event) {
    const id = event.target.value;
    this.getnoteList(id);
  }

  //for Confirm note details
  ConfirmNoteDetails(id) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Confirm this note  ?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.SharedService.showLoading();
        this.httpcallService.post(AppSettings.ConfirmNoteDetails + '?projectNoteId=' + id, null).toPromise().then((res) => {
          this.SharedService.hideLoading();
          this.toaster.success("Notes Confirmed Successfully");
          this.getnoteList(1);

        }).catch((err) => {
          this.SharedService.hideLoading();
        });
      }
    })
  }

  //for leave reply()
  ReplayToNoteDetails() {

    this.submitAttempt = true;
    if (this.ReplyNoteForm.valid) {
      var ProjectNoteReply = {
        "projectNoteId": this.ReplyNoteForm.value.id,
        "reply": this.ReplyNoteForm.value.reply
      };
      this.SharedService.showLoading();
      this.httpcallService.post(AppSettings.ReplyToNoteDetails, ProjectNoteReply).toPromise().then((res) => {

        this.submitAttempt = false;

        this.ReplyNoteForm.patchValue({
          reply: "",
        });

        this.SharedService.hideLoading();
        // this.htmlAddModal.hide();
        this.toaster.success('Comment Added on Note Successfully');
        this.GetNoteReply(this.projectNoteId);
      }).catch((err) => {
        this.SharedService.hideLoading();
      });
    }
  }

  OpenLeaveReplyPopup(id, note) {
    this.noteDescription = note.notes
    this.noteReplyList = [];
    this.ReplyNoteForm.patchValue({
      id: id,
    });
    this.projectNoteId = id;
    this.GetNoteReply(id);
    this.htmlDescriptionModal.show();
  }

  getdrptagdetails() {
    this.SharedService.showLoading();
    this.httpcallService.get(AppSettings.getdrptagdetails + '?agencyId=' + this.agencyId).subscribe((data: any) => {
      this.SharedService.hideLoading();
      this.Taglist = data.dataList;
      this.getdrpstatusdetails();
    },
      (error: any) => {
        this.SharedService.hideLoading();
      });
  }

  getdrpstatusdetails() {
    this.SharedService.showLoading();
    this.httpcallService.get(AppSettings.getdrpstatusdetails + '?agencyId=' + this.agencyId).subscribe((data: any) => {
      this.SharedService.hideLoading();
      this.Statuslist = data.dataList;

      this.getprojectmilestonelist();

    },
      (error: any) => {
        this.SharedService.hideLoading();
      });
  }

  getprojectmilestonelist() {
    this.SharedService.showLoading();
    const formValues = this.taskForm.value;
    this.httpcallService.get(AppSettings.getprojectmilestonelist + '?projectId=' + formValues.projectId).subscribe((data: any) => {
      this.SharedService.hideLoading();
      this.Milestonelist = data.dataList;
      this.getprojectworkerslist();
    },
      (error: any) => {
        this.SharedService.hideLoading();
      });
  }

  getprojectworkerslist() {
    this.SharedService.showLoading();
    const formValues = this.taskForm.value;
    this.httpcallService.get(AppSettings.getprojectworkerslist + '?projectId=' + formValues.projectId).subscribe((data: any) => {
      this.SharedService.hideLoading();
      this.Workerslist = data.dataList;
    },
      (error: any) => {
        this.SharedService.hideLoading();
      });
  }

  async ConvertTask(notes) {

    this.taskForm.patchValue({
      taskDescription: notes?.notes,
      projectNoteId: notes?.id,
      projectId: notes?.projectId,
    })

    await this.getdrptagdetails();

    this.htmlConvertTaskModal.show();
  }

  AddProjectTask() {

    this.taskSubmitAttempt = true;
    if (this.taskForm.valid) {

      const formValues = this.taskForm.value;

      var projectTask = {
        "id": 0,
        "projectId": formValues.projectId,
        "task": formValues.task,
        "estimatedHours": formValues.estimatedHours,
        "statusId": 1,
        "projectMileStoneId": formValues.projectMileStoneId,
        "loginId": this.userID,
        "tagId": formValues.tagId,
        "WorkerId": formValues.WorkerId,
        "taskDescription": formValues.taskDescription
      }

      var data = {
        projectTask: projectTask,
        projectNoteId: formValues.projectNoteId,
      }

      this.SharedService.showLoading();
      this.httpcallService.post(AppSettings.ConvetToTaskDetails, data).subscribe((data: any) => {
        this.SharedService.hideLoading();
        this.taskSubmitAttempt = false;
        this.taskForm.reset();
        this.htmlConvertTaskModal.hide();
        this.toaster.success("Task Submitted Successfully.");
        this.getnoteList(1);
      },
        (error: any) => {
          this.SharedService.hideLoading();
        });
    }
  }

  //Get not reply
  GetNoteReply(projectNoteId) {

    this.SharedService.showLoading();
    this.httpcallService.post(AppSettings.getnotereply + '?projectNoteId=' + projectNoteId, null).toPromise().then((res) => {

      this.SharedService.hideLoading();
      this.noteReplyList = res.dataList;

    }).catch((err) => {
      this.SharedService.hideLoading();
    });
  }

}
