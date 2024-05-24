export const transportConfig = () => ({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) ?? 587,
    secure: (process.env.SMTP_IS_SECURE === "true") ?? false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    },
});