// server/routes/task.routes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authJwt = require('../middleware/authJwt');

router.post('/', authJwt, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      assignee: req.body.assignee,
      team: req.body.team
    });

    await task.save();
    await Task.findByIdAndUpdate(
      task._id,
      { $push: { 
        activityLogs: {
          action: 'created',
          userId: req.userId,
          timestamp: new Date()
        } 
      }},
      { new: true }
    );

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authJwt, async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'dueDate'];
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    let task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    // Add activity log
    await Task.findByIdAndUpdate(
      taskId,
      { $push: { 
        activityLogs: {
          action: 'updated',
          userId: req.userId,
          timestamp: new Date()
        } 
      }},
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;