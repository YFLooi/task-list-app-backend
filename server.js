const axios = require("axios");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();

// const CompaniesModel = require("./companiesSchema");
// const constructMongoConnection = require("./backend/config/server.config.js");
const ServerConfig = require("./src/config/server.config");
const UserTaskService = require("./src/sub-modules/user-task/user-task.service");
const UserLoginService = require("./src/sub-modules/user-login/user-login.service");

require("dotenv").config();
const server = express();
const port = 3500;

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Connecting to database
const mongoConnectionString = ServerConfig.constructMongoConnection();
mongoose.Promise = global.Promise;

mongoose.connect(
  mongoConnectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error) {
    if (error) {
      console.log("Error!" + error);
    } else {
      console.log("Connected to MongoDB Atlas database");
    }
  }
);

server.get(`/`, async (req, res) => {
  console.log(`Call made to root route at "/". Returning text`);
  res.send(`Call made to root route of task-list-app backend`);
});

server.post(`/login`, async (req, res) => {
  console.log(`Call made to /login`);

  try {
    const userDetails = await UserLoginService.login(
      req.body.username,
      req.body.password
    );

    return res.status(200).json({
      token: {
        name: req.body.username,
        token: userDetails.token,
      },
      image: userDetails.profileImageLink,
    });
  } catch (err) {
    console.log(`Unable to get user details. Err: ${err}`);
    return res.status("401").json({
      message: `Authorization information is missing or invalid. Err: ${err?.message}`,
    });
  }
});

server.get(`/dashboard`, async (req, res) => {
  console.log(`Call made to /dashboard`);

  try {
    const dashboardData = await UserTaskService.getDashboardData();

    return res.status(200).json(dashboardData);
  } catch (err) {
    console.log(`Unable to make GET dashboard data. Err: ${err}`);
    return res.status("401").json({
      message: `Authorization information is missing or invalid. Err: ${err?.message}`,
    });
  }
});

server.get(`/tasks`, async (req, res) => {
  console.log(`GET call made to /tasks to get all tasks for userId`);

  try {
    const tasks = await UserTaskService.getAllTasksForUserId();

    return res.status(200).json(tasks);
  } catch (err) {
    console.log(`Unable to get all tasks for userId. Err: ${err}`);
    return res.status("401").json({
      message: `Authorization information is missing or invalid. Err: ${err?.message}`,
    });
  }
});

server.post(`/tasks`, async (req, res) => {
  console.log(`Successful POST call to create task made to /tasks`);

  try {
    const { taskName } = req.body;
    await UserTaskService.createTask(taskName);

    return res.status(200).json({
      name: taskName,
      completed: false,
    });
  } catch (err) {
    console.log(`Unable to create task for given userId. Err: ${err}`);
    return res.status("401").json({
      message: `Authorization information is missing or invalid. Err: ${err?.message}`,
    });
  }
});

server.put(`/tasks/:id:`, async (req, res) => {
  console.log(`PUT call made to /tasks/:id`);
  const currentTaskName = decodeURI(req.params.id);
  const { newTaskName, completed } = req.body;

  try {
    const updatedTask = await UserTaskService.updateTaskName(
      currentTaskName,
      newTaskName,
      completed
    );

    // Return updated task
    if (updatedTask?.name) {
      return res.status(200).json(updatedTask);
    } else {
      return res.status(404).json({ message: "Not Found. Task was not found" });
    }
  } catch (err) {
    console.log(`Unable to edit task name for given userId. Err: ${err}`);
    return res.status("401").json({
      message: `Authorization information is missing or invalid. Err: ${err?.message}`,
    });
  }
});

server.delete(`/tasks/:id`, async (req, res) => {
  const currentTaskName = decodeURI(req.params.id);
  console.log(
    `DELETE call made to /tasks/:id. Current task name:\n${currentTaskName}`
  );

  try {
    // Return deleted task
    const deletedTask = await UserTaskService.deleteTask(currentTaskName);

    // When taskId cannot be found
    if (!deletedTask) {
      return res.status(404).json({
        message: "Not Found. Task was not found",
      });
    }
    if (deletedTask.completed) {
      return res.status(400).json({
        message: "Bad Request. Task is marked complete, it cannot be deleted.",
      });
    }

    console.log(`Deleted task with given currentTaskName ${currentTaskName}`);
    return res.status(200).json(deletedTask);
  } catch (err) {
    console.log(
      `Unable to delete task with id ${currentTaskName}. Err: ${err}`
    );
    return res.status("401").json({
      message: `Authorization information is missing or invalid. Err: ${err?.message}`,
    });
  }
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
