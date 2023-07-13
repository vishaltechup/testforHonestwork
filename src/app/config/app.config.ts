export const AppSettings = Object.freeze({
    localStorage_keys: {
        token: 'token',
        userData: 'userData',
        verify: 'verify',
        sessionTimeOut: 'sessionTimeOut',
        session: 'session',
        forgotData: 'forgotData',
    },
    MaPapi: {
        key: "AIzaSyDZZeGlIGUIPs4o8ahJE_yq6pJv3GhbKQ8"
    },
    getworkerdetail: '/Worker/getworkerdetail',
    getworkerdetailsbyid: '/Worker/getuserdetailsbyid',
    insertworkerdetails: '/Worker/insertworkerdetails',
    UploadProfilePic: '/Worker/uploadprofilepic',
    getNoteList: '/Note/getprojectnotes',
    getProjectList: '/Project/getprojectslist',
    updateworkerdetais: '/Worker/updateworkerdetails',
    getDropDownSkillsURL: '/Skill/getdrpskilldetails',
    insertpersonaltodo: '/Worker/insertworkerpersonaltodo',
    Changeyourpassword: '/User/changepassword',
    getPersonalTodo: '/Worker/getPersonalTodo',
    insertProjectDetails: '/Project/insertprojectdetails',
    sendMail: '/User/sendagencyinvitationcodeotp',
    verifyOtp: '/User/verifycodeotp',
    forgotPassword: '/User/forgetpassword',
    getDropDownHourlyRatesURL: '/Skill/getdrphourlyratedetails',
    getDropDownProjectsURL: '/Project/getdrpprojectListbyuserid',
    getfreelanceworkerdetail: '/Worker/getfreelanceworkerdetail',
    deleteWorkerdetails: '/Worker/deletedworkerdetails',
    updatemarkcomplete: '/Worker/updatemarkcomplete',
    getdrpworkerdetail: '/Worker/getdrpworkerdetails',
    GetWorkerDetailsByDashBoard: '/Worker/getworkersbyagencyandproject',
    ConfirmNoteDetails: '/Note/confirmnotedetails',
    ConvetToTaskDetails: '/Task/converttotaskdetails',
    ReplyToNoteDetails: '/Note/replaytonotedetails',
    getprojectdeliverables: '/Project/getprojectdeliverables',
    removeprojectdeliverables: '/Project/removedeliverables',
    confirmprojectdeliverable: '/Project/confirmdeliverables',
    Uploaddeliverablefile: '/Project/insertprojectdeliverables',
    GetProjectScopeDetails: '/Project/getprojectscopedetails',
    Uploadscopedocumentfile: '/Project/InsertProjectScopedocuments',
    getprojectscopedocuments: '/Project/getprojectscopedocuments',
    deletescopedocuments: '/Project/deletescopedocuments',
    getdrptechstacklist: '/Project/getdrptechstacklist',
    gettasklistbyprojectid: '/Task/gettasklistbyprojectid',
    getdrpstatusdetails: '/Status/getdrpstatusdetails',
    getdrptagdetails: '/Tag/getdrptagdetails',
    insertprojecttaskdetails: '/Task/insertprojecttaskdetails',
    updateprojecttaskstatus: '/Project/updateprojecttaskstatus',
    addprojectmilestone: '/Project/addprojectmilestone',
    getprojectmilestonelist: '/Project/getprojectmilestonelist',
    getprojectworkerslist: '/Project/getprojectworkerslist',
    updateprojectscopedetails: '/Project/updateprojectscopedetails',
    insertprojecttexhstack: '/Project/insertprojecttexhstack',
    getdrpprojecttechstacklist: '/Project/getdrpprojecttechstacklist',
    getAgencyDetails: '/Agency/getagencydetailsbyid',
    getprojectdatails: '/Project/getprojectdatails',
    insertnotedetails: '/Note/insertnotedetails',
    updateagencydetais: '/Agency/updateagencydetails',
    getworker: '/Worker/getworkerdetailsbyid',
    getworkersActivitylist: '/Project/getworkersActivitylist',
    gettimesheetthisweekdata: '/Project/gettimesheetthisweekdata',
    getdashboardstatistics: '/Project/getdashboardstatistics',
    getprojectsatatics: '/Project/getprojectsatatics',
    gettodaydatewiseappandscreen: '/Project/gettodaydatewiseappandscreen',
    getdatewiseworkeractivty: '/Project/getdatewiseworkeractivty',
    GetAllTimesheetandPayment: '/Project/getalltimesheetandpayment',
    getprojectmilestonelistByProjectID: '/Project/getprojectmilestonelistByProjectID',
    updateprojectmilestone: '/Project/updateprojectmilestone',
    deleteMileStone: '/Project/deleteMileStone',
    getclientbyproject: '/Client/getclientbyproject',
    insertprojectclient: '/Client/addclienttoproject',
    deleteprojectclient: '/Client/deleteprojectclient',
    getnotereply: '/Note/getnotereply',
    getskillbyagency: '/Skill/getskilldetail',
    insertskilldetails: '/Skill/insertskilldetails',
    deletedskilldetails: '/Skill/deletedskilldetails',
    updateskilldetails: '/Skill/updateskilldetails',
    insertstatusdetails: '/Status/insertstatusdetails',
    updatestatusdetails: '/Status/updatestatusdetails',
    deletedstatusdetails: '/Status/deletedstatusdetails',
    getstatusdetail: '/Status/getstatusdetail',
    UpdateTagDetails: '/Tag/UpdateTagDetails',
    inserttagdetails: '/Tag/inserttagdetails',
    deletedtagdetails: '/Tag/deletedtagdetails',
    gettagdetail: '/Tag/gettagdetail',
    UpdatePriorityDetails: '/Priority/updateprioritydetails',
    insertprioritydetails: '/Priority/insertprioritydetails',
    deletedprioritydetails: '/Priority/deleteprioritydetails',
    getprioritydetail: '/Priority/getallprioritydetails',
    gettechStackdetail: '/TechStack/gettechStackdetail',
    inserttechStackdetails: '/TechStack/inserttechStackdetails',
    updatetechStackdetails: '/TechStack/updatetechStackdetails',
    deletedtechStackdetails: '/TechStack/deletedtechStackdetails',
    assignproject: '/Project/assignproject',
    GetDrpCurrency: '/Tag/getdrpcurrency',
    getworkersweekenddata: '/Project/getworkersweekenddata',
    DeleteAssignWorker: '/Project/deleteassignworker',
    FilterSuggestedWorker: '/Worker/getsuggestedworkersearch',
    GetAllPaymentHistory: '/PaymentHistory/getallpaymenthistory',
    AddPaymentHistory: '/PaymentHistory/insertpaymenthistory',
    DeletePaymentHistory: '/PaymentHistory/deletepaymenthistory',
    UpdatePaymentHistory: '/PaymentHistory/updatepaymenthistory',
    CloseTask: '/Project/closetask',
    InviteAgency: '/ProjectAgencyInvite/inviteagency',
    ListOfInviteAgency: '/ProjectAgencyInvite/listofinviteagency',
    RemoveInviteAgency: '/ProjectAgencyInvite/removeinviteagency',
    FileUploadByTask: '/Task/fileuploadbytask',
    AddTaskComment: '/Task/insertprojectcomment',
    UpdateTaskStatus: '/Project/updateprojecttaskstatus',
    DeleteProjectComment: '/Task/deleteprojectcomment',
    EditProjectComment: '/Task/updateprojectcomment',
    GetDrpPriorityList: '/Priority/getdrpprioritydetails',
    UpdateProjectTask: '/Task/updateprojecttask',
    TaskWorkLog: '/Task/gettasklogentry',
    DeleteProjectFile: '/Task/deleteprojectfile',
    Deleteproject: '/Project/deleteproject',
});