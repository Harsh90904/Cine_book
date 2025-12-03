const {Router} = require('express');
const ShowRouter = Router();
const {
  addShow,
  getShowsByTheater,
  getShowById,
  updateShow,
  deleteShow,
  getShowSeats,
} = require('../controllers/Show.C');
const ThaterDecodeJWT = require('../middlewares/decodejwt');

ShowRouter.post('/', addShow);
ShowRouter.get('/thater/:id', getShowsByTheater);
ShowRouter.get('/:id', getShowById);
ShowRouter.patch('/:id',  updateShow);
ShowRouter.delete('/:id', deleteShow);
ShowRouter.get('/:id/seats', getShowSeats);
module.exports = ShowRouter;