import express from 'express';
import SearchArtist from "./ArtistRoute/ArtistRoute"
const router = express.Router();

router.use('/search', SearchArtist);

export default router;
