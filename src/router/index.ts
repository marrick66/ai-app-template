import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Reports from "@/views/Reports.vue";
import ReportComparisons from "@/views/ReportComparisons.vue";
import Thinking from "@/views/Thinking.vue";

const routes = [
  {
    path: "/",
    component: Home,
    meta: {
      breadcrumbs: [{ title: "Home", path: "/" }],
    },
  },
  {
    path: "/reports",
    component: Reports,
    meta: {
      breadcrumbs: [
        { title: "Home", path: "/" },
        { title: "SEC Reports", path: "/reports" },
      ],
    },
  },
  {
    path: "/reports/comparisons",
    component: ReportComparisons,
    meta: {
      breadcrumbs: [
        { title: "Home", path: "/" },
        { title: "SEC Reports", path: "/reports" },
        { title: "Comparisons", path: "/reports/comparisons" },
      ],
    },
  },
  {
    path: "/thinking",
    component: Thinking,
    meta: {
      breadrumbs: [{ title: "Thinking", path: "/thinking" }],
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
