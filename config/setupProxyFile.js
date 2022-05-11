const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/socket.io/", {
      target: "http://localhost:5000/",
      ws: true,
    })
  );
};