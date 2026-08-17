import express from "express";
import User from '../models/User.mjs';
import ActivityLog from '../models/ActivityLog.mjs';

const router = express.Router();

const normalizeRoleName = (role = '') => {
  const value = String(role).trim().toLowerCase();

  if (value === 'admin') return 'Admin';
  if (value === 'senior' || value === 'senior technician') return 'Senior technician';
  if (value === 'technician') return 'Technician';

  return 'Technician';
};

const dashboardPermissionsByRole = {
  Admin: {
    showCustomers: true,
    showVehicles: true,
    showServices: true,
    showServiceRegistration: true,
    showTechnicians: true,
    showInventory: true,
    showPayments: true,
    showReports: true,
    showSettings: true,
    showQuickServiceEntry: true,
    showActivityLog: true,
  },
  "Senior technician": {
    showCustomers: true,
    showVehicles: true,
    showServices: true,
    showServiceRegistration: true,
    showTechnicians: true,
    showInventory: true,
    showPayments: true,
    showReports: true,
    showSettings: false,
    showQuickServiceEntry: true,
    showActivityLog: false,
  },
  Technician: {
    showCustomers: false,
    showVehicles: true,
    showServices: true,
    showServiceRegistration: false,
    showTechnicians: false,
    showInventory: true,
    showPayments: false,
    showReports: false,
    showSettings: false,
    showQuickServiceEntry: false,
    showActivityLog: false,
  },
};

const requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.redirect('/?login=true');
  }

  next();
};

const requireRole = (allowedRoles = []) => (req, res, next) => {
  const role = normalizeRoleName(req.session?.userRole || 'Technician');

  if (!allowedRoles.includes(role)) {
    return res.status(403).send('You do not have permission to access this page.');
  }

  next();
};

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/home', (req, res) => { // new
  res.render('index');
});

router.get('/dashboard', requireAuth, (req, res) => {
  try {
    const role = normalizeRoleName(req.session.userRole || 'Technician');
    const permissions = dashboardPermissionsByRole[role] || dashboardPermissionsByRole.Technician;

    res.render('dashboard', {
      session: req.session,
      role,
      permissions,
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

router.get('/technicians', requireAuth, requireRole(['Admin', 'Senior technician']), async (req, res) => {
  try {
    const technicians = await User.find({}, 'username role').sort({ username: 1 });
    const role = normalizeRoleName(req.session.userRole || 'Technician');

    res.render('technicians', {
      session: req.session,
      role,
      technicians,
    });
  } catch (error) {
    console.error('Error loading technicians:', error);
    res.status(500).send('Error loading technician list');
  }
});

router.get('/activity', requireAuth, requireRole(['Admin']), async (req, res) => {
  try {
    const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(100);
    const role = normalizeRoleName(req.session.userRole || 'Technician');

    res.render('activity', {
      session: req.session,
      role,
      logs,
    });
  } catch (error) {
    console.error('Error loading activity logs:', error);
    res.status(500).send('Error loading activity logs');
  }
});

//full route path is got by combining the path in app.use(..) and the path in router.get(...)
// /index/home


// router.post('/signup', (req, res) => { // new
//     console.log(req.body);
//   res.send('registered successfully');
// });

export default router;
