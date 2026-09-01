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
import statusTypeModel from "./models/statusTypeModel";
import { Requser } from "./types/type";
import notificationTokenModel from "./models/notification/notificationTokenModel";
// import { redisConnection } from "./redisConnection/redis";
// import { sanitizeMiddleware } from "./utils/sanitize";

import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(
  cors({
    // local
    // origin: ["http://localhost:3000", "http://localhost:3001"],
    // production
    origin: [
        'https://tirupatitravel.in/',
       'https://cms.tirupatitravel.in/',
    ],

    credentials: true, // Allow credentials to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

const io = new Server(server, {
  cors: {
    // local
    // origin: ["http://localhost:3000", "http://localhost:3001"],
    // production
    origin: [
          'https://tirupatitravel.in/',
       'https://cms.tirupatitravel.in/',
    ],

    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/api/tirupatitravel",
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("user-online", async (data) => {
    console.log("User-online received:", data.user_id, socket.id);

    if (!data?.user_id) return; // safety check

    await notificationTokenModel.findOneAndUpdate(
      { user_id: data.user_id },
      { socketID: socket.id, isSignin: true },
      { upsert: true },
    );

    console.log("Socket saved in DB for user:", data.user_id);
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    await notificationTokenModel.findOneAndUpdate(
      { socketID: socket.id },
      { isSignin: false, socketID: null },
    );
  });
});

app.set("io", io);

app.set("trust proxy", 1);

// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 100, // 100 request per IP
//   message: "Too many requests, try again later"
// });

// app.use((req, res, next) => {
//   if (req.path.startsWith("/api/tirupatitravels")) {
//     return next();
//   }
//   globalLimiter(req, res, next);
// });

// app.use(globalLimiter);
// let exporesJSONConfig: bodyParser.OptionsUrlencoded = { extended: true }

// app.use(express.json(exporesJSONConfig));
app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  }),
);
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
      secure: true,
      httpOnly: true,
        // sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
        domain:".tirupatitravel.in"
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
// app.use(express.json());
app.set("trust proxy", 1);
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());
// app.use(sanitizeMiddleware);
app.use(helmet());
app.use("/api", userRouter);

app.get("/", (req, res) => {
  console.error("welcome api"); // stderr usually prints immediately
  res.send("Hello from TypeScript + Node.js server!");
});

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


// hgjgrr