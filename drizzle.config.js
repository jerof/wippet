/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://wippet_owner:OvScC4XwRTP7@ep-old-snow-a203372q.eu-central-1.aws.neon.tech/wippet?sslmode=require",
  },
};
