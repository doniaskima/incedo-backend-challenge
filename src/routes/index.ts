import express from 'express';
import { searchArtistData, writeArtistsToFile } from '../controllers/ArtistSearchController';
const ArtistRouter = express.Router();

ArtistRouter.get('/:artistName', searchArtistData);
ArtistRouter.get("/:artistName/:csvFileName?",writeArtistsToFile)


export default ArtistRouter;
