import express from "express";
import passport from "passport";
import {
  forwardAuthenticated,
  ensureAuthenticated,
} from "../middleware/checkAuth";
import flash from "express-flash";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();
router.use(flash());

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

// Local authentication route with manual redirection
router.post("/login", (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/auth/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect based on user role
      const redirectUrl = user.role === "admin" ? "/auth/admin" : "/dashboard";
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});

// GitHub authentication route with manual redirection
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", (err, user) => {
    if (err || !user) {
      req.flash("error", "Authentication failed.");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const redirectUrl = user.role === "admin" ? "/auth/admin" : "/dashboard";
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  const store = req.sessionStore;
  // @ts-ignore
  store.all((error, sessions) => {
    if (error) {
      console.error("Error fetching sessions:", error);
      res.redirect('/login');
    } else {
      const user = req.user;

      console.log("All the sessions are:", sessions);
      res.render('admin', { sessions, user });
    }
  });
});

router.post("/admin/revoke/:sessionId", isAdmin, async (req, res) => {
  const { sessionId } = req.params; 
  const store = req.sessionStore;

  store.destroy(sessionId, (err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send({ message: "Failed to revoke session" });
    }

  // @ts-ignore
    store.all((error, sessions) => {
      if (error) {
        console.error("Error fetching sessions:", error);
        return res.status(500).send({ message: "Failed to fetch sessions after revocation." });
      }
      res.render('admin', {
        user: req.user, // Ensure this object is correctly populated
        message: "Session revoked successfully",
        sessions
        // Include other necessary data for the admin view here
      });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  });
});
export default router;
