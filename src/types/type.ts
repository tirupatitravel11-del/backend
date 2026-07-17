import mongoose from "mongoose";
import { Document, Types } from "mongoose";

interface DocumentResult<T> {
  _doc: T;
}
export interface StatusType {
  status_type: string;
  status_type_id: number;
  created_at: Date;
  updated_at: Date;
  created_by: Types.ObjectId;
  updated_by: Types.ObjectId;
}
export interface Requser extends Document {
  _id: Types.ObjectId;
  email: string;
  roleId: Types.ObjectId;
}

// export interface UserPermission extends Document {
//   _id: Types.ObjectId;
//   name: string;
// };

// export interface UserRole extends Document {
//   _id: Types.ObjectId;
//   name: string;
//   permissions: UserPermission[];
// };


export interface User extends Document {
  name: string;
  email: string;
  roleId: Types.ObjectId | Role | string;
  gender:string;
  status: number;
  password?: string;
  is_login: boolean;
  isDeleted: boolean;
  token?: string;
  otp_token?: string;
  otp_attempts?: number;
  otp_verified?: boolean;
  emailStatus: "pending" | "failed" | "sent";
  socketId?: string | null;
  created_by?: Types.ObjectId | User;
  updated_by?: Types.ObjectId | User;
  created_at?: Date;
  updated_at?: Date;
}


export interface Role extends Document {
  name: string;

  permissions: Types.ObjectId[];

  created_by?: Types.ObjectId | User;

  updated_by?: Types.ObjectId | User;

  created_at?: Date;

  updated_at?: Date;
}
export interface Permission {
  name: string; // e.g., 'create_user'

  label: string; // e.g., 'Create User'

  created_by?: Types.ObjectId | User;

  updated_by?: Types.ObjectId | User;

  created_at?: Date;

  updated_at?: Date;
}

// export interface Blog {
//   _id?: Types.ObjectId;
//   title: string;
//   content: string;
//   author: string;
//   tags?: string[];
//   image?: string;
//   isPublished?: boolean;
//   created_by?: Types.ObjectId;
//   created_at?: string;
//   updated_by?: Types.ObjectId;
//   updated_at?: string;
// }
// export interface Batch {
//   _id?: Types.ObjectId;
//   name: string;
//   startDate: Date;
//   endDate: Date;
//   startTime: string;
//   endTime: string;
//   teacher: Types.ObjectId;
//   students?: Types.ObjectId[];
//   created_by?: Types.ObjectId;
//   created_at?: string;
//   updated_by?: Types.ObjectId;
//   updated_at?: string;
// }
// export interface Course {
//   _id?: Types.ObjectId;
//   name: string;
//   duration: number;
//   fee: number;
//   batch?: Types.ObjectId[];
//   created_by?: Types.ObjectId;
//   updated_by?: Types.ObjectId;
//   created_at?: string;
//   updated_at?: string;
// }



// export interface ServiceType extends DocumentResult<ServiceType>, Document {
//   serviceName: string;
//   description: string;
//   serviceSlug: string;
//   updated_by: mongoose.Schema.Types.ObjectId;
//   created_by: mongoose.Schema.Types.ObjectId;
//   updated_at: string;
//   created_at: string;
// }

// export interface BookServiceType
//   extends DocumentResult<BookServiceType>, Document {
//   service_id: mongoose.Schema.Types.ObjectId;
//   name: string;
//   email: string;
//   phone: string;
//   status: number;
//   emailStatus: "pending" | "failed" | "sent";
//   created_at: string;
//   updated_at: string;
//   // updated_by: mongoose.Schema.Types.ObjectId;
// }

// export interface userProfileType
//   extends DocumentResult<userProfileType>, Document {
//   userId: mongoose.Schema.Types.ObjectId;
//   fatharName: string;
//   motherName: string;
//   occupation: string;
//   dateofBirth: string;
//   regilion: string;
//   bloodGroup: string;
//   gender: string;
//   familyOccupation: string;
//   admissionDate: string;
//   registrationNo: string;
//   created_at: string;
//   updated_at: string;
//   updated_by: mongoose.Schema.Types.ObjectId;
// }

// export interface teacherProfileType
//   extends DocumentResult<teacherProfileType>, Document {
//   userId: mongoose.Schema.Types.ObjectId;
//   salary: number;
//   subjectSpecialization: String;
//   experience: number;
//   dateofJoining: string;
//   dateofBirth: string;
//   regilion: string;
//   bloodGroup: string;
//   gender: string;
//   created_at: string;
//   updated_at: string;
//   updated_by: mongoose.Schema.Types.ObjectId;
//   registrationNo: string;
// }

// export interface ICourse extends DocumentResult<ICourse>, Document {
//   mainCourseId: mongoose.Types.ObjectId;
//   title: string;
//   description?: string;
//   durationMonths?: number;
//   fee: number;
//   status: number;
//   orderno: number;
//   level: "Beginner" | "Intermediate" | "Advanced" | null;
//   mode: string;
//   language: string;
//   rating: number;
//   reviewsCount: number;
//   enrollments: number;
//   badge: "Best Seller" | "Top Rated" | "Featured" | "New" | "Trending" | null;
//   slug: string;
//   updatedBy: mongoose.Types.ObjectId;
//   createdBy: mongoose.Types.ObjectId;
//   created_at: Date;
//   updated_at: Date;
// }
// export interface ImainCourse extends DocumentResult<ImainCourse>, Document {
//   title: string;
//   status: number;
//   orderno: number;
//   created_at?: Date;
//   updated_at?: Date;
// }

// export interface BatchDocument extends DocumentResult<BatchDocument>, Document {
//   _id: mongoose.Types.ObjectId;
//   name: string;
//   schedule: ScheduleType;
//   endDate: Date;
// }
// export interface IEnrollment extends DocumentResult<IEnrollment>, Document {
//   batchId: mongoose.Types.ObjectId | BatchDocument;
//   userId: mongoose.Types.ObjectId;
//   courseId: mongoose.Types.ObjectId;
//   updatedBy: mongoose.Types.ObjectId;
//   enrolledStatus: String,
//   created_at: Date;
//   updated_at: Date;
// }
// export interface ScheduleType extends DocumentResult<ScheduleType>, Document {
//   days: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
//   startTime?: string; // e.g. "09:00"
//   endTime?: string; // e.g. "11:00"
// }

// export interface BatchType extends DocumentResult<BatchType>, Document {
//   name: string;
//   courseId: mongoose.Types.ObjectId;
//   teacherId: mongoose.Types.ObjectId;
//   startDate: Date;
//   endDate: Date;
//   schedule: ScheduleType;
//   status: number; // e.g. 23 = active, you can define meaning later
//   updated_by: mongoose.Types.ObjectId;
//   created_at: Date;
//   updated_at: Date;
// }

// export interface IInstallment extends DocumentResult<IInstallment>, Document {
//   userId: mongoose.Types.ObjectId;
//   dueDate: Date;
//   amount: number;
//   status: "pending" | "paid" | "failed" | "overdue" | "merged";
//   paidDate?: Date;
//   lateFee?: number;
//   stripePaymentIntentId?: string;
//   paymentMethod?: "card" | "cash" | "upi";
//   transactionId?: string;
//   verifiedBy?: mongoose.Types.ObjectId;
//   _id: mongoose.Types.ObjectId; // add this
// }

// export interface IPaymentPlan extends DocumentResult<IPaymentPlan>, Document {
//   userId: mongoose.Types.ObjectId;
//   enrollmentIds: mongoose.Types.ObjectId[];
//   totalAmount: number;
//   customerId: string;
//   initialAmount: number;
//   discountType?: "flat" | "percent" | "referral" | null;
//   discountValue?: number;
//   discountReason?: string;
//   netAmount: number;
//   paymentMode: "full" | "emi" | "custom";
//   totalDuration?: number;
//   nextDueDate?: Date;
//   // installments: IInstallment[];
//   paidAmount: number;
//   remainingAmount: number;
//   status: "active" | "completed" | "cancelled";
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface ContactUsType extends DocumentResult<ContactUsType>, Document {
//   name: string;
//   email: string;
//   phone: string;
//   emailStatus: "pending" | "failed" | "sent";
//   subject: string;
//   message: string;
//   created_at: string;
//   updated_at: string;
// }
// export interface JobApplicationByUser extends DocumentResult<JobApplicationByUser> {
//   fullName: string;
//   email: string;
//   phone: string;
//   experience: string;
//   coverLetter?: string;
//   portfolio?: string;
//   linkedIn?: string;
//   availability?: string;
//   resume?: string | null | File;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface TraningModuleType
//   extends DocumentResult<TraningModuleType>, Document {
//   courseId: mongoose.Schema.Types.ObjectId | Course | string;
//   topic: string;
//   description: string;
//   status: number;
//   order: number;
//   points: [{ text: string; order: number }];
//   created_at?: Date;
//   updated_at?: Date;
// }

// export interface ImageObject {
//   key: string;
// }

// export interface BlogSection {
//   id?: string;
//   type: "text" | "heading" | "subheading" | "list" | "image";
//   content?: string;
//   items?: string[];
//   image?: ImageObject;

//   // 🔥 RUNTIME FIELD
//   imageUrl?: string;
// }

// export interface BlogResponse {
//   _id: string;
//   title: string;
//   author: string;
//   category: string;

//   heroImage?: ImageObject | null;

//   // 🔥 RUNTIME FIELD
//   heroImageUrl?: string;

//   sections?: BlogSection[];
// }

// export interface Iblog extends DocumentResult<Iblog>, Document {
//   title: string,
//   author: string,
//   slug: string,
//   content: object, // Editor.js JSON
//   blogstatus: "draft" | "published"
//   publisheddate?: Date,
//   status: { type: number, default: 30 }
//   created_at?: Date;
//   updated_at?: Date;
//   updated_by?: mongoose.Types.ObjectId;
// }
// export interface FlashAnnouncementType
//   extends DocumentResult<FlashAnnouncementType>, Document {
//   title: string;
//   badge: string;
//   description: string;
//   startDate: Date;
//   tillDate: Date;
//   isActive: boolean;
//   priority: number;
//   status: number;
//   created_at?: string;
//   updated_at?: string;
//   updated_by?: mongoose.Types.ObjectId;
// }

// export interface leadType
//   extends DocumentResult<leadType>, Document {
//   leadId: string;
//   leadModel: string,
//   assignedUserId: mongoose.Types.ObjectId;
//   remarks: string,
//   followUpDate: Date
//   leadStatus: "new" | "inprogress" | "followup" | "converted" | "lost" | "contacted"
//   source: "trainingenquiry" | "contactus" | "JobApplication" | "bookservice" | "bannerform";
//   created_at?: string;
//   updated_at?: string;
//   updated_by?: mongoose.Types.ObjectId;
// }


// export interface IAssignTeacher extends Document {
//   batchId: mongoose.Types.ObjectId;
//   instructorId: mongoose.Types.ObjectId;
//   assignedAt: Date;
//   relievedAt?: Date;
//   isActive: boolean;
//   assignedBy?: mongoose.Types.ObjectId;
//   relievedBy?: mongoose.Types.ObjectId;
// }

// export interface Attendance extends Document {
//   courseId: Types.ObjectId;
//   batchId: Types.ObjectId;
//   students:
//   {
//     studentId: Types.ObjectId;
//     attendancestatus: "present" | "absent" | "on-leave";
//     updated_by: Types.ObjectId
//   }
//   date: Date;  // 👈 Use Date here
//   markedAt?: Date;
//   created_by?: Types.ObjectId;
//   updated_by?: Types.ObjectId;
// }

// export interface empAttendance extends Document {
//   courseId: Types.ObjectId;
//   batchId: Types.ObjectId;
//   employees:
//   {
//     userId: Types.ObjectId;
//     attendancestatus: "present" | "absent" | "on-leave";
//     updated_by: Types.ObjectId
//   }
//   date: Date;  // 👈 Use Date here
//   created_by?: Types.ObjectId;
//   updated_by?: Types.ObjectId;
// }

export interface NotificationType {
  notify_type_id: number;

  name: string;

  created_at: Date;

  updated_at: Date;
}


export interface Notification extends Document {
  user_id: Types.ObjectId;

  imported?: boolean;

  notifications: {
    user_id: string;

    data?: {
      section: string;
      data_id: string;
    };

    title: string;
    body: string;
    url: string;

    visited: boolean;
    seen: boolean;

    created_at: Date;
    updated_at: Date;
  }[];

  created_at: Date;
  updated_at: Date;
}


export interface NotificationToken extends Document {
  user_id: Types.ObjectId;

  isSignin: boolean;

  isSignin_app?: boolean;

  token?: string;

  socketID?: string;

  created_at: Date;

  updated_at: Date;
}

// export interface BannerFormType extends DocumentResult<BannerFormType>, Document {
//   name: string;
//   email: string;
//   phone: string;
//   emailStatus: "pending" | "failed" | "sent";
//   subject: string;
//   message: string;
//   created_at: string;
//   updated_at: string;
// }
// export interface LeadAssignmentHistoryModel extends DocumentResult<LeadAssignmentHistoryModel>, Document {
//   leadId: Types.ObjectId;
//   leadModel: "trainingenquiry" | "contactus" | "JobApplication" | "bookservice" | "bannerform";

//   assignedUserId: Types.ObjectId;
//   assignedBy: Types.ObjectId;

//   leadStatus: "new" | "inprogress" | "followup" | "contacted" | "converted" | "lost";

//   remarks?: string;
//   followUpDate?: Date;

//   actionType: "assigned" | "updated" | "reassigned";

//   created_at?: string;
//   updated_at?: string;

//   updated_by?: Types.ObjectId;
// }

// export interface noticeType extends DocumentResult<noticeType>, Document {
//   title:string,
//   message:string,
//   noticeType:string,
//   visibleTo:string[],
//   batchId: mongoose.Schema.Types.ObjectId,
//   courseId: mongoose.Schema.Types.ObjectId,
//   createdBy: mongoose.Schema.Types.ObjectId,
//   startDate: Date,
//   expiryDate: Date,
//   status: number
// }