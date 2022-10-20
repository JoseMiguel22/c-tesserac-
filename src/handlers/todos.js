import express from "express";
import { getDBHandler } from "../db/index.js";

const ToDosRequestHandler = express.Router();

ToDosRequestHandler.post("/to-dos", async (request, response) => {
  try {
    const { tittle, description, isDone: is_done } = request.body;
    const dbHandler = await getDBHandler();

    const newTodo = await dbHandler.run(`
      INSERT INTO todos (tittle, description, is_done)
      VALUES (
        '${tittle}',
        '${description}',
        ${is_done}
      )
    `);

    await dbHandler.close();

    response.send({ newTodo: {tittle, description, is_done, ...newTodo }});

  } catch (error) {
    response.status(500).send({
      error:`Something went wrong when trying to create a new to do`,
      errorInfo: error.message,
    });
  }
});

ToDosRequestHandler.get("/to-dos", async (request, response) => {
  try {
    const dbHandler = await getDBHandler();

    const todos = await dbHandler.all("SELECT * FROM todos")
    await dbHandler.close();

    if (!todos || !todos.length) {
      return response.status(404).send({ message: "To Dos Not Found"})
    }

    response.send({ todos });
  } catch (error) {
    response.status(500).send({
      error:`Something went wrong when trying to get to dos`,
      errorInfo: error.message,
    });
  }
});

ToDosRequestHandler.delete("/to-dos/:id", async (request, response) => {
  try {
    const todoId = request.params.id;
    const dbHandler = await getDBHandler();

    const deletedTodo = await dbHandler.run(
      "DELETE FROM todos WHERE id = ?",
      todoId
    );

    await dbHandler.close();

    response.send({ todoRemoved: { ...deletedTodo }});

    if (!todos || !todos.length) {
      return response.status(404).send({ message: "To Dos Not Found"})
    }
    
    response.send({ todos });
  } catch (error) {
    response.status(500).send({
      error:`Something went wrong when trying to delete the to do`,
      errorInfo: error.message,
    });
  }
});

ToDosRequestHandler.patch("/to-dos/:id", async (request, response) => {
  try {
    const todoId = request.params.id;
    const { tittle, description, isDone: is_done } = request.body;
    const dbHandler = await getDBHandler();

    const todoToUpdate = await dbHandler.get(
      `SELECT * FROM todos WHERE id = ?`,
      todoId
      );



    await dbHandler.run(
      `
    UPDATE todos SET tittle = ?, description = ?, is_done = ?
    WHERE id = ?
    `,
    tittle || todoToUpdate.tittle,
    description || todoToUpdate.description,
    is_done || todoToUpdate.is_done,
    todoId
    );

    await dbHandler.close();

    response.send({ todoUpdated: {...todoToUpdate, tittle, description, is_done}});
  } catch (error) {
    response.status(500).send({
      error:`Something went wrong when trying to update to do`,
      errorInfo: error.message,
    });
  }
});



export { ToDosRequestHandler };