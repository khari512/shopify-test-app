const axios = require("axios");
const dotenv = require('dotenv');
const koa= require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const Router = require('koa-router');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 4000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const handle =  app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;;


app.prepare().then(() => {

  const server = new koa();
  const router = new Router();
  const proxy = require('koa-server-http-proxy')

  
  server.use(session({ secure: true , sameSite: 'none'},server));
  server.keys= [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products'],
      
      afterAuth(ctx){
        console.log('after auth function ');
        
        const { shop, accessToken } =  ctx.session;
        console.log( accessToken);
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        ctx.redirect("/");
      }

    })
  );
  // server.use(proxy('/oc', {
  //   target: 'https://local.ftdi.com:3000'

  
  //   //pathRewrite: { '^/api': 'api/4/' },
  //   changeOrigin: true
  // }))

  //server.use(verifyRequest())

  router.get('/api/customers', async (ctx) => {
    // await app.render(ctx.req, ctx.res, '/api/user', ctx.query)

    //const username = 'f61246fa31e987a8ad9d734b2f3fb53f' ;
    //https://hydflowers.myshopify.com/admin/apps/private password
    const password = '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'; // private app admin api password

    const response = await axios.get(`https://hydflowers.myshopify.com/admin/api/2020-07/customers.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": password
      }
    });
    console.log( response.data);
    ctx.body = response.data ;
     
    })
 
   router.all('*', async (ctx) => {
     await handle(ctx.req, ctx.res)
     ctx.respond = false;
     return
   })


  // server.use( async (ctx) => {
  //   await handle(ctx.req, ctx.res);
  //   ctx.respond = false;
  //   ctx.res.statusCode = 200;
  //   return
  // });

 

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);  
  });


});
