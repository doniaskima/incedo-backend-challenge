import express from 'express';
import SearchArtist from "./ArtistRoute/ArtistRoute"
import { getArtistData, writeArtistsToFile } from '../controllers/ArtistSearchController';
const ArtistRouter = express.Router();

ArtistRouter.get('/:artistName', getArtistData);
ArtistRouter.get("/:artistName/:csvFileName?",writeArtistsToFile)


export default ArtistRouter;
