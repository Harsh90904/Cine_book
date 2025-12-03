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
  thaterSignup,
  thaterLogin
} = require('../controllers/Thater.C');
const upload = require('../utils/multer');
const decodeJWT = require('../middlewares/decodejwt');

ThaterRouter.post('/signup', upload.array('images', 6), thaterSignup); 
ThaterRouter.post('/login', thaterLogin); 

ThaterRouter.post('/signup', upload.array('images', 6), thaterSignup);
console.log("Upload object:", upload);
console.log("Upload.array:", upload.array);
ThaterRouter.get('/', getAllThaters);
ThaterRouter.get('/:id', getThaterById);
ThaterRouter.patch('/:id', updateThater);
ThaterRouter.delete('/:id',  deleteThater);
ThaterRouter.get('/:id/screens', getScreensByThater);
ThaterRouter.post('/:id/screens',  addScreenToThater);
ThaterRouter.get('/:id/shows', getShowsByThater);

module.exports = ThaterRouter;