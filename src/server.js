import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes.js";


const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(routes);

app.listen({ port: process.env.PORT }).then(() => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
