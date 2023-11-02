import express from 'express';
import { searchArtistDataHandler, writeArtistsTofileHandler } from '../controllers/ArtistSearchController';
  
const ArtistRouter = express.Router();

ArtistRouter.get('/:artistName', searchArtistDataHandler);
ArtistRouter.get("/:artistName/:csvFileName",writeArtistsTofileHandler)


export default ArtistRouter;
