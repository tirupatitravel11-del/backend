import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/route";
import connectDB from "./config/database";
import bodyParser from "body-parser";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import http from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import statusTypeModel from "./models/config/statusTypeModel";
import { Requser } from "./types/type";
import notificationTokenModel from "./models/config/notification/notificationTokenModel";
// import { redisConnection } from "./redisConnection/redis";
// import { sanitizeMiddleware } from "./utils/sanitize";




dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;



app.use(cors(
  {
     // local
    origin: ["http://localhost:3000", 'http://localhost:3001'],
    // staging
    // origin: [
    //    'https://staging.cyberous.in',
    //    'https://stagingadmin.cyberous.in',
    // ],
   
    credentials: true, // Allow credentials to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }
));

const io = new Server(server, {
  cors: {
  // local
    origin: ["http://localhost:3000", 'http://localhost:3001'],
    // staging
    // origin: [
    //    'https://staging.cyberous.in',
    //    'https://stagingadmin.cyberous.in',
    // ],

    methods: ["GET", "POST"],
    credentials: true,
  }, path: '/api/tirupatitravels'
});


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("user-online", async (data) => {
    console.log("User-online received:", data.user_id, socket.id);

    if (!data?.user_id) return; // safety check

    await notificationTokenModel.findOneAndUpdate(
      { user_id: data.user_id },
      { socketID: socket.id, isSignin: true },
      { upsert: true }
    );

    console.log("Socket saved in DB for user:", data.user_id);
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    await notificationTokenModel.findOneAndUpdate(
      { socketID: socket.id },
      { isSignin: false, socketID: null }
    );
  });
});

app.set("io", io);

app.set("trust proxy", 1);


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 request per IP
  message: "Too many requests, try again later"
});

// app.use((req, res, next) => {
//   if (req.path.startsWith("/api/cyberous")) {
//     return next();
//   }
//   globalLimiter(req, res, next);
// });



// app.use(globalLimiter);
let exporesJSONConfig: bodyParser.OptionsUrlencoded = { extended: true }

app.use(express.json(exporesJSONConfig));

declare module "express-session" {
  export interface SessionData {
    token: string;
  }
}
declare global {
  namespace Express {
    interface Request {
      user?: Requser;
    }
  }
}

// declare module "express" {
//   export interface Request { user?: User; }
// }

if (process.env.SESSION_SECRET) {
  const expressSessionOptions: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    //   sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    //   domain:".cyberous.in"
    },
    store: MongoStore.create({
      mongoUrl:
        process.env.SERVER_TYPE === "staging"
          ? process.env.STAGING_MONGODB_URL
          : process.env.MONGODB_URL,
      collectionName: "user_session",
    }),
  };
  app.use(expressSession(expressSessionOptions));
}
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());
// app.use(sanitizeMiddleware);
app.use(helmet());
app.use("/api", userRouter);




// app.get("/", (req, res) => {
//   console.error("welcome api"); // stderr usually prints immediately
//   res.send("Hello from TypeScript + Node.js server!");
// });

// // app.use("/api/stripe", stripewebhook);

app.get("/api/config/statustype", async (req, res) => {
  await statusTypeModel.deleteMany({});
  await statusTypeModel.create({
    status_type: "USER ACTIVE",
    status_type_id: 1,
  });
  await statusTypeModel.create({
    status_type: "USER INACTIVE",
    status_type_id: -1,
  });
  await statusTypeModel.create({
    status_type: "USER BLOCKED",
    status_type_id: -18,
  });
  // await statusTypeModel.create({ status_type: "USER PROFILE", status_type_id: 8 });
  // await statusTypeModel.create({ status_type: "USER PROFILE", status_type_id: 9 });

  await statusTypeModel.create({
    status_type: "ACCOUNT DELETED",
    status_type_id: 999,
  });
//   await statusTypeModel.create({
//     status_type: "ACTIVE SERVICE",
//     status_type_id: 11,
//   });
//   await statusTypeModel.create({
//     status_type: "INACTIVE SERVICE",
//     status_type_id: 12,
//   });
//   await statusTypeModel.create({
//     status_type: "BLOG ACTIVE",
//     status_type_id: 13,
//   });
//   await statusTypeModel.create({
//     status_type: "BLOG DELETED",
//     status_type_id: 14,
//   });
//   await statusTypeModel.create({
//     status_type: "COURSE ACTIVE",
//     status_type_id: 20,
//   });
//   await statusTypeModel.create({
//     status_type: "COURSE DELETED",
//     status_type_id: 21,
//   });
//   await statusTypeModel.create({
//     status_type: "BATCH ACTIVE",
//     status_type_id: 22,
//   });
//   await statusTypeModel.create({
//     status_type: "BATCH DELETED",
//     status_type_id: 23,
//   });
//   await statusTypeModel.create({
//     status_type: "ENROLLMENT ACTIVE",
//     status_type_id: 24,
//   });
//   await statusTypeModel.create({
//     status_type: "ENROLLMENT DELETED",
//     status_type_id: 25,
//   });
//   await statusTypeModel.create({
//     status_type: "ENROLLMENT COMPLETED",
//     status_type_id: 26,
//   });
//   await statusTypeModel.create({
//     status_type: "TRAINING COURSE MODULES ACTIVE",
//     status_type_id: 27,
//   });
//   await statusTypeModel.create({
//     status_type: "TRAINING COURSE MODULES INACTIVE",
//     status_type_id: 28,
//   });
//   await statusTypeModel.create({
//     status_type: "MAIN COURSE ACTIVE",
//     status_type_id: 30,
//   });
//   await statusTypeModel.create({
//     status_type: "MAIN COURSE DELETED",
//     status_type_id: 31,
//   });

//   await statusTypeModel.create({ status_type: "STRIPE", status_type_id: 32 });
//   await statusTypeModel.create({ status_type: "CASH", status_type_id: 33 });
//   await statusTypeModel.create({ status_type: "UPI", status_type_id: 34 });
//   await statusTypeModel.create({
//     status_type: "FLASH ACTIVE",
//     status_type_id: 40,
//   });
//   await statusTypeModel.create({
//     status_type: "FLASH DELETED",
//     status_type_id: -40,
//   });
//   await statusTypeModel.create({
//     status_type: "LEADS ACTIVE",
//     status_type_id: 38,
//   });
//   await statusTypeModel.create({
//     status_type: "LEADS DELETED",
//     status_type_id: 39,
//   });
//   await statusTypeModel.create({
//     status_type: "EMAIL ACCOUNTS ACTIVE",
//     status_type_id: 41,
//   });
//   await statusTypeModel.create({
//     status_type: "EMAIL ACCOUNTS DELETED",
//     status_type_id: -41,
//   });
//   await statusTypeModel.create({
//     status_type: "EMAIL TEMPLATE ACTIVE",
//     status_type_id: 42,
//   });
//   await statusTypeModel.create({
//     status_type: "EMAIL TEMPLATE DELETED",
//     status_type_id: -42,
//   });
//   await statusTypeModel.create({
//     status_type: "BANNER ACTIVE",
//     status_type_id: 43,
//   });
//   await statusTypeModel.create({
//     status_type: "BANNER DELETED",
//     status_type_id: -43,
//   });
//   await statusTypeModel.create({
//     status_type: "NOTICE ACTIVE",
//     status_type_id: 44,
//   });
//   await statusTypeModel.create({
//     status_type: "NOTICE DELETED",
//     status_type_id: -44,
//   });
});

// app.get("/api/config/notificationtype", async (req, res) => {
//   await notificationTypeModel.create({ name: "COUNSELLOR ASSIGN", notification_type_id: 101 });



//   res.status(200).json({ message: "Notification type created" });
// });
// app.get("/api/", (req: Request, res: Response) => {
//   res.status(200).json("you are connected to backend")
// })


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});