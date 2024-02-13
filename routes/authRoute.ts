import express from "express";
import passport from "passport";
import { forwardAuthenticated, ensureAuthenticated} from "../middleware/checkAuth";
import flash from "express-flash";
import { fetchAllSessions } from "../middleware/sessionMiddleware";

const router = express.Router();
router.use(flash());

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

// Local authentication route with manual redirection
router.post("/login", (req, res, next) => {
  const sessionId = req.sessionID;
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


router.get('/admin', ensureAuthenticated, (req, res) => {
  fetchAllSessions((error, sessions) => {
    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).render('error', { message: 'Error fetching sessions' });
    }
    
    // Render the admin page with session data
    res.render('admin', {
      user: req.user,
      sessions: sessions
    });
  });
});

router.post("/admin/revoke/:sessionId", (req, res) => {

})

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
