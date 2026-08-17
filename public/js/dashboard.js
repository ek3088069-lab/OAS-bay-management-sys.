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

  document.getElementById("customersCard").classList.toggle("hidden", !permissions.showCustomers);
  document.getElementById("vehiclesCard").classList.toggle("hidden", !permissions.showVehicles);
  document.getElementById("servicesCard").classList.toggle("hidden", !permissions.showServices);
  document.getElementById("serviceRegCard").classList.toggle("hidden", !permissions.showServiceRegistration);
  document.getElementById("techniciansCard").classList.toggle("hidden", !permissions.showTechnicians);
  document.getElementById("inventoryCard").classList.toggle("hidden", !permissions.showInventory);
  document.getElementById("paymentsCard").classList.toggle("hidden", !permissions.showPayments);
  document.getElementById("reportsCard").classList.toggle("hidden", !permissions.showReports);
  document.getElementById("settingsCard").classList.toggle("hidden", !permissions.showSettings);
  document.getElementById("quickServiceCard").classList.toggle("hidden", !permissions.showQuickServiceEntry);
  document.getElementById("activityLogCard").classList.toggle("hidden", !permissions.showActivityLog);

  document.getElementById("customersBox").classList.toggle("hidden", !permissions.showCustomers);
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
