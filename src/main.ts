import './hmr';
import './main.css';
import App from './Root.svelte'

import * as Sentry from "@sentry/svelte";

Sentry.init({
  dsn: "https://fd9c77bfb38e4044964cb4c73f693103@o4505563215888384.ingest.sentry.io/4505563217395712",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", "https://tabify.app"],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 0.5, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


const app = new App({
  target: document.body
})

export default app
