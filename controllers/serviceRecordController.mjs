import User from "../models/User.mjs";
import Inventory from "../models/Inventory.mjs";
import ServiceRecord from "../models/ServiceRecord.mjs";
import ActivityLog from "../models/ActivityLog.mjs";

const services = [
  {
    category: "Lubricants & filters",
    name: "Engine oil and filter service",
    price: 50000,
  },
  {
    category: "Lubricants & filters",
    name: "Gearbox oil and filter service",
    price: 75000,
  },
  { category: "Brake service", name: "Brake fluid service", price: 40000 },
  { category: "Brake service", name: "Brake pad replacement", price: 100000 },
  { category: "Wheel care", name: "Wheel alignment", price: 60000 },
  { category: "Wheel care", name: "Wheel balancing", price: 45000 },
  {
    category: "General repairs",
    name: "Greasing and minor repairs",
    price: 35000,
  },
  { category: "Parts sales", name: "Service and repair parts", price: 0 },
];

export const getServiceRecordForm = async (req, res) => {
  try {
    const technicians = await User.find(
      { role: { $regex: "technician", $options: "i" } },
      "fullname role",
    )
      .sort({ fullname: 1 })
      .lean();
    const inventoryItems = await Inventory.find({}, "ItemName Quantity")
      .sort({ ItemName: 1 })
      .lean();

    res.render("addservice", {
      services,
      technicians,
      inventoryItems,
      today: new Date().toISOString().slice(0, 10),
      session: req.session,
    });
  } catch (error) {
    console.error("Error loading service record form:", error);
    res.status(500).send("Unable to load the service record form.");
  }
};

export const createServiceRecord = async (req, res) => {
  try {
    const {
      customerName,
      numberPlate,
      serviceCategory,
      serviceName,
      serviceDate,
      technicianName,
      stockUsed,
      totalServiceCost,
    } = req.body;
    const cost = Number(totalServiceCost);

    if (
      !customerName ||
      !numberPlate ||
      !serviceCategory ||
      !serviceName ||
      !serviceDate ||
      !technicianName ||
      !Number.isFinite(cost) ||
      cost < 0
    ) {
      req.flash("error", "Please complete every service-record field.");
      return res.redirect("/services/register");
    }

    const serviceRecord = await ServiceRecord.create({
      customerName,
      numberPlate,
      serviceCategory,
      serviceName,
      serviceDate,
      technicianName,
      stockUsed: stockUsed || "",
      totalServiceCost: cost,
      isPaid: req.body.isPaid === "on",
      recordedBy: req.session.userId,
    });

    await ActivityLog.create({
      user: req.session.userId,
      username: req.session.username,
      role: req.session.userRole,
      action: "service_record_created",
      details: `Registered ${serviceName} for ${numberPlate.toUpperCase()} (${customerName}); cost UGX ${cost.toLocaleString()}, ${req.body.isPaid === "on" ? "paid" : "unpaid"}.`,
    });

    req.flash(
      "success",
      `Service record for ${serviceRecord.numberPlate} was added successfully.`,
    );
    res.redirect("/services/register");
  } catch (error) {
    console.error("Error creating service record:", error);
    req.flash("error", "Unable to add the service record. Please try again.");
    res.redirect("/services/register");
  }
};
