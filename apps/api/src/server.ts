import { createApp } from "./app";
import { config, assertProviderConfigured } from "./config";

assertProviderConfigured();

const app = createApp();

app.listen(config.port, () => {
  console.log(`[api] listening on port ${config.port} (provider: ${config.aiProvider})`);
});
