const taskModel = require("./user-task.model");

async function createTask(taskName, userId) {
  await taskModel.create({
    name: taskName,
    completed: false,
  });

  console.log(`Successfully created new task for userId ${userId}`);
}

async function getAllTasksForUserId() {
  const tasks = await taskModel.find({}).sort({ createdAt: -1 });

  return tasks.map((task) => {
    return { name: task.name, completed: task.completed };
  });
}

async function getDashboardData() {
  console.log(`Getting dashboard data`);
  const tasks = await taskModel.find({}).sort({ createdAt: -1 });

  console.log({
    tasksCompleted: tasks.filter((task) => task.completed).length,
    totalTasks: tasks?.length,
    latestTasks: tasks.map((task) => {
      return { name: task.name, completed: task.completed };
    }),
  });

  return {
    tasksCompleted: tasks.filter((task) => task.completed).length,
    totalTasks: tasks?.length,
    latestTasks: tasks.map((task) => {
      return { name: task.name, completed: task.completed };
    }),
  };
}

async function updateTaskName(currentTaskName, newTaskName, completed) {
  let task = {
    name: "",
    completed: null,
  };
  if (newTaskName) {
    task = await taskModel
      .findOneAndUpdate(
        {
          name: currentTaskName,
        },
        {
          name: newTaskName,
          completed: completed,
        },
        {
          new: true,
        }
      )
      .sort({ createdAt: -1 });
  } else {
    task = await taskModel
      .findOneAndUpdate(
        {
          name: currentTaskName,
        },
        {
          completed: completed,
        },
        {
          new: true,
        }
      )
      .sort({ createdAt: -1 });
  }

  console.log(`Updated task: ${JSON.stringify(task, null, 2)}`);
  return {
    name: task.name,
    completed: task.completed,
  };
}

async function deleteTask(currentTaskName) {
  const task = await taskModel.findOne({
    name: currentTaskName,
  });
  console.log(task);

  if (task?.completed) {
    console.log(
      `Task of name "${currentTaskName}" is completed. Cannot delete.`
    );
    return task;
  }
  if (!task?._id) {
    console.log(
      `Task of name "${currentTaskName}" does not exist. Cannot delete.`
    );
    return null;
  }

  const deletedTask = await taskModel.deleteOne({
    name: currentTaskName,
  });

  return {
    name: task.name,
    completed: task.completed,
  };
}

module.exports = {
  createTask,
  getAllTasksForUserId,
  getDashboardData,
  updateTaskName,
  deleteTask,
};
