const express = require('express');

const Folder = require('../models/folder');

const folderRoutes = express.Router();

folderRoutes.route('').post(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).send({ error: 'Please log in first' });
  }
  if (!req.body) {
    return res.sendStatus(400);
  }

  const { title, parentId } = req.body;
  const f = new Folder({ title, user: user._id });
  if (parentId) {
    f.parentId = parentId;
  }

  try {
    const folder = await f.save();
    return res.status(201).send({ folder });
  } catch (err) {
    return res.send(err);
  }
});

module.exports = folderRoutes;
