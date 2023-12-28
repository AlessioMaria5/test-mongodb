const fastify = require('fastify');
const mongodb = require('@fastify/mongodb');
const dotenv = require('dotenv');
const routes = require('./routes');
dotenv.config();

const env = process.env;

const configureFastify = async () => {
  const app = fastify();

  // CORS configuration for the Fastify server
  // Custom CORS handling

  //WORK-AROUND per evitare le CORS.
  app.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', 'http://localhost:8081'); // Replace with your Vue app's origin
    reply.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
    reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (request.method === 'OPTIONS') {
      reply.code(200).send();
    } else {
      done();
    }
  });


  const MONGO_URL = `${env.MONGO_HOST}${env.ADDRESS}:${env.MONGO_PORT}/${env.MONGO_DB}`;
  console.log(MONGO_URL);

  try {
    // MongoDB registration
    await app.register(mongodb, { url: MONGO_URL });

    // Register routes
    await routes(app);

    // Route for handling the CORS preflight requests
    app.options('*', (request, reply) => {
      reply
        .code(200)
        .header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE')
        .header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    });
  } catch (error) {
    console.error("Error during configuration:", error);
    process.exit(1);
  }

  app.after(error => {
    if (error) {
      console.error("After hook error:", error);
      process.exit(1);
    }
  });

  return app;
};

module.exports = configureFastify;
