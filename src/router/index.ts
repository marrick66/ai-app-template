import { createRouter, createWebHistory } from "vue-router";
import Reports from "@/views/reports/Reports.vue";
import Comparisons from "@/views/comparisons/Comparisons.vue";
import Thinking from "@/views/Thinking.vue";

const routes = [
  {
    path: "/",
    redirect: "/reports",
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
    component: Comparisons,
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
      breadcrumbs: [
        { title: "Thinking", path: "/thinking" },
      ],
    },
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
