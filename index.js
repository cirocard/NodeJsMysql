// yarn init -y  iniciar
// yarn add express  importar o expess
// yarn add nodemon -D  para o desenvolvimento nao precisar reinicar toda hora o server

const express = require('express');

const server = express();

//para utilizar json
server.use(express.json());

//variaveis globais
let numberOfRequests = 0;
const projects = [];

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const {
    id
  } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({
      error: 'Project not found'
    });
  }

  return next();
}

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

//middleware global
server.use(logRequests);

/**
 * Projects
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const {
    id,
    title
  } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const {
    id
  } = req.params;
  const {
    title
  } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const {
    id
  } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Tasks
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const {
    id
  } = req.params;
  const {
    title
  } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});;

server.listen(3000);