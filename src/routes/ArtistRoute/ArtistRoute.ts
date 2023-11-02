import express from 'express';
import ArtistRouter from '..';
 

const router = express.Router();
 
router.use('/',ArtistRouter)

export default router;