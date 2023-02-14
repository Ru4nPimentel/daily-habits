import Fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./lib/routes";

const app = Fastify();

//Back-end API RESTful
//Routs, using method HTTP: Get, Post, Put, Patch, Delete
//configure os dominios que poderam utilizar o backend, caso contrario dara erro de cors
app.register(cors);
appRoutes(app);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running !");
  });
