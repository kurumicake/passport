import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";
import passportMiddleware from "./middleware/passportMiddleware";

const port = process.env.port || 8000;

const app = express();
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my cat meow",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

app.use((req, res, next) => {
  console.log("-------------------------------Start---------------------------------");
  console.log(`🫥 Your session ID is: `);
  console.log(req.sessionID);
  console.log("---------------------------------");
  console.log(`👩‍🎓 User details are: `);
  console.log(req.user);
  console.log("---------------------------------");
  console.log("🤏🏼 Entire session object:");
  console.log(req.session);
  console.log("---------------------------------");
  console.log(`🐱 Session details are: `);
  console.log((req.session as any).passport);
  console.log("-------------------------------Finish---------------------------------");
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
