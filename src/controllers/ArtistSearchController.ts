import {  Request, Response } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import axios from 'axios';
import artistMocks from "../data/artists.json"
import { writeToFile } from "../helpers/csv-writer";
import { Artist, IArtistData, Record } from "../types/artist-search-types";
import { BadRequestResponse, ForbiddenResponse, InternalErrorResponse, NotFoundResponse, SuccessResponse } from '../core/ApiResponse';
import { BadRequestError, ForbiddenError, InternalError, NotFoundError } from '../core/ApiError';

const API_KEY = process.env.API_KEY || '5df2f200a6e7d1671ec61790052a1cca';


async function fetchArtistDataFromAPI(artistName: string): Promise<Artist[]> {
  const URL = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName}&api_key=${API_KEY}&format=json`;
  const { data } = await axios.get<IArtistData>(URL);
  const artistData: Artist[] = data.results.artistmatches.artist;
  if (artistData.length < 1) {
    while (artistData.length < 8) {
      const randomIndex = Math.floor(Math.random() * artistMocks.randomArtists.length);
      const randomArtist = artistMocks.randomArtists[randomIndex];
      artistData.push(randomArtist);
    }
  }
  return artistData;
}


async function searchArtistData(
  req: Request,
  res: Response,
) {
  const { artistName } = req.params as { artistName: string };
  const artistsData = await fetchArtistDataFromAPI(artistName);
  res.json({ artistsData });
}

async function writeArtistsTofile(
  req: Request,
  res: Response,
) {
  const { csvFileName = 'defaultArtistsList', artistName } = req.params;

  try {
    const artistsData = await fetchArtistDataFromAPI(artistName);

    const records: Record[] = artistsData.map((artist) => {
      const image_small = artist.image.find((imageItem) => imageItem.size === 'small')?.['#text'];
      const image = artist.image.find((imageItem) => imageItem.size === 'large')?.['#text'];

      return {
        name: artist.name,
        mbid: artist.mbid,
        url: artist.url,
        image_small,
        image,
      };
    });

    await writeToFile(`src/data/${csvFileName}.csv`, records);

    const successResponse = new SuccessResponse('CSV File successfully created');
    return successResponse.send(res);
  } catch (error) {
    if (error instanceof BadRequestError) {
      const badRequestResponse = new BadRequestResponse(error.message);
      return badRequestResponse.send(res);
    } else if (error instanceof NotFoundError) {
      const notFoundResponse = new NotFoundResponse(error.message);
      return notFoundResponse.send(res);
    } else if (error instanceof ForbiddenError) {
      const forbiddenResponse = new ForbiddenResponse(error.message);
      return forbiddenResponse.send(res);
    } else if (error instanceof InternalError) {
      const internalErrorResponse = new InternalErrorResponse(error.message);
      return internalErrorResponse.send(res);
    }
  }
}

export const searchArtistDataHandler = asyncHandler(searchArtistData);
export const writeArtistsTofileHandler = asyncHandler(writeArtistsTofile);
 
