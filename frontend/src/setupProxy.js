const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/watson-predict',
        createProxyMiddleware({
            target: 'https://eu-gb.ml.cloud.ibm.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api/watson-predict': '/ml/v4/deployments/8be0910c-47f3-48a6-b1ed-6eec41b7d324/predictions?version=2021-05-01',
            },
        })
    );
};
