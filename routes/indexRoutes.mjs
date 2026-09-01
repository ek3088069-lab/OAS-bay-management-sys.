import express from "express";
import mongoose from "mongoose";
import User from "../models/User.mjs";
import ActivityLog from "../models/ActivityLog.mjs";
import { getIndexPage } from "../controllers/indexController.mjs";
import {
  createServiceRecord,
  getServiceRecordForm,
} from "../controllers/serviceRecordController.mjs";
import { getReportsPage } from "../controllers/reportsController.mjs";
import {
  normalizeRoleName,
  dashboardPermissions,
} from "../utils/permissions.mjs";
const router = express.Router();

// const normalizeRoleName = (role = "") => {
//   const value = String(role).trim().toLowerCase();

//   if (value === "admin") return "Admin";
//   if (value === "senior" || value === "senior technician")
//     return "Senior technician";
//   if (value === "technician") return "Technician";

//   return "Technician";
// };

// const dashboardPermissionsByRole = {
//   Admin: {
//     showServices: true,
//     showServiceRegistration: true,
//     showTechnicians: true,
//     showInventory: true,
//     showPayments: true,
//     showReports: true,
//     showQuickServiceEntry: true,
//     showActivityLog: true,
//   },
//   "Senior technician": {
//     showServices: true,
//     showServiceRegistration: true,
//     showTechnicians: true,
//     showInventory: true,
//     showPayments: true,
//     showReports: true,
//     showQuickServiceEntry: true,
//     showActivityLog: false,
//   },
//   Technician: {
//     showServices: true,
//     showServiceRegistration: true,
//     showTechnicians: false,
//     showInventory: true,
//     showPayments: false,
//     showReports: false,
//     showQuickServiceEntry: true,
//     showActivityLog: false,
//   },
// };

const requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.redirect("/?login=true");
  }

  next();
};

const requireRole =
  (allowedRoles = []) =>
  (req, res, next) => {
    const role = normalizeRoleName(req.session?.userRole || "Technician");

    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .send("You do not have permission to access this page.");
    }

    next();
  };

const getLoggedInTechnicianCount = async () => {
  try {
    const activeSessions = await mongoose.connection.db
      .collection("sessions")
      .find({ expires: { $gt: new Date() } }, { projection: { session: 1 } })
      .toArray();

    const technicianIds = new Set();

    for (const document of activeSessions) {
      const storedSession =
        typeof document.session === "string"
          ? JSON.parse(document.session)
          : document.session;
      const role = normalizeRoleName(storedSession?.userRole);

      if (
        storedSession?.userId &&
        ["Technician", "Senior technician"].includes(role)
      ) {
        technicianIds.add(String(storedSession.userId));
      }
    }

    return technicianIds.size;
  } catch (error) {
    console.error("Error counting logged-in technicians:", error);
    return 0;
  }
};

router.get("/", getIndexPage);

router.get("/home", getIndexPage);

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const role = normalizeRoleName(req.session.userRole || "Technician");
    const permissions =
      dashboardPermissions[role] || dashboardPermissions.Technician;
    const activeTechnicians = await getLoggedInTechnicianCount();

    res.render("dashboard", {
      session: req.session,
      role,
      permissions,
      activeTechnicians,
    });
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

router.get(
  "/technicians",
  requireAuth,
  requireRole(["Admin", "Senior technician"]),
  async (req, res) => {
    try {
      const technicians = await User.find(
        { role: { $in: [/technician/i] } },
        "fullname role email phone",
      ).sort({ fullname: 1 });
      const role = normalizeRoleName(req.session.userRole || "Technician");

      res.render("technicians", {
        session: req.session,
        role,
        technicians,
      });
    } catch (error) {
      console.error("Error loading technicians:", error);
      res.status(500).send("Error loading technician list");
    }
  },
);

router.get("/services", requireAuth, (req, res) => {
  const role = normalizeRoleName(req.session.userRole || "Technician");
  const permissions =
    dashboardPermissions[role] || dashboardPermissions.Technician;
  const services = [
    {
      category: "Lubricants & filters",
      name: "Engine oil and filter service",
      description: "Engine oil change with an oil filter replacement.",
      price: "Engine oil: UGX 79,000-200,000; oil filter: UGX 15,000-20,000",
      icon: "🛢️",
    },
    {
      category: "Lubricants & filters",
      name: "Gearbox oil and filter service",
      description:
        "Gearbox oil and filter replacement for manual or automatic vehicles.",
      price: "Price on inspection",
      icon: "⚙️",
    },
    {
      category: "Brake service",
      name: "Brake fluid service",
      description:
        "Brake-fluid replacement to support safe braking performance.",
      price: "UGX 13,000-20,000",
      icon: "🛑",
    },
    {
      category: "Brake service",
      name: "Brake pad replacement",
      description: "Inspection and replacement of worn brake pads.",
      price: "Price on inspection",
      icon: "🛑",
    },
    {
      category: "Wheel care",
      name: "Wheel alignment",
      description: "Correct wheel angles for safer handling and tyre life.",
      price: "UGX 30,000",
      icon: "🛞",
    },
    {
      category: "Wheel care",
      name: "Wheel balancing",
      description: "Balance wheels to reduce vibration while driving.",
      price: "UGX 20,000",
      icon: "⚖️",
    },
    {
      category: "General repairs",
      name: "Greasing and minor repairs",
      description: "Lubrication and small mechanical repairs.",
      price: "Labour: UGX 20,000",
      icon: "🔧",
    },
    {
      category: "Parts sales",
      name: "Service and repair parts",
      description: "Filters, engine oil, gearbox oil, and other service parts.",
      price: "Price depends on the part",
      icon: "🧰",
    },
  ];

  res.render("services", { session: req.session, role, permissions, services });
});

router.get("/services/register", requireAuth, getServiceRecordForm);
router.post("/services/register", requireAuth, createServiceRecord);

router.get(
  "/reports",
  requireAuth,
  requireRole(["Admin", "Senior technician"]),
  getReportsPage,
);

router.get(
  "/activity",
  requireAuth,
  requireRole(["Admin"]),
  async (req, res) => {
    try {
      const logs = await ActivityLog.find({})
        .sort({ createdAt: -1 })
        .limit(100);
      const role = normalizeRoleName(req.session.userRole || "Technician");

      res.render("activity", {
        session: req.session,
        role,
        logs,
      });
    } catch (error) {
      console.error("Error loading activity logs:", error);
      res.status(500).send("Error loading activity logs");
    }
  },
);

//full route path is got by combining the path in app.use(..) and the path in router.get(...)
// /index

// router.post('/signup', (req, res) => { // new
//     console.log(req.body);
//   res.send('registered successfully');
// });

export default router;
