import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";
import flash from "express-flash";
import session from "express-session";


const router = express.Router();
router.use(flash());

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// router.get("/github", passport.authenticate("oauth2"));

// router.get(
//   "/github/callback",
//   passport.authenticate("oauth2", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     res.redirect("/dashboard");
//   }
// );

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
