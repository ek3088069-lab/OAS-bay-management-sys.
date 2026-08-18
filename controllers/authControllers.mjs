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
    console.log("SIGNUP DATA:", req.body);
    const { fullname, password, identifier, role } = req.body;
    const isEmail = identifier.includes("@");
    const userData = {
      fullname,
      role,
      password,
    };

    if (isEmail) {
      userData.email = identifier;
    } else {
      userData.phone = identifier;
    }
    const newUser = new User(userData);
    console.log("ABOUT TO SAVE USER");
    await newUser.save();
    console.log("USER SAVED SUCCESSFULLY");
    res.redirect("/login");
  } catch (error) {
    res.status(400).send(`Registration failed:${error.message}`);
    console.error("Registration error:", error);
  }
};

export const loginUser = async (req, res) => {
  try {
    //change it to identifier and password
    const { identifier, password } = req.body;
     const isEmail = identifier.includes("@");
    if (!identifier || !password) {
      return res.status(400).send("Identifier and password are required");
    }
    const query =isEmail?{email:identifier}:{phone:identifier};

    const user = await User.findOne( query );

    if (!user) {
  return res.status(401).send("Invalid credentials");
}

    if (await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.userRole = user.role;
      req.session.username = user.fullname;
      res.redirect("/dashboard");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.error("Error logging in", error);
  }
};

export const logoutUser = async (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};
