const { Router } = require('express');
const ScreenRouter = Router();
const {
  addScreen,
  getScreensByTheaterId,
  getScreenById,
  updateScreen,
  deleteScreen,
} = require('../controllers/Screen.C');

ScreenRouter.post('/', addScreen);
ScreenRouter.get('/thater/:id', getScreensByTheaterId);
ScreenRouter.get('/:id', getScreenById);
ScreenRouter.patch('/:id', updateScreen);
ScreenRouter.delete('/:id', deleteScreen);

module.exports = ScreenRouter;