import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes/index.js";


const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(routes);

app.listen({ port: process.env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
