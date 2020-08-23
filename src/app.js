const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
      return response.status(400).json({error: 'Invalid repository ID.'});
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
      id: uuid(),
      url,
      title,
      techs,
      likes: 0
  }
    repositories.push(repository);
    return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId,  (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  const repository = repositories[repositoryIndex]

  repository.url = url;
  repository.title = title;
  repository.techs = techs;
  
    repositories.push(repository);
    return response.json(repository);

});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(project => project.id == id);

  if (repositoryIndex < 0) {
      return response.status(404).json({error: "Repository not found"}) 
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like",validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  const repository = repositories[repositoryIndex]

  repository.likes++
  
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

module.exports = app;
