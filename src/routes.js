import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { validateInput } from "./middleware/validate-input.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { search } = request.query;
      const users = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return response.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      validateInput(request, response);

      const { title, description } = request.body;

      database.insert("tasks", {
        id: randomUUID(),
        title,
        description,
      });

      return response.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;

      try {
        database.delete("tasks", id);
        return response.writeHead(204).end();
      } catch (error) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ errorMessage: error.message }));
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { title, description } = request.body;
      const { id } = request.params;

      try {
        database.update("tasks", id, { title, description });
        return response.writeHead(204).end();
      } catch (error) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ errorMessage: error.message }));
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;

      try {
        database.complete("tasks", id);
        return response.writeHead(204).end();
      } catch (error) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ errorMessage: error.message }));
      }
    },
  },
];
