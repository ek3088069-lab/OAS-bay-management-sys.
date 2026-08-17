import User from "../models/User.mjs";
import ActivityLog from "../models/ActivityLog.mjs";
import bcrypt from "bcryptjs";

export const getRegisterForm = (req, res) => {
  res.render("registration");
};

export const getLoginForm = (req, res) => {
  res.render("login");
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, identifier, role } = req.body;
    const isEmail = identifier.includes("@");
    const userData = {
      username,
      role,
      password,
    };

    if (isEmail) {
      userData.email = identifier;
    } else {
      userData.phone = identifier;
    }
    const newUser = new User(userData);
    await newUser.save();
    res.redirect("/?signup=success");
  } catch (error) {
    res.status(400).send(`Registration failed:${error.message}`);
    console.error("Registration error:", error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).send("Username, password, and role are required");
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    
    }

    const selectedRole = role.toLowerCase();
    const userRole = String(user.role).toLowerCase();

    if (selectedRole !== userRole) {
      return res.status(401).send("Selected role does not match this account");
    }

    if (await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.userRole = user.role;
      req.session.username = user.username;
      // res.redirect('/ index')
      // await ActivityLog.create({
      //   user: user._id,
      //   username: user.username,
      //   role: user.role,
      //   action: "login",
      //   details: `${user.username} logged in successfully.`,
      // });

      res.redirect("/dashboard");
    } else {
      await ActivityLog.create({
        username,
        role: user.role,
        action: "login_failed",
        details: `Failed login attempt for ${username}.`,
      });
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.error("Error logging in", error);
  }
};

export const logoutUser = async (req, res) => {
  if (req.session?.userId) {
    await ActivityLog.create({
      user: req.session.userId,
      username: req.session.username,
      role: req.session.userRole,
      action: "logout",
      details: `${req.session.username} logged out.`,
    });
  }

  req.session.destroy(() => res.redirect("/"));
};
