const { createProxyMiddleware } = require("http-proxy-middleware");

const cookie =
  "Hm_lvt_1db88642e346389874251b5a1eded6e3=1663571962; device_id=c80d3c419d52e0b9ac58b7e9b40b0e20; s=c51qguwmay; xq_a_token=a363cfc6d2f69487d732077cc5d6a3df1d012439; xqat=a363cfc6d2f69487d732077cc5d6a3df1d012439; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjc5NjA0OTUxMzMsImlzcyI6InVjIiwiZXhwIjoxNjY2MzIxODc3LCJjdG0iOjE2NjM3Mjk4NzcyMzUsImNpZCI6ImQ5ZDBuNEFadXAifQ.mBTey5YzLEDnMcplr-gW6vWCBPOWO1pkoV7S2346VAdrlCXhxvvXEtSv23W3WV5J92p-LpXLYMPB8xWhjqq-OH_cdSDFF7V6wopru3xE8ywlHm34bthRJGRAk-rR69dxQO3U1KazUCguOXpUufzq1kZNU8yINa2_Kq8TcWI_ayMS6ymscQKxjxAUQkckR3LVKgEMF88lRoNZYaIURgctTZVr1_3iFlP2CwzzqwGoIJlQeOCMst_UCZaDvzh0J4JBggCz2z0dRM0nIf47HJHgpZvV96YydRSmTZTobmoKUKilQTpVncDKCpG1SS85XBC6vY6HPcmCaDf5aQxmsE1dEQ; xq_r_token=c7a8eaa904028be1ecf994653e9cbfd545121fdd; xq_is_login=1; u=7960495133; bid=6a8b45ea09686f6ff06da015099197af_l8b9gs6t; snbim_minify=true; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1664524720";

module.exports = function (app) {
  //Cross Origin Handle Middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      req.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });
  app.use(
    createProxyMiddleware("/query", {
      target: "https://xueqiu.com",
      changeOrigin: true,
      secure: false,
      cookieDomainRewrite: true,
      headers: {
        cookie,
      },
    })
  );
  app.use(
    createProxyMiddleware("/v5", {
      target: "https://stock.xueqiu.com",
      changeOrigin: true,
      secure: false,
      cookieDomainRewrite: true,
      headers: {
        cookie,
      },
    })
  );
};
