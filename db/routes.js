const routes = async (fastify) => {

  fastify.get(
    '/test', 
    async (request, response) => {
    
    const coll = fastify.mongo.db?.collection(process.env.MONGO_COLLECTION);
    
    try {
      const cursor = coll.find();
      const res = await cursor.toArray();
      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
      return { error: "Internal Server Error" };
    }
  });

  // Add more routes as needed
};

module.exports = routes;
