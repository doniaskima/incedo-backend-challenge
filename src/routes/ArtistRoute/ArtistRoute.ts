import express from 'express';
import ArtistRouter from '..';
 

const router = express.Router();

router.use('/artist',ArtistRouter)

export default router;