import express from 'express';
const router = express.Router();

router.get('/', (err, req, res, next) => {
  if(req.xhr){
    res.status(400).json({error: err})
  }
  else{
    next(err);
  }
})

export default router;
