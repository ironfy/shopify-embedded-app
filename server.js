require('isomorphic-fetch');
const dotenv = require('dotenv'); // .env vars support
const Koa = require('koa'); // Framework
const next = require('next'); // Framework
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth'); // Shopify auth middleware for koa
const { verifyRequest } = require('@shopify/koa-shopify-auth');  // Shopify auth middleware for koa
const session = require('koa-session'); // Session middleware for koa

dotenv.config(); //get config from .env file and updates the process.env
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy'); // Koa shopify graphql proxy package 
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy'); // The supported api versions for our proxy

const port = parseInt(process.env.PORT, 10) || 3000; // Port
const dev = process.env.NODE_ENV !== 'production'; // Dev mode
const app = next({ dev }); // Next.js Framework
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
    const server = new Koa(); // Koa.js Framework server instance
    server.use(session(server)); // Add session middelware
    server.keys = [SHOPIFY_API_SECRET_KEY]; // Set signed cookie keys

    // Koa auth middleware
    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY, // App token
            secret: SHOPIFY_API_SECRET_KEY, // App secret
            scopes: ['read_products', 'write_products'], // App scopes
            afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;
                ctx.cookies.set('shopOrigin', shop, { httpOnly: false });
                ctx.redirect('/');
            },
        }),
    );
    
    // Koa shopify graphQL proxy middlewara
    server.use(graphQLProxy({version: ApiVersion.April19}))
    // Koa verifyRequest middleware
    server.use(verifyRequest());
    
    // Koa middleware "getRequestHandler" aka handle
    server.use(async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return
    });

    // Koa, creates and returns an http server
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});