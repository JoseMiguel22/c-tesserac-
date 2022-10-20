import express from "express";
import { initDB } from "./db/index.js";
import { ToDosRequestHandler } from "./handlers/todos.js";


const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: false }));

api.use("/v1", ToDosRequestHandler);


api.listen(8080, () => {
  console.log("API IS RUNNING\n");
  initDB().then(() => {
    console.log("DB IS READY");
  });
});
