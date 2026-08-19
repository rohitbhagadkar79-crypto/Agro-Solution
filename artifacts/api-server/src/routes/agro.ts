import { Router, type IRouter } from "express";
import {
  CreateCropBody,
  CreateCropResponse,
  CreateSoilReportBody,
  CreateSoilReportResponse,
  GetDashboardResponse,
  ListAlertsResponse,
  ListCropsResponse,
  ListReportsResponse,
  ListSoilReportsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const weather = {
  temperature: 29,
  condition: "Partly cloudy",
  humidity: 68,
  rainProbability: 42,
  windSpeed: 14,
  forecast: [
    { day: "Today", condition: "Partly cloudy", high: 31, low: 24, rain: 42 },
    { day: "Thu", condition: "Light rain", high: 29, low: 23, rain: 68 },
    { day: "Fri", condition: "Cloudy", high: 28, low: 22, rain: 55 },
    { day: "Sat", condition: "Sunny", high: 32, low: 23, rain: 18 },
    { day: "Sun", condition: "Sunny", high: 33, low: 24, rain: 12 },
    { day: "Mon", condition: "Cloudy", high: 30, low: 23, rain: 31 },
    { day: "Tue", condition: "Light rain", high: 28, low: 22, rain: 62 },
  ],
};

const crops = [
  { id: 1, name: "Cotton", variety: "Bunny Bt", area: "4.5 acres", stage: "Flowering", sowingDate: "18 Jun 2026", health: "Needs attention" },
  { id: 2, name: "Soybean", variety: "JS 335", area: "3 acres", stage: "Vegetative", sowingDate: "02 Jul 2026", health: "Good" },
  { id: 3, name: "Wheat", variety: "Lok-1", area: "2 acres", stage: "Sowing soon", sowingDate: "Planned Oct 2026", health: "Planning" },
];

const alerts = [
  { id: 1, kind: "rain", title: "Rain expected Thursday", description: "Rain probability is 68%. Hold irrigation for the next 24 hours.", severity: "medium", time: "2 hours ago" },
  { id: 2, kind: "humidity", title: "Watch for leaf spot", description: "High humidity may increase disease risk in flowering cotton.", severity: "high", time: "Today" },
  { id: 3, kind: "irrigation", title: "Irrigation window open", description: "Early morning is the best time to irrigate your soybean field.", severity: "low", time: "Yesterday" },
];

const reports = [
  { id: 1, crop: "Cotton", date: "18 Aug 2026", disease: "Leaf spot", diseaseConfidence: 89, nutrient: "Possible nitrogen deficiency", nutrientConfidence: 82, summary: "Brown spots and yellowing around affected areas. Confirm with a lab test before applying fertilizer.", imageUrl: null },
  { id: 2, crop: "Soybean", date: "04 Aug 2026", disease: "No clear disease found", diseaseConfidence: 71, nutrient: "Possible magnesium deficiency", nutrientConfidence: 64, summary: "Visual indication only. Monitor new growth and confirm nutrient status through soil or tissue testing.", imageUrl: null },
];

const soilReports = [
  { id: 1, date: "12 Aug 2026", field: "North field · Cotton", nitrogen: 248, phosphorus: 18, potassium: 312, ph: 7.2, organicCarbon: 0.68, status: "Balanced" },
];

router.get("/dashboard", (_req, res) => {
  res.json(GetDashboardResponse.parse({
    farmerName: "Rohit",
    location: "Nashik, Maharashtra",
    weather,
    activeCrops: crops,
    alerts,
    recentReports: reports,
  }));
});

router.get("/crops", (_req, res) => res.json(ListCropsResponse.parse(crops)));
router.post("/crops", (req, res) => {
  const input = CreateCropBody.parse(req.body);
  const crop = { ...input, id: crops.length + 1, health: "New crop" };
  crops.unshift(crop);
  res.status(201).json(CreateCropResponse.parse(crop));
});

router.get("/reports", (_req, res) => res.json(ListReportsResponse.parse(reports)));
router.get("/soil-reports", (_req, res) => res.json(ListSoilReportsResponse.parse(soilReports)));
router.post("/soil-reports", (req, res) => {
  const input = CreateSoilReportBody.parse(req.body);
  const report = { ...input, id: soilReports.length + 1, date: "19 Aug 2026", status: "Review needed" };
  soilReports.unshift(report);
  res.status(201).json(CreateSoilReportResponse.parse(report));
});
router.get("/alerts", (_req, res) => res.json(ListAlertsResponse.parse(alerts)));

export default router;