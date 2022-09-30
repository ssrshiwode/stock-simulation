const { createProxyMiddleware } = require("http-proxy-middleware");

const cookie =
  "xq_a_token=80b283f898285a9e82e2e80cf77e5a4051435344; xqat=80b283f898285a9e82e2e80cf77e5a4051435344; xq_r_token=01c799b47d711195ad89f38fa2cc6b9c9fb7e4e3; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTY2NTcwNTUzNCwiY3RtIjoxNjYzNTcxOTE4MTA3LCJjaWQiOiJkOWQwbjRBWnVwIn0.ADMLJiAHlDAe4Fs3R7QLyROGzVbRiyTIcC2KBz6mPO3DNHkKS2wdlDMOy0Dr12Sqj_cJRX8ZtJX0ZcFTCI1tS8mShLLOewt479qZY9XNK7n6V8qThBDaY7HAWHzM8MFUZPOa0Ak8BC_QFGr2n-S0Hp_BahelPWPE94jzuMcFKA6BV3-pmYZwkV-XisMGXUJAgQeHBDchSHzNHP228rPSg99RAtvaMJ4U0BfR_uB4lN8H80pFGh8QRxPMzgd5d2C-wBqeL_7lDVhHyCW4Biy8CAt1gdKqOLS_FneyozSdSVOrvVd4q82xeNsLN-xQ_ml7n-HP2q95nTJWI1m_lSnAyg; u=561663571960724; Hm_lvt_1db88642e346389874251b5a1eded6e3=1663571962; device_id=c80d3c419d52e0b9ac58b7e9b40b0e20; s=c51qguwmay; is_overseas=0; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1663643296";

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
