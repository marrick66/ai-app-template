import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { startMockServiceWorker } = await import("./mock/browser");
    await startMockServiceWorker();
  }

  const app = createApp(App);

  app.use(router);

  app.mount("#app");
}

bootstrap();
