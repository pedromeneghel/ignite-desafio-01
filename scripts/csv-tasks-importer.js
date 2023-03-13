import { parse } from "csv-parse";
import fs from "node:fs";

const csvParseConfig = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLine: 2,
});

const csvToImport = new URL("./tasks.csv", import.meta.url);

const stream = fs.createReadStream(csvToImport);

(async function () {
  const lineToParse = stream.pipe(csvParseConfig);

  for await (const line of lineToParse) {
    const [title, description] = line;

    console.log(`Importing the task "${title}"`);

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    console.log(`Task "${title}" imported`);
  }
})();
