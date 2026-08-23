import ServiceRecord from "../models/ServiceRecord.mjs";

const TIME_ZONE = "Africa/Kampala";
const dateKey = (date) => {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
};

const displayDate = (key) => {
  const [year, month, day] = key.split("-");
  return `${day}/${month}`;
};

export const getReportsPage = async (req, res) => {
  try {
    const records = await ServiceRecord.find({})
      .sort({ serviceDate: -1 })
      .lean();

    const totalBilled = records.reduce(
      (sum, record) => sum + Number(record.totalServiceCost || 0),
      0,
    );
    const collectedRevenue = records.reduce(
      (sum, record) => sum + (record.isPaid ? Number(record.totalServiceCost || 0) : 0),
      0,
    );
    const outstandingRevenue = totalBilled - collectedRevenue;

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return dateKey(date);
    });
    const dailyRevenue = new Map(days.map((day) => [day, 0]));

    for (const record of records) {
      const day = dateKey(new Date(record.serviceDate));
      if (record.isPaid && dailyRevenue.has(day)) {
        dailyRevenue.set(
          day,
          dailyRevenue.get(day) + Number(record.totalServiceCost || 0),
        );
      }
    }

    const chart = {
      labels: days.map(displayDate),
      values: days.map((day) => dailyRevenue.get(day)),
    };

    const categoryRevenue = new Map();
    for (const record of records) {
      const category = record.serviceCategory || "Uncategorised";
      const current = categoryRevenue.get(category) || { revenue: 0, jobs: 0 };
      current.jobs += 1;
      if (record.isPaid) current.revenue += Number(record.totalServiceCost || 0);
      categoryRevenue.set(category, current);
    }

    const categorySummary = [...categoryRevenue.entries()]
      .map(([category, totals]) => ({ category, ...totals }))
      .sort((a, b) => b.revenue - a.revenue);

    res.render("reports", {
      session: req.session,
      chart,
      totalBilled,
      collectedRevenue,
      outstandingRevenue,
      totalServices: records.length,
      categorySummary,
      recentRecords: records.slice(0, 8),
    });
  } catch (error) {
    console.error("Error loading reports:", error);
    res.status(500).send("Unable to load reports.");
  }
};
