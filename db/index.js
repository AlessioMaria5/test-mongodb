// index.js

const configureFastify = require('./fastify-config');

const startServer = async () => {
  const fastify = await configureFastify();

  const { ADDRESS = 'localhost', PORT = '3000' } = process.env;

  fastify.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

startServer();
