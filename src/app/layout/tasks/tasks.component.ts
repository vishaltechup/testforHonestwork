import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/config/app.config';
import { HttpCallService } from 'src/app/service/http-call.service';
import { SharedService } from 'src/app/service/shared.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  @ViewChild('editor') editor;
  @ViewChild('htmlAddModal') public htmlAddModal: ModalDirective;
  constructor(private sharedService: SharedService, public httpCallService: HttpCallService, private router: ActivatedRoute, private location: Location,
    public UserManagementService: UserManagementService, public fb: FormBuilder, public toastrService: ToastrService) { }
  // editor: Editor;
  html: '';
  config: any;
  config1: any;
  projectList: any;
  highPriority: boolean = false;
  mediumPriority: boolean = false;
  lowPriority: boolean = false;
  Statuslist: any;
  taskList: any = [];
  taskDataForm: FormGroup;
  submitted: boolean = false;
  public isSourceActive: boolean;
  public sourceData: string;
  finalTaskArray: any = [];
  taskStatus: any = '';
  agencyId: any;
  taskTagList: any = [];
  priorityColor: any;
  taskPriority: any = '';
  taskId: any;
  editTaskData: any;
  comment: any;
  addModalFlag: boolean = false;
  projectId: any = '';
  userID: any;
  statusId: any;
  addUploadedfiles: any = [];
  workerList: any = [];
  editCommentContent: any;
  assigneeName: any = '';
  reporterName: any = '';
  reporterImage: any = '';
  workerImage: any = '';
  agencyName: any = '';
  priorityList: any = [];
  dropdownSettings = {};
  selectedItems: any;
  paginationData: boolean = false;
  pageNumber: number = 1;
  taskPageNumber: number = 1;
  logData: any = [];
  logValue: any = 0;
  taskPaginationData: boolean = false;
  fileList: any = [];
  estimatedHours: any = 0;
  ngOnInit(): void {
    this.config = {
      toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
        { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
        { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
        '/',
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
        { name: 'about', items: ['About'] }
      ]
    }
    this.config1 = {
      toolbar: []
    }
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
    const userdata = this.UserManagementService.getCurrentUserData();
    this.userID = userdata.userId;
    this.agencyId = userdata.agencyId;
    this.agencyName = userdata.userName;
    if (this.router.snapshot.params['projectId'] !== undefined && this.router.snapshot.params['projectId'] !== null) {
      this.projectId = this.router.snapshot.params['projectId']
      this.getProjectTask(this.router.snapshot.params['projectId'])
    }
    this.getProjectList();
    this.taskDataForm = this.fb.group({
      task: ['', Validators.required],
      description: ['', Validators.required],
      environment: [''],
      worker: ['', Validators.required],
      estimate_time: ['', Validators.required]
    })
    // this.projectId = 1;
    // this.getProjectTask(1);

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'tagName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getdrpstatusdetails();
    this.GetTaskTagByAgency(1);
    this.GetTaskPriorityByAgency(1);
    console.log(this.router.snapshot.params['projectId'])

    //get the vale from query params (/6) project id

    //set the projct id to dropdown
    //call metod for drop down // this.getProjectTask(this.projectId)
  }
  onItemSelect(item: any) {
  }

  onSelectAll(items: any) {
  }
  get f() {
    return this.taskDataForm.controls;
  }
  getProjectList() {
    this.sharedService.showLoading();
    const startDate = '';
    const endDate = '';
    this.httpCallService.post(AppSettings.getDropDownProjectsURL, null).subscribe((data: any) => {
      this.projectList = data.dataList;
      this.sharedService.hideLoading();
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  addCard(task) {
    this.fileList = [];
    this.estimatedHours = 0;
    this.taskDataForm.controls.description.setValue('')
    this.taskDataForm.reset();
    this.taskStatus = task.statusId;
    this.taskPriority = '';
    this.priorityColor = '';
    this.comment = '';
    this.assigneeName = '';
    this.reporterName = this.agencyName;
    this.reporterImage = '';
    this.workerImage = '';
    this.addModalFlag = true;
    this.selectedItems = [];
  }

  GetTaskTagByAgency(pageNo) {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.gettagdetail + '?agencyId=' + this.agencyId + '&Page=' + pageNo).subscribe((data: any) => {
      this.sharedService.hideLoading();
      this.taskTagList = data.data.resultList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  GetTaskPriorityByAgency(value) {
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.GetDrpPriorityList + '?AgencyId=' + this.agencyId).subscribe((data: any) => {
      this.sharedService.hideLoading();
      this.priorityList = data.dataList;
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  editTaskModal(taskCard) {
    this.addModalFlag = false;
    console.log(taskCard)
    const tagArray = [];
    this.fileList = [];
    this.editTaskData = taskCard;
    this.taskDataForm.controls.task.setValue(taskCard.task);
    this.taskDataForm.controls.description.setValue(taskCard.taskDescription);
    this.taskDataForm.controls.worker.setValue(taskCard.workerId);
    this.taskDataForm.controls.estimate_time.setValue(taskCard.estimatedHours);
    this.taskStatus = taskCard.statusId;
    // this.taskT
    this.taskPriority = taskCard.priorityId;
    this.priorityColor = taskCard.prioritycolor;
    this.assigneeName = taskCard.workerName;
    this.reporterName = taskCard.agencyName;
    this.reporterImage = taskCard.agencyImage;
    this.workerImage = taskCard.workerImage;
    this.fileList = taskCard.fileList;
    this.estimatedHours = taskCard.estimatedHours;
    taskCard.tagList.map(ele => {
      const json = {};
      json['id'] = ele.tag;
      json['tagName'] = ele.tagName;
      json['tagColor'] = ele.tagColor;
      tagArray.push(json);
    })
    this.selectedItems = tagArray;
    this.taskTagList.map((task) => {
      if (task.id === taskCard.tagId) {
        this.priorityColor = task.tagColor;
      }
    })
    this.logData = [];
    this.getTaskLog();
    // this.showTabContent('c1');
  }
  chahngeDropDown() {
    this.taskList = [];
  }
  getProjectTask(value) {
    this.taskPaginationData = false;
    if (this.router.snapshot.params['projectId'] !== undefined) {
      this.location.replaceState('/task-list/' + value);
    }
    this.sharedService.showLoading();
    this.httpCallService.get(AppSettings.gettasklistbyprojectid + '?projectId=' + value + '&agencyId=' + this.agencyId + '&Page=' + this.taskPageNumber + '&isActive=' + 1 + '&PriorityId=' + 0).subscribe((data: any) => {
      this.sharedService.hideLoading();
      if (data.data.resultList !== null) {
        this.taskPaginationData = data.data.paginationDetails.nextPage;
        this.taskList = this.taskList.concat(data.data.resultList);
        this.getStatuWiseTaskList();
        this.projectId = value
        this.getWorkerList();
      }
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  getStatuWiseTaskList() {
    // const groupArr = this.taskList.reduce((r, { statusId, statusName }) => {
    //   if (!r.some(o => o.statusId == statusId)) {
    //     r.push({ statusId, statusName, groupItem: this.taskList.filter(v => v.statusId == statusId) });
    //   }
    //   return r;
    // }, []);
    const groupArr = []
    this.Statuslist.map((status) => {
      const json = {};
      json['statusName'] = status.name;
      const groupItem = [];
      this.taskList.map((task) => {
        if (task.statusId == status.id) {
          groupItem.push(task);
        }
      })
      json['groupItem'] = groupItem;
      groupArr.push(json);
    })
    this.finalTaskArray = groupArr;
    this.sharedService.hideLoading();
    console.log(groupArr);
  }
  setPriority(value) {
    this.priorityList.map((priority) => {
      if (Number(priority.id) === Number(value)) {
        this.priorityColor = priority.color;
      }
    })
  }
  getdrpstatusdetails() {
    const userdata = this.UserManagementService.getCurrentUserData();
    const agencyId = userdata.agencyId;

    this.httpCallService.get(AppSettings.getdrpstatusdetails + '?AgencyId=' + agencyId).subscribe((data: any) => {
      if (data.dataList.length > 0) {
        this.Statuslist = data.dataList;
        this.statusId = this.Statuslist[0]['id'];
      }
    },
      (error: any) => {
        this.sharedService.hideLoading();
      });
  }
  getWorkerList() {
    this.httpCallService.get(AppSettings.getprojectworkerslist + '?projectId=' + this.projectId).subscribe((res) => {
      this.workerList = res.dataList;
    })
  }
  submitTaskForm() {
    this.submitted = true;
    console.log('Submit', this.taskDataForm, this.selectedItems, this.taskPriority)
    if (this.taskDataForm.valid && this.taskPriority !== '' && this.selectedItems.length !== 0) {

      const formValues = this.taskDataForm.value;
      console.log(formValues)
      let data = {};
      const tagArray = [];
      let url;
      this.selectedItems.map((ele) => {
        tagArray.push(ele.id)
      })
      data = {
        "projectId": Number(this.projectId),
        "task": formValues.task,
        "estimatedHours": formValues.estimate_time,
        "statusId": Number(this.taskStatus),
        "projectMileStoneId": 0,
        "loginId": this.userID,
        "tagId": tagArray.toString(),
        "workerId": Number(formValues.worker),
        "taskDescription": formValues.description,
        "agencyId": this.agencyId,
        "priorityId": Number(this.taskPriority),
        // "estimatedHours": formValues.estimatedHours
      }
      if (this.addModalFlag) {
        url = AppSettings.insertprojecttaskdetails;
        data['id'] = 0;
      } else {
        url = AppSettings.UpdateProjectTask;
        data['id'] = this.editTaskData.id;
      }
      console.log(data)
      this.sharedService.showLoading();
      this.httpCallService.post(url, data).subscribe((data: any) => {
        this.sharedService.hideLoading();
        console.log(this.addUploadedfiles)
        if (this.addUploadedfiles.length > 0) {
          const formData = new FormData();
          for (let files of this.addUploadedfiles) {
            formData.append('file', files);
          }
          formData.append('ProjectTaskId', data.id);
          formData.append('ProjectId', this.projectId);
          this.uploadFile(formData);
        }
        //this.taskForm.reset();
        this.taskDataForm.reset();
        this.submitted = false;
        this.htmlAddModal.hide();
        this.toastrService.success("Task Submitted Successfully.");
        this.taskList = [];
        this.getProjectTask(this.projectId)

      },
        (error: any) => {
          this.sharedService.hideLoading();
        });
    } else {
      if (this.selectedItems.length === 0) {
        this.toastrService.error('Please Select Task Priority ');
      } else {
        this.toastrService.error('Please Select Task Priority');
      }
    }
  }
  showTabContent(id, value) {
    this.logData = [];
    $('.content').removeClass('active');
    $('#' + id).addClass('active');
    $('input[type=radio]').removeAttr('checked');
    $('#tab1').attr('checked', 'checked');
    this.logValue = value;
    this.getTaskLog();
  }
  deleteComment(id, comment) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this comment?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sharedService.showLoading();
        const body = {
          id: id,
          projectTaskId: this.editTaskData.id,
          projectId: this.editTaskData.projectId,
          comment: comment.comment
        }
        this.httpCallService.post(AppSettings.DeleteProjectComment, body).subscribe((data: any) => {
          this.sharedService.hideLoading();
          this.toastrService.success(data.message);
          this.getTaskLog();
          // this.getProjectTask(this.projectId)
          // setTimeout(() => {
          //   this.addCommentInList();
          //   this.toastrService.success(data.message);
          // }, 1500)


        }, (err: any) => {
          this.sharedService.showLoading();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
  readUrl(event, task) {
    this.sharedService.showLoading();
    const fileToUpload = event.target.files;
    const formData = new FormData();
    for (let file of fileToUpload) {
      formData.append('file', file);
    }
    formData.append('ProjectTaskId', task.id);
    formData.append('ProjectId', task.projectId);
    this.uploadFile(formData);
  }
  enterComment() {
    this.sharedService.showLoading();
    const userdata = this.UserManagementService.getCurrentUserData();
    if (this.comment !== '' && this.comment !== undefined && this.comment !== null) {
      const json = {
        "id": 0,
        "projectTaskId": this.editTaskData.id,
        "projectId": this.editTaskData.projectId,
        "comment": this.comment,
        "createdBy": 0,
        "name": userdata.userName,
        "createdDate": new Date(),
        // "imagePath": ""
      }
      this.httpCallService.post(AppSettings.AddTaskComment, json).subscribe((data: any) => {
        this.sharedService.hideLoading();
        this.comment = '';
        this.getTaskLog();
        this.toastrService.success(data.message);
        // this.getProjectTask(this.projectId)
        // setTimeout(() => {
        //   this.addCommentInList();
        //   this.toastrService.success(data.message);
        // }, 1500)

      }, (error: any) => {
        this.sharedService.hideLoading();
      });
    }
  }
  addCommentInList() {
    this.taskList.map((task) => {
      if (task.id === this.editTaskData.id) {
        this.editTaskData = task;
      }
    })
  }
  changeTaskStatus(value) {
    if (!this.addModalFlag) {
      this.sharedService.showLoading();
      this.httpCallService.post(AppSettings.UpdateTaskStatus + '?projectId=' + this.editTaskData.projectId + '&taskId=' + this.editTaskData.id + '&statusId=' + value, null).subscribe((data: any) => {
        this.sharedService.hideLoading();
        if (data) {
          this.toastrService.success(data.message);
          this.taskList = [];
          this.getProjectTask(this.projectId)
        }
      },
        (error: any) => {
          this.sharedService.hideLoading();
        });
    } else {
      this.statusId = value;
    }
  }
  uploadFileByEditTaskModal(event) {
    console.log(this.addModalFlag)
    if (!this.addModalFlag) {
      const fileToUpload = event.target.files;
      const formData = new FormData();
      for (let file of fileToUpload) {
        formData.append('file', file);
      }
      formData.append('ProjectTaskId', this.editTaskData.id);
      formData.append('ProjectId', this.editTaskData.projectId);
      this.uploadFile(formData);
    } else {
      this.addUploadedfiles = event.target.files
    }
  }
  uploadFile(formData) {
    this.sharedService.showLoading();
    this.httpCallService.post(AppSettings.FileUploadByTask, formData).subscribe((data: any) => {
      this.sharedService.hideLoading();
      console.log(data)
      this.addUploadedfiles = [];
      this.toastrService.success(data.message);
    }, (error: any) => {
      this.sharedService.hideLoading();
    });
  }
  editComment(comment) {
    comment['editCommentFlag'] = true;
    console.log(comment);
    this.editCommentContent = comment;
  }
  editCommentData(value) {
    console.log(this.editCommentContent, value);
    const body = {
      id: this.editCommentContent.id,
      projectTaskId: this.editTaskData.id,
      projectId: this.editTaskData.projectId,
      comment: value
    }
    this.httpCallService.post(AppSettings.EditProjectComment, body).subscribe((data: any) => {
      this.sharedService.hideLoading();
      this.editCommentContent['editCommentFlag'] = false;
      this.toastrService.success(data.message);
      this.getTaskLog();
      this.toastrService.success(data.message);
      // this.getProjectTask(this.projectId)
      // setTimeout(() => {
      //   this.addCommentInList();
      //   this.toastrService.success(data.message);
      // }, 1500)
    }, (err: any) => {
      this.sharedService.showLoading();
    })
  }
  selectWorker(event) {
    this.workerList.map((ele) => {
      if (Number(ele.id) === Number(event.target.value)) {
        this.assigneeName = ele.name;
      }
    })
  }
  getTaskLog() {
    console.log(this.logValue);
    this.httpCallService.get(AppSettings.TaskWorkLog + '?Logtype=' + this.logValue + '&Page=' + this.pageNumber + '&taskId=' + this.editTaskData.id).subscribe((data: any) => {
      console.log(data);
      this.paginationData = data.data.paginationDetails.nextPage;
      this.logData = this.logData.concat(data.data.resultList);
    })
  }
  viewMore() {
    this.pageNumber = this.pageNumber + 1;
    this.getTaskLog();
  }
  viewMoreTask() {
    this.taskPageNumber = this.taskPageNumber + 1;
    this.getProjectTask(this.projectId)
  }
  downloadURI(uri, name) {
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name);
    link.setAttribute('target', '_blank');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  deleteFile(id, file) {
    const body = {
      id: id,
      projectTaskId: this.editTaskData.id,
      projectId: this.editTaskData.projectId,
      filename: file.filename,
      filepath: file.filepath
    }
    this.httpCallService.post(AppSettings.DeleteProjectFile, body).subscribe((data: any) => {
      console.log(data);
      this.fileList.splice(this.fileList.indexOf(id), 1);
      // this.paginationData = data.data.paginationDetails.nextPage;
      // this.logData = this.logData.concat(data.data.resultList);
    })
  }
}