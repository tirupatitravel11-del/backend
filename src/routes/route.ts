import express from "express";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  // getAllPermission,
  getPermissionById,
} from "../controllers/permissions";
import {
  createRole,
  deleteRole,
  deleteRolePermission,
  getCounsellors,
  getRoleById,
  getRoles,
  softDeleteRole,
  // getRoles,
} from "../controllers/role";
// import {
//   createUser,
//   getAllUsers,
//   getSingleUser,
//   getUserByRole,
//   updateregno,
//   updateUser,
// } from "../controllers/createUser";
// import { deleteUser, Login, LoginForAdmin, signout } from "../controllers/adminLogin";
import authMiddleware from "../middleware/authMiddleware";
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
import { registerUser } from "../controllers/registerUser";
import { createUserByAdmin, LoginForAdmin, signout } from "../controllers/createUserByAdmin";
import { getAllUsers, getSingleUser, getUserByRole, userLogin } from "../controllers/user";
import { changePassword,forgetPassword,resetPassword,verifyCode } from "../controllers/password";
import { changeCabTypeStatus, createUpdateCabType, deleteCabType, getAllCabType, getCabTypeDropdown, getSingleCabType, restoreCabType } from "../controllers/vehicleType.controller";
import { changeVehicleStatus, createUpdateVehicle, deleteVehicle, getAllVehicle, getSingleVehicle, getVehicleDropdown, restoreVehicle,  } from "../controllers/vehicle.controller";
import { changeStateStatus, createUpdateState, deleteState, getAllState, getSingleState, getStateDropdown, restoreState } from "../controllers/state/state.controller";
import { changeCityStatus, createUpdateCity, deleteCity, getAllCity, getCityDropdown, getSingleCity, restoreCity } from "../controllers/city/city.controller";
import { changeRouteStatus, createUpdateRoute, deleteRoute, getAllRoute, getRouteDropdown, getSingleRoute, restoreRoute } from "../controllers/route/route.controller";
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

router.post("/register-user", registerUser);
router.post("/create-user", authMiddleware, createUserByAdmin);
// router.post("/update-user", authMiddleware, updateUser);
router.post("/get-users", authMiddleware, getAllUsers);
router.post("/get-single-user", authMiddleware, getSingleUser);
router.post("/admin-login", LoginForAdmin);
router.post("/getalluserbyrole", authMiddleware, getUserByRole);
router.post("/signout", signout);
router.post("/user-login", userLogin)
// router.post("/login", Login);
// router.post("/delete-user", authMiddleware, deleteUser)
// router.post("/logout", userLogout);



// ----------------------Password---------------------------
router.post("/change-password",authMiddleware, changePassword)
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-code", verifyCode);

// ------------------role-----------------
router.post("/create-role", authMiddleware, createRole);
router.get("/get-all-role", authMiddleware, getRoles);
router.post("/get-role-by-id/:id", authMiddleware, getRoleById);
router.post("/delete-role", authMiddleware, deleteRole);
router.post("/soft-delete-role", authMiddleware, softDeleteRole);
router.post("/delete-role-permission", authMiddleware, deleteRolePermission);


// ------------------permission-----------------
router.post("/create-permission", authMiddleware, createPermission);
router.get("/get-all-permission", authMiddleware, getAllPermission);
router.post("/get-permission-by-id/:id", authMiddleware, getPermissionById);
router.post("/delete-permission", authMiddleware, deletePermission);

//---------------------cabType------------------

router.post("/create-update-cab-type",authMiddleware, createUpdateCabType);
router.post("/all-cab-type", getAllCabType);
router.post("/single-cab-type", getSingleCabType);
router.post("/delete-cab-type",authMiddleware, deleteCabType);
router.post("/restore-cab-type",authMiddleware, restoreCabType);
router.post("/change-status-cab-type",authMiddleware, changeCabTypeStatus);
router.post("/dropdown-cab-type", getCabTypeDropdown);

//---------------------vehicle------------------
router.post("/create-update-vehicle", authMiddleware,createUpdateVehicle);
router.post("/all-vehicle", getAllVehicle);
router.post("/single-vehicle", getSingleVehicle);
router.post("/delete-vehicle",authMiddleware, deleteVehicle);
router.post("/restore-vehicle",authMiddleware, restoreVehicle);
router.post("/change-status-vehicle", authMiddleware,changeVehicleStatus);
router.post("/dropdown-vehicle", getVehicleDropdown);


//---------------------states------------------
router.post("/create-update-state", authMiddleware, createUpdateState);
router.post("/all-state", getAllState);
router.post("/single-state", authMiddleware, getSingleState);
router.post("/delete-state", authMiddleware, deleteState);
router.post("/restore-state", authMiddleware, restoreState);
router.post("/change-status-state", authMiddleware, changeStateStatus);
router.post("/dropdown-state", getStateDropdown);


//--------------------city------------------
router.post("/create-update-city", authMiddleware, createUpdateCity);
router.post("/all-city", getAllCity);
router.post("/single-city", authMiddleware, getSingleCity);
router.post("/delete-city", authMiddleware, deleteCity);
router.post("/restore-city", authMiddleware, restoreCity);
router.post("/change-status-city", authMiddleware, changeCityStatus);
router.post("/dropdown-city",  getCityDropdown);


//--------------------cabRoute------------------

router.post("/create-update",authMiddleware, createUpdateRoute);
router.post("/all",getAllRoute);
router.post("/single", getSingleRoute);
router.post("/delete",authMiddleware, deleteRoute);
router.post("/restore",authMiddleware, restoreRoute);
router.post("/change-status",authMiddleware,changeRouteStatus);
router.post("/dropdown", getRouteDropdown);







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



export default router;

