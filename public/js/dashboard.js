const normalizeRoleName = (role = '') => {
  const value = String(role).trim().toLowerCase();

  if (value === 'admin') return 'Admin';
  if (value === 'senior' || value === 'senior technician') return 'Senior technician';
  if (value === 'technician') return 'Technician';

  return 'Technician';
};

// Role-based permissions
const dashboardPermissions = {
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

// Initialize dashboard on load
window.addEventListener("DOMContentLoaded", function () {
  applyPermissions();
  displayUserInfo();
});

function applyPermissions() {
  const userRoleElement = document.getElementById("userRole");
  const rawRole = userRoleElement?.dataset.userRole || localStorage.getItem("userRole") || "Technician";
  const userRole = normalizeRoleName(rawRole);
  const permissions = dashboardPermissions[userRole] || dashboardPermissions["Technician"];

  document.getElementById("serviceRegCard").classList.toggle("hidden", !permissions.showServiceRegistration);
  document.getElementById("techniciansCard").classList.toggle("hidden", !permissions.showTechnicians);
  document.getElementById("inventoryCard").classList.toggle("hidden", !permissions.showInventory);
  document.getElementById("paymentsCard").classList.toggle("hidden", !permissions.showPayments);
  document.getElementById("reportsCard").classList.toggle("hidden", !permissions.showReports);
  document.getElementById("quickServiceCard").classList.toggle("hidden", !permissions.showQuickServiceEntry);
  document.getElementById("activityLogCard").classList.toggle("hidden", !permissions.showActivityLog);
  document.getElementById("techniciansAvailable").classList.toggle("hidden", !permissions.showTechnicians);
  document.getElementById("inventoryBox").classList.toggle("hidden", !permissions.showInventory);
}

function displayUserInfo() {
  const userNameElement = document.getElementById("userName");
  const userRoleElement = document.getElementById("userRole");

  const fallbackUserName = userNameElement?.dataset.userName || localStorage.getItem("userName") || "User";
  const fallbackUserRole = normalizeRoleName(userRoleElement?.dataset.userRole || localStorage.getItem("userRole") || "Technician");

  if (userNameElement) {
    userNameElement.textContent = `Welcome ${fallbackUserName}`;
  }

  if (userRoleElement) {
    userRoleElement.textContent = `Logged in as: ${fallbackUserRole}`;
  }
}

function logout() {
  // Clear session data
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  // Redirect to logout
  window.location.href = "/logout";
}
