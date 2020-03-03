import express from 'express';
const router = express.Router();

router.use((err, req, res, next) => {
  if(req.headersSent){
    return next(err);
  }
  res.status(500).json({ error: err });
})

export default router;
