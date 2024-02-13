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

// Login page
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

// Handle local authentication
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/auth/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      const redirectUrl = user.role === "admin" ? "/auth/admin" : "/dashboard";
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});

// GitHub authentication route
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
      if (err) return next(err);
      const redirectUrl = user.role === "admin" ? "/auth/admin" : "/dashboard";
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});

// Admin page with session information
router.get("/admin", ensureAuthenticated, isAdmin, (req, res) => {
  const store = req.sessionStore;

  if (store.all) {
    store.all((error, sessions) => {
      if (error) {
        console.error("Error fetching sessions:", error);
        return res.redirect("/login");
      }
      res.render("admin", { user: req.user, sessions });
    });
  }
});

// Handle session revocation
router.post(
  "/admin/revoke/:sessionId",
  ensureAuthenticated,
  isAdmin,
  (req, res) => {
    const { sessionId } = req.params;
    const store = req.sessionStore;

    store.destroy(sessionId, (err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Failed to revoke session");
      }

      if (store.all) {
        store.all((error, sessions) => {
          if (error) {
            console.error("Error fetching sessions:", error);
            return res
              .status(500)
              .send("Failed to fetch sessions after revocation.");
          }
          res.render("admin", {
            user: req.user,
            message: "Session revoked successfully",
            sessions,
          });
        });
      }
    });
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  });
});

export default router;
