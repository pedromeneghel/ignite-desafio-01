export async function validateInput(request, response) {
  const { title, description } = request.body;

  if (title.length === 0) {
    response
      .writeHead(400)
      .end(JSON.stringify({ errorMessage: "Please, fill the title rightly." }));
  }

  if (description.length === 0) {
    response.writeHead(400).end(
      JSON.stringify({
        errorMessage: "Please, fill the description rightly.",
      })
    );
  }
}
