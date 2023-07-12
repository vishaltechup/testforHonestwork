import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NotesComponent } from './notes/notes.component';
import { LayoutComponent } from './layout.component';
import { PersonalComponent } from './personal/personal.component';
import { WorkersComponent } from './workers/workers.component';
import { AccountComponent } from './account/account.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AgencyAccountComponent } from './agency-account/agency-account.component';
import { ClientAccountComponent } from './client-account/client-account.component';
import { WorkerDetailsComponent } from './worker-details/worker-details.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TodayActivityComponent } from './today-activity/today-activity.component';
import { WorkerActivityComponent } from './worker-activity/worker-activity.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { DatePipe } from '@angular/common';
import { WorkerSkillsComponent } from './worker-skills/worker-skills.component';
import { TaskStatusComponent } from './task-status/task-status.component';
import { TaskTagComponent } from './task-tag/task-tag.component';
import { ProjectTechstackComponent } from './project-techstack/project-techstack.component';
import { DownloadComponent } from './download/download.component';
import { Title } from '@angular/platform-browser';
import { TasksComponent } from './tasks/tasks.component';
import { DateAgoPipe } from './date-ago.pipe';
import { TaskPriorityComponent } from './task-priority/task-priority.component';
import { ProjectListComponent } from './project-list/project-list.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        data: {
          title: 'Dashboard'
        },
        component: DashboardComponent
      },
      {
        path: 'project',
        loadChildren: () => import('./dashboard-layout/dashboard-layout.module').then((m) => m.DashboardLayoutModule)
      },
      {
        path: 'notes',
        data: {
          title: 'Notes'
        },
        component: NotesComponent

      },
      {
        path: 'personal',
        data: {
          title: 'Personal To Do'
        },
        component: PersonalComponent
      },
      {
        path: 'workers',
        data: {
          title: 'Workers'
        },
        component: WorkersComponent
      },
      {
        path: 'account',
        data: {
          title: 'Account'
        },
        component: AccountComponent
      },

      {
        path: 'today-activity/:productid/:workerid',
        data: {
          title: 'Today Activity'
        },
        component: TodayActivityComponent
      },

      {
        path: 'agency-account',
        data: {
          title: 'Agency Account'
        },
        component: AgencyAccountComponent
      },
      {
        path: 'client-account',
        component: ClientAccountComponent
      },
      {
        path: 'w/dashboard',
        data: {
          title: 'Dashboard',
        },
        component: WorkerActivityComponent
      }, {
        path: 'worker-skills',
        data: {
          title: 'Worker Skills'
        },
        component: WorkerSkillsComponent
      }, {
        path: 'task-status',
        data: {
          title: 'Task Status'
        },
        component: TaskStatusComponent
      }
      , {
        path: 'task-tag',
        data: {
          title: 'Task Tag'
        },
        component: TaskTagComponent
      }, {
        path: 'project-techstack',
        data: {
          title: 'Project TechStack'
        },
        component: ProjectTechstackComponent
      },
      {
        path: 'download',
        data: {
          title: 'Download'
        },
        component: DownloadComponent
      },
      {
        path: 'worker-details/:id',
        data: {
          title: 'Worker Details'
        },
        component: WorkerDetailsComponent
      },
      {
        path: 'task-list/:projectId',
        data: {
          title: 'Project Task List'
        },
        component: TasksComponent
      },
      {
        path: 'task-list',
        data: {
          title: 'Project Task List'
        },
        component: TasksComponent
      },
      {
        path: 'task-priority',
        data: {
          title: 'Task Priority'
        },
        component: TaskPriorityComponent
      },
      {
        path: 'project-list',
        data: {
          title: 'Project List'
        },
        component: ProjectListComponent
      },

    ]
  },
]

@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    NotesComponent,
    LayoutComponent,
    PersonalComponent,
    WorkersComponent,
    AccountComponent,

    AgencyAccountComponent,
    ClientAccountComponent,
    WorkerDetailsComponent,
    TodayActivityComponent,
    WorkerActivityComponent,
    // ChatRoomComponent,
    // ClientComponent,
    WorkerSkillsComponent,
    TaskStatusComponent,
    TaskTagComponent,
    ProjectTechstackComponent,
    TasksComponent,
    DownloadComponent,
    DateAgoPipe,
    TaskPriorityComponent,
    ProjectListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    CKEditorModule,
    FormsModule
  ],
  providers: [DatePipe, Title],
  exports: [DashboardComponent, SidebarComponent, HeaderComponent]
})
export class LayoutModule { }
