export default {
  http: {
    port: process.env.VIRTUAL_PORT || 80,
    portBehindDevProxy: process.env.BEHIND_DEV_PROXY_PORT || 8080
  },
  webpack: {
    dev: {
      port: process.env.WEBPACK_DEV_PORT || 8081
    }
  }
};
