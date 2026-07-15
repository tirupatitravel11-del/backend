import express from "express";
// import {
//   createPermission,
//   deletePermission,
//   getAllPermission,
//   // getAllPermission,
//   getPermissionById,
// } from "../controllers/permissions";
// import {
//   createRole,
//   deleteRole,
//   deleteRolePermission,
//   getCounsellors,
//   getRoleById,
//   getRoles,
//   // getRoles,
// } from "../controllers/role";
// import {
//   createUser,
//   getAllUsers,
//   getSingleUser,
//   getUserByRole,
//   updateregno,
//   updateUser,
// } from "../controllers/createUser";
// import { deleteUser, Login, LoginForAdmin, signout } from "../controllers/adminLogin";
// import authMiddleware from "../middleware/authMiddleware";
// import { validateUpload } from "../middleware/validateUpload"
// import { addAbortListener } from "events";
// import { blogPublishStatus, createBlog, deleteBlog, editBlog, getAllBlogs, getAllBlogsAdmin, getSingleBlog, getSingleBlogAdmin, restoreBlog } from "../controllers/blog";
// import { addClass, addStudentToClass, deleteClass, getClass, removeStudentFromClass, } from "../controllers/class";
// import {
//   assignInstructorToBatch,
//   createOrUpdateBatch,
//   deleteBatch,
//   getAllBatches,
//   getBatches,
//   getSingleBatch,
//   restoreBatch,
// } from "../controllers/batch";
// import { exportAttendanceExcel, getStudentMonthlyAttendance, updateAttendance } from "../controllers/attendance";
// import { changePassword, forgetPassword, resetPassword, verifyCode } from "../controllers/user";
// import { addservice, updateService } from "../controllers/services";
// import { createOrUpdateCourse, createOrUpdateMainCourse, deleteCourse, deleteMainCourseTitles, getAllCourses, getAllCoursesAtt, getAllCoursesByMainCourse, getAllCoursesDropdown, getAllCourseTitles, getMainCourseTitles, getSingleCourse, restoreCourse, restoreMainCourseTitles } from "../controllers/course";
// import { getEnrolledStudents, studentEnrollment, deleteStudentEnrollment } from "../controllers/enrollment";
// import { createPaymentPlan, payInstallment } from "../controllers/payment";
// import { bookService } from "../controllers/bookservice";
// import { addContact } from "../controllers/contactus";
// import { uploadResume } from "../middleware/uploadResume";
// import { addJobApplication } from "../controllers/jobApplication";
// import { getAttendanceByDate, getBatchStudents, getEmpAttendanceByDate, getEmployeeAttendanceReport, getEmployees, getStudentAttendanceReport, markEmployeeAttendance, markStudentAttendance } from "../controllers/attendance";
// import { deleteActivity, deleteUserActivities, getAllActivities, getUserActivities, trackActivity } from "../controllers/activity";
// import { createTrainingCourseModule, getTrainingCourseModuleById, getAllTrainingCourseModules, deleteTrainingCourseModule, restoreTrainingCourseModule, updateTrainingCourseModule, bulkCreateModules, globalSettings, getTrainingCourseModuleByIdadmin } from "../controllers/trainingCourseModules";
// import { createTrainingEnrollOrEnquiry, getTrainingEnquiries } from "../controllers/trainingEnquiry.controller";
import multer from "multer";
// import { deleteR2Image, getObjectUrl, uploadToR2 } from "../controllers/cloudR2";
// import { createBlog, deleteBlogtwo, getBlogById, getBlogs, updateBlog } from "../controllers/blogtwo";
// import { getEmailAccounts } from "../controllers/email"
// import { createOrUpdateFlash, deleteFlash, getAllFlashAdmin, getAllFlashUser, publishFlash, restoreFlash, unpublishFlash } from "../controllers/flashAnnouncement";
// import { assignLeads, getLeadsById, updateLeadStatus, getLeadHistory, getLeadsbyLeadModel } from "../controllers/leads";
// import { createOrUpdateProfile, getUserProfile } from "../controllers/profile";
// import { deleteTemplate, getAllTemplates, getTemplateById, getTemplates, restoreTemplate, updateTemplate, uploadTemplate } from "../controllers/emailtemplate";
// import {createUpdateEmailAccounts, deleteEmailAccount, getAllEmailAccounts, getEmailAccounts, restoreEmailAccount} from "../controllers/emailaccounts"
// import {emailService, getEmailLogs} from "../controllers/email"
// import { checknotifytoken, getusernotification, notificationToken, updatenotificationseen, updatenotificationvisited } from "../controllers/notification/notification";
// import { createOrUpdateBanner, deleteBanner, deleteBannerImage, disableShowForm, disableShowFormOnly, enableShowForm, enableShowFormOnly, getBannerForUser, getBanners, publishBanner, restoreBanner, unpublishBanner } from "../controllers/bannerController";
// import { addBannerForm } from "../controllers/bannerForm";
// import { getBatchesAssigned, getDasboardStats, getmonthAttStats, getStuEnrolledBatches, getYearStats, getYearStatsstudent } from "../controllers/dashboard";
// import { createUpdateNotice, getNotice, getNoticeCount } from "../controllers/notice";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// router.post("/create-user",checkPermission('create_user'), createUser)
// router.post("/test-user", testUser);

// router.post("/create-user", authMiddleware, createUser);
// router.post("/update-user", authMiddleware, updateUser);
// router.post("/get-users", authMiddleware, getAllUsers);
// router.post("/get-single-user", authMiddleware, getSingleUser);
// router.post("/admin-login", LoginForAdmin);
// router.post("/login", Login);
// router.post("/delete-user", authMiddleware, deleteUser)
// router.post("/logout", userLogout);
// router.post("/create-permission", authMiddleware, createPermission);
// router.post("/delete-role-permission", authMiddleware, deleteRolePermission);
// router.get("/get-all-permission", authMiddleware, getAllPermission);
// router.post("/get-permission-by-id/:id", authMiddleware, getPermissionById);
// router.post("/delete-permission", authMiddleware, deletePermission);
// router.post("/create-role", authMiddleware, createRole);
// router.get("/get-all-role", authMiddleware, getRoles);
// router.post("/get-role-by-id/:id", authMiddleware, getRoleById);
// router.post("/delete-role", authMiddleware, deleteRole);


//--------------------courses------------------
// router.post("/create-update-course", authMiddleware, createOrUpdateCourse);
// router.get("/get-all-courses-by-maincourse", getAllCoursesByMainCourse);
// router.post("/get-all-course", getAllCourses);
// router.post("/get-single-course", getSingleCourse);
// router.post("/get-courses", authMiddleware, getAllCoursesDropdown);
// router.post("/delete-course", authMiddleware, deleteCourse);
// router.post("/restore-course", authMiddleware, restoreCourse);
// router.post("/create-update-main-course", authMiddleware, createOrUpdateMainCourse);
// router.post("/get-all-course-titles", authMiddleware, getAllCourseTitles);
// router.post("/get-main-course-titles", authMiddleware, getMainCourseTitles);
// router.post("/delete-main-course-title", authMiddleware, deleteMainCourseTitles);
// router.post("/restore-main-course-title", authMiddleware, restoreMainCourseTitles);

//--------------------course modules-------------------
// router.post("/create-course-module", authMiddleware, createTrainingCourseModule);
// router.post("/update-course-module", authMiddleware, updateTrainingCourseModule);
// router.post("/get-course-modules", authMiddleware, getAllTrainingCourseModules);
// router.post("/get-course-modules-by-id", getTrainingCourseModuleById);
// router.post("/get-course-modules-by-id-admin", getTrainingCourseModuleByIdadmin);

// router.post("/delete-course-module", authMiddleware, deleteTrainingCourseModule);
// router.post("/restore-course-module", authMiddleware, restoreTrainingCourseModule);
// router.post("/create-bluk-modules", bulkCreateModules)
// router.post("/settings", authMiddleware, globalSettings)

//--------------------batches------------------

// router.post("/create-update-batch", authMiddleware, createOrUpdateBatch);
// router.post("/get-batches", authMiddleware, getBatches);
// router.post("/get-all-batches", authMiddleware, getAllBatches);
// router.post("/get-single-batch", authMiddleware, getSingleBatch);
// router.post("/delete-batch", authMiddleware, deleteBatch);
// router.post("/restore-batch", authMiddleware, restoreBatch);
// router.post("/assign-instructor", authMiddleware, assignInstructorToBatch);

//--------------------enrollment------------------

// router.post("/create-update-enrollment", authMiddleware, studentEnrollment);
// router.post("/get-enrolled-students", authMiddleware, getEnrolledStudents);
// router.post("/delete-enrollment", authMiddleware, deleteStudentEnrollment);


//-----------------------student-----------------------------
// router.post("/add-student", authMiddleware, addStudentToClass);
// router.post("/delete-user", authMiddleware, deleteUserByRole);
// router.post("/getallstudents", authMiddleware, getUserByRole);

// router.post("/update-attendance", authMiddleware, updateAttendance);
// router.post("/student-attendance-report", authMiddleware, getStudentMonthlyAttendance);
// router.post("/export/excel", authMiddleware, exportAttendanceExcel);


//-----------user login-------------------

// router.post("/create-payment-plan", createPaymentPlan);
// router.post("/create-payment-installment", payInstallment);

// router.post("/user-login", userLogin)
//----------------------Password---------------------------

// router.post("/change-password",authMiddleware, changePassword)
// router.post("/forget-password", forgetPassword);
// router.post("/reset-password", resetPassword);
// router.post("/verify-code", verifyCode);

//--------------service------------------
// router.post("/add-service", authMiddleware, addservice);
// router.post("/update-service", authMiddleware, updateService); // Assuming the same controller handles both add and update for simplicity
// router.post("/book-service", bookService);
// router.post("/signout", signout);

//--------------contact------------------
// router.post("/add-contact", addContact);
// router.post("/apply", uploadResume.single("resume"), addJobApplication);

//--------------activity------------------
// router.post("/activity-track", trackActivity);
// router.get("/get-all-activity", getAllActivities);
// router.post("/get-user-activity", getUserActivities);       // userId in body
// router.delete("/delete-single-activity", deleteActivity);            // id in body
// router.delete("/delete-single-user-all-activity", deleteUserActivities);


//----------training enquiry----------------
// router.post("/training-enquiry-enroll", createTrainingEnrollOrEnquiry);
// router.get("/get-training-enquiries", authMiddleware, getTrainingEnquiries);
// router.post("/delete-training-enquiry", authMiddleware, deleteTrainingEnquiry);

//------------------upload images---------------------
// router.post("/upload-file", authMiddleware, upload.single("file"), uploadToR2);
// router.post("/get-presignedurl", authMiddleware, getObjectUrl);
// router.post("/delete-image", authMiddleware, deleteR2Image);

//------------------------blog------------------------
// router.post("/create-blog", authMiddleware, createBlog)
// router.post("/edit-blog", authMiddleware, editBlog)
// router.post("/delete-blog", authMiddleware, deleteBlog)
// router.post("/restore-blog", authMiddleware, restoreBlog)
// router.post("/get-blog-admin", authMiddleware, getSingleBlogAdmin)
// router.post("/get-blog", getSingleBlog)
// router.post("/blog-status", authMiddleware, blogPublishStatus)
// router.post("/get-blog-by-id", getBlogbyId)
// router.post("/get-all-blog-admin", authMiddleware, getAllBlogsAdmin)
// router.post("/get-all-blogs", getAllBlogs)

//------------------------leads------------------------

// router.post("/get-all-training-leads-admin", authMiddleware, getLeadsbyLeadModel);
// router.post("/get-all-training-leads-by-id", authMiddleware, getTrainingLeadsById);
// router.post("/get-all-contactus-leads-admin", authMiddleware, getContactUsLeads);
// router.post("/get-all-services-leads-admin", authMiddleware, getServicesLeads);
// router.post("/get-all-job-leads-admin", authMiddleware, getJobApplicationLeads);
// router.post("/get-all-banner-form-leads-admin", authMiddleware, getBannerFormLeads);

// router.post("/assign-leads", authMiddleware, assignLeads);
// router.post("/get-leads-by-id", authMiddleware, getLeadsById);
// router.post("/lead-status", authMiddleware, updateLeadStatus);
// router.post("/get-counsellors", authMiddleware, getCounsellors);
// router.post("/lead-history", authMiddleware, getLeadHistory);

// router.put("/editlead/:id", authMiddleware, editLead);
// router.delete("/deletelead/:id", authMiddleware, deleteLead);



//------------------------flashAnnouncement------------------------

// router.post("/create-update-flash", createOrUpdateFlash)
// router.post("/get-all-flash", getAllFlashAdmin)
// router.get("/get-all-flash-user", getAllFlashUser)
// router.post("/delete-flash", deleteFlash);
// router.post("/restore-flash", restoreFlash);
// router.post("/publish-flash", publishFlash);
// router.post("/unpublish-flash", unpublishFlash);

//--------------------attendance--------------------------------
// router.post("/mark-student-attendance", authMiddleware, markStudentAttendance);
// router.post("/get-batch-students", authMiddleware, getBatchStudents);
// router.post("/get-attendance-by-date", authMiddleware, getAttendanceByDate);
// router.post("/get-employees", authMiddleware, getEmployees);
// router.post("/mark-employee-attendance", authMiddleware, markEmployeeAttendance);
// router.post("/get-emp-attendance-by-date", authMiddleware, getEmpAttendanceByDate);
// router.post("/get-student-attendance-report", authMiddleware, getStudentAttendanceReport);
// router.post("/get-emp-attendance-report", authMiddleware, getEmployeeAttendanceReport);
// router.post("/update-reg-no", updateregno);


//---------------------profile-------------------------
// router.post("/get-user-profile", authMiddleware, getUserProfile);
// router.post("/create-update-user-profile", authMiddleware, createOrUpdateProfile);


//----------------------email Accounts---------------------------
// router.post("/create-update-email-accounts", authMiddleware, createUpdateEmailAccounts)
// router.post("/get-email-accounts", authMiddleware, getEmailAccounts)
// router.post("/get-all-email-accounts", authMiddleware, getAllEmailAccounts)
// router.post("/delete-email-account", authMiddleware, deleteEmailAccount)
// router.post("/restore-email-account", authMiddleware, restoreEmailAccount)


//----------------------emailTemplates---------------------------

// router.post("/create-update-email-template", authMiddleware, uploadTemplate);
// router.post("/get-email-templates", authMiddleware, getTemplates);
// router.post("/get-all-email-templates", authMiddleware, getAllTemplates);
// router.post("/template-by-id", authMiddleware, getTemplateById);
// router.post("/update-template", authMiddleware, updateTemplate);
// router.post("/delete-template", authMiddleware, deleteTemplate);
// router.post("/restore-template", authMiddleware, restoreTemplate);

//----------------------email Service---------------------------

// router.post("/email-service", authMiddleware, emailService)
// router.post("/get-email-logs", authMiddleware, getEmailLogs)

//----------------------banner---------------------------

// router.post("/create-update-banner", createOrUpdateBanner);
// router.post("/get-banners", getBanners);
// router.post("/delete-banner", deleteBanner);
// router.post("/restore-banner", restoreBanner);
// router.post("/delete-banner-image", deleteBannerImage);
// router.post("/publish-banner",authMiddleware, publishBanner);
// router.post("/unpublish-banner",authMiddleware, unpublishBanner);
// router.post("/get-banner-for-user", getBannerForUser);
// router.post("/enable-show-form",authMiddleware, enableShowForm);
// router.post("/disable-show-form",authMiddleware, disableShowForm);
// router.post("/enable-show-form-only",authMiddleware, enableShowFormOnly);
// router.post("/disable-show-form-only",authMiddleware, disableShowFormOnly);

//----------------------Notification API---------------------------
// router.post("/notification-token", notificationToken)
// router.post("/checknotify-token", checknotifytoken)
// router.post("/get-user-notification/:page", getusernotification)
// router.post("/update-notification-seen", updatenotificationseen)
// router.post("/update-notification-visited", updatenotificationvisited)

//----------------------banner form---------------------------

// router.post("/add-banner-form", addBannerForm);


//----------------------dashboard apis -----------------------
// router.post("/get-dashboard-stats", authMiddleware, getDasboardStats)
// router.post("/get-month-attendance-stats", authMiddleware, getmonthAttStats)
// router.post("/get-overall-att-percentage", authMiddleware, getYearStats)
// router.post("/get-overall-student-att-percentage", authMiddleware, getYearStatsstudent)
// router.post("/get-batches-assigned", authMiddleware, getBatchesAssigned)
// router.post("/get-student-enrolled-batches", authMiddleware, getStuEnrolledBatches)
// router.post("/get-all-courses-by-assigned-user", authMiddleware, getAllCoursesAtt)


//-------------------------notice---------------------------
// router.post("/create-update-notice", authMiddleware, createUpdateNotice);
// router.post("/get-notices", authMiddleware, getNotice);
// router.post("/get-notice-count", authMiddleware, getNoticeCount);
// router.post("/delete-notice", authMiddleware, deleteNotice);
// router.post("/restore-notice", authMiddleware, restoreNotice);
// router.post("/publish-notice", authMiddleware, publishNotice);
// router.post("/unpublish-notice", authMiddleware, unpublishNotice);

export default router;

