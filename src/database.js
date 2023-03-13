import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    const now = new Date();

    const taskToCreate = {
      completed_at: null,
      created_at: now,
      updated_at: now,
      ...data,
    };

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(taskToCreate);
    } else {
      this.#database[table] = [taskToCreate];
    }

    this.#persist();

    return data;
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    } else {
      throw new Error("Task not found");
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const taskToUpdate = { ...this.#database[table][rowIndex] };

      taskToUpdate.title = data.title;
      taskToUpdate.description = data.description;
      taskToUpdate.updated_at = new Date();

      this.#database[table][rowIndex] = taskToUpdate;
    } else {
      throw new Error("Task not found");
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const data = { ...this.#database[table][rowIndex] };

      data.completed_at = new Date();
      data.updated_at = new Date();

      this.#database[table][rowIndex] = data;
      this.#persist();
    } else {
      throw new Error("Task not found");
    }
  }
}
