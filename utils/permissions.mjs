// Normalize user role names
export const normalizeRoleName = (role = "") => {
  const value = String(role).trim().toLowerCase();

  if (value === "admin") return "Admin";
  if (value === "senior" || value === "senior technician") {
    return "Senior technician";
  }
  if (value === "technician") return "Technician";

  return "Technician";
};

// Dashboard permissions for each role
export const dashboardPermissions = {
  Admin: {
    showServices: true,
    showServiceRegistration: true,
    showTechnicians: true,
    showInventory: true,
    showPayments: true,
    showReports: true,
    showQuickServiceEntry: true,
    showActivityLog: true,
  },

  "Senior technician": {
    showServices: true,
    showServiceRegistration: true,
    showTechnicians: true,
    showInventory: true,
    showPayments: true,
    showReports: true,
    showQuickServiceEntry: true,
    showActivityLog: false,
  },

  Technician: {
    showServices: true,
    showServiceRegistration: true,
    showTechnicians: false,
    showInventory: true,
    showPayments: false,
    showReports: false,
    showQuickServiceEntry: true,
    showActivityLog: false,
  },
};

