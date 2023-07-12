
// permission for the application based on the userRole
export default function checkPermissions(userRole: string) {
  switch (userRole.toLowerCase()) {
    case 'superadmin':
      return {
        dashboard: {
          canView: true,
        },
        workerdashboard: {
          canView: false,
        },
        notes: {
          canView: true,
        },
        workers: {
          canView: true,
        },
        personaltodo: {
          canView: false,
        },
        account: {
          canView: true,
        },
        changepassword: {
          canView: true,
        },
        newproject: {
          canView: false
        },
        agencyaccount: {
          canView: false
        },
        clientaccount: {
          canView: false
        },
        logout: {
          canView: true
        },
        scopedocument: {
          canView: false
        },
        deleverables: {
          canView: false
        },
        projectworkers: {
          canView: true
        },
        addmilestone: {
          canView: true
        },
        addtask: {
          canView: true
        },
        qoutetobuild: {
          canView: true
        },
        partnerquoted: {
          canView: true
        },
        techstackupdate: {
          canView: true
        },
        projectscopeupdate: {
          canView: true
        },
        MasterDetails: {
          canView: false
        },
        download: {
          canView: true
        },
        projectview: {
          canView: false
        }

      };
    case 'agency':
      return {
        dashboard: {
          canView: true,
        },
        workerdashboard: {
          canView: false,
        },
        notes: {
          canView: true,
        },
        workers: {
          canView: true,
        },
        personaltodo: {
          canView: true,
        },
        account: {
          canView: false,
        },
        changepassword: {
          canView: true,
        },
        newproject: {
          canView: true
        },
        agencyaccount: {
          canView: true
        },
        clientaccount: {
          canView: false
        },
        logout: {
          canView: true
        },
        scopedocument: {
          canView: false
        },
        deleverables: {
          canView: true
        },
        projectworkers: {
          canView: true
        },
        addmilestone: {
          canView: true
        },
        addtask: {
          canView: true
        },
        qoutetobuild: {
          canView: true
        },
        partnerquoted: {
          canView: true
        },
        techstackupdate: {
          canView: true
        },
        projectscopeupdate: {
          canView: true
        },
        confirmnote: {
          canView: true
        },
        agencyview: {
          canView: true
        },
        workerview: {
          canView: false
        },
        MasterDetails: {
          canView: true
        },
        download: {
          canView: true
        },
        projectview: {
          canView: false
        }

      };
    case 'worker':
      return {
        dashboard: {
          canView: false,
        },
        workerdashboard: {
          canView: true,
        },
        notes: {
          canView: true,
        },
        workers: {
          canView: false,
        },
        personaltodo: {
          canView: true,
        },
        account: {
          canView: true,
        },
        changepassword: {
          canView: true,
        },
        newproject: {
          canView: false
        },
        agencyaccount: {
          canView: false
        },
        clientaccount: {
          canView: false
        },
        logout: {
          canView: true
        },
        scopedocument: {
          canView: true
        },
        deleverables: {
          canView: false
        },
        projectworkers: {
          canView: false
        },
        addmilestone: {
          canView: false
        },
        addtask: {
          canView: false
        },
        qoutetobuild: {
          canView: false
        },
        partnerquoted: {
          canView: false
        },
        techstackupdate: {
          canView: false
        },
        projectscopeupdate: {
          canView: false
        },
        confirmnote: {
          canView: false
        },
        agencyview: {
          canView: false
        },
        workerview: {
          canView: true
        },
        MasterDetails: {
          canView: false
        },
        download: {
          canView: true
        },
        projectview: {
          canView: true
        }

      };
    case 'client':
      return {
        dashboard: {
          canView: true,
        },
        workerdashboard: {
          canView: false,
        },
        notes: {
          canView: true,
        },
        workers: {
          canView: false,
        },
        personaltodo: {
          canView: true,
        },
        account: {
          canView: false,
        },
        changepassword: {
          canView: true,
        },
        newproject: {
          canView: false
        },
        agencyaccount: {
          canView: false
        },
        clientaccount: {
          canView: true
        },
        logout: {
          canView: true
        },
        scopedocument: {
          canView: true
        },
        deleverables: {
          canView: true
        },
        projectworkers: {
          canView: true
        },
        addmilestone: {
          canView: true
        },
        addtask: {
          canView: false
        },
        qoutetobuild: {
          canView: true
        },
        partnerquoted: {
          canView: true
        },
        techstackupdate: {
          canView: false
        },
        projectscopeupdate: {
          canView: false
        },
        MasterDetails: {
          canView: false
        },
        download: {
          canView: false
        },
        agencyview: {
          canView: true
        },
        workerview: {
          canView: false
        },
        projectview: {
          canView: true
        }

      };
    default:
      break;
  }
}
