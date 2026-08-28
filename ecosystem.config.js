// PM2 process config for the Eclatique storefront.
// Usage on the server:  pm2 start ecosystem.config.js  &&  pm2 save
module.exports = {
  apps: [
    {
      name: "eclatique",
      cwd: __dirname,
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3000", // Secret Sitting will use a different port (e.g. 3001)
      },
      autorestart: true,
      max_memory_restart: "600M",
    },
  ],
};
