import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Reports from "../views/Reports.vue";
import ReportComparisons from "../views/ReportComparisons.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/reports", component: Reports },
  { path: "/reports/comparisons", component: ReportComparisons },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
