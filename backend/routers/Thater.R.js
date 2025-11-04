const { Router } = require('express');
const ThaterRouter = Router();
const {
  addThater,
  getAllThaters,
  getThaterById,
  updateThater,
  deleteThater,
  getScreensByThater,
  addScreenToThater,
  getShowsByThater,
} = require('../controllers/Thater.c.JS');
const upload = require('../utils/multer'); // multer instance

ThaterRouter.post('/', upload.array('images', 6), addThater);
ThaterRouter.get('/', getAllThaters);
ThaterRouter.get('/:id', getThaterById);
ThaterRouter.patch('/:id', updateThater);
ThaterRouter.delete('/:id', deleteThater);
ThaterRouter.get('/:id/screens', getScreensByThater);
ThaterRouter.post('/:id/screens', addScreenToThater);
ThaterRouter.get('/:id/shows', getShowsByThater);

module.exports = ThaterRouter;