import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/route";
import connectDB from "./config/database";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import statusTypeModel from "./models/statusTypeModel";
import { Requser } from "./types/type";
import dns from "dns";


dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    // local
    origin: ["http://localhost:3000", "http://localhost:3001"],
    // production
    // origin: [
    //     'https://tirupatitravel.in',
    //    'https://cms.tirupatitravel.in',
    // ],

    credentials: true, // Allow credentials to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);


/*
|--------------------------------------------------------------------------
| Trust Proxy
|--------------------------------------------------------------------------
*/

app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| MongoDB Connection Middleware
|--------------------------------------------------------------------------
|
| Every request will make sure MongoDB is connected before
| going to the API routes.
|
*/

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

if (process.env.SESSION_SECRET) {
  const mongoUrl =
    process.env.SERVER_TYPE === "staging"
      ? process.env.STAGING_MONGODB_URL
      : process.env.MONGODB_URL;

  if (!mongoUrl) {
    console.error("❌ MongoDB URL missing for session store");
  }

  const expressSessionOptions: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    },

    store: MongoStore.create({
      mongoUrl: mongoUrl!,
      collectionName: "user_session",
    }),
  };

  app.use(expressSession(expressSessionOptions));
}

/*
|--------------------------------------------------------------------------
| Other Middleware
|--------------------------------------------------------------------------
*/

app.use(express.static("public"));

app.use(cookieParser());

app.use(helmet());

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api", userRouter);

/*
|--------------------------------------------------------------------------
| Database Status
|--------------------------------------------------------------------------
*/

app.get("/db-status", async (req, res) => {
  try {
    const connection = mongoose.connection;

    const state = connection.readyState;

    if (state !== 1 || !connection.db) {
      return res.status(503).json({
        success: false,
        database: "Not Connected",
        readyState: state,
      });
    }

    await connection.db.admin().ping();

    return res.json({
      success: true,
      database: "Connected",
      readyState: state,
      host: connection.host,
      databaseName: connection.name,
      ping: "OK",
    });
  } catch (error: any) {
    console.error("DB Status Error:", error);

    return res.status(503).json({
      success: false,
      database: "Connection Error",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Home
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Node.js server!");
});

/*
|--------------------------------------------------------------------------
| Status Type Config
|--------------------------------------------------------------------------
*/

app.get("/api/config/statustype", async (req, res) => {
  try {
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

    await statusTypeModel.create({
      status_type: "ACCOUNT DELETED",
      status_type_id: 999,
    });

    return res.status(200).json({
      success: true,
      message: "Status types created successfully",
    });
  } catch (error: any) {
    console.error("Status Type Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Export Express App
|--------------------------------------------------------------------------
*/

export default app;