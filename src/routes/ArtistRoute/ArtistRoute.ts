import express from 'express';
import { getArtistData } from '../../controllers/ArtistSearchController';


const router = express.Router();


router.use('/', getArtistData);



export default router;