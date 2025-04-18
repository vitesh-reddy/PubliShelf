export const loginGetController = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role == "buyer") res.redirect("/buyer/dashboard");
    else if (req.user.role == "publisher") res.redirect("/publisher/dashboard");
    else if (req.user.role == "admin") res.redirect("/admin/dashboard");
    else res.redirect("/manager/dashboard");
  } else res.render("auth/login");
};

export const loginPostController = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      if (info.message == "user not found")
        return res.status(403).json({ key: "user not found" });
      else if (info.message == "incorrect password")
        return res.status(401).json({ key: "incorrect password" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.redirect("/buyer/dashboard");
      return res.status(200);
    });
  })(req, res, next);
};
