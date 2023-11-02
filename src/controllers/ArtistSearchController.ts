import { Request, Response } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import axios from 'axios';
import artistDict from '../data/artists.json';
import { writeToFile } from '../helpers/csv-writer';
import { Artist, Record } from '../types/artist-search-types';
import { BadRequestResponse, ForbiddenResponse, InternalErrorResponse, NotFoundResponse, SuccessResponse } from '../core/ApiResponse';
import { BadRequestError, ForbiddenError, InternalError, NotFoundError } from '../core/ApiError';
 

const LAST_FM_API_BASE_URL = 'http://ws.audioscrobbler.com/2.0/';
const API_KEY = process.env.API_KEY || '5df2f200a6e7d1671ec61790052a1cca';

const fetchArtistDataFromAPI = async (artistName: string): Promise<Artist[]> => {
  try {
    const response = await axios.get(LAST_FM_API_BASE_URL, {
      params: {
        method: 'artist.search',
        artist: artistName,
        api_key: API_KEY,
        format: 'json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch artist data');
    }

    return response.data.results.artistmatches.artist;
  } catch (error) {
    throw error;
  }
};

export const searchArtistData = async (artistName: string): Promise<Artist[]> => {
  try {
    let artistData = await fetchArtistDataFromAPI(artistName);

    if (artistData.length < 4) {
      const randomIndex = Math.floor(Math.random() * artistDict.randomArtists.length);
      const randomArtist = artistDict.randomArtists[randomIndex];
      artistData = [...artistData, randomArtist];
    }

    return artistData;
  } catch (error) {
    throw error;
  }
};

export const writeArtistsToFile = asyncHandler(async (req: Request, res: Response) => {
  const { csvFileName = 'defaultArtistsList', artistName } = req.params;

  try {
    const artistsData = await searchArtistData(artistName);

    const records: Record[] = artistsData.map((artist) => ({
      name: artist.name,
      mbid: artist.mbid,
      url: artist.url,
      image_small: (artist.image.find((imageItem) => imageItem.size === 'small') || {} as any)['#text'] || '',
      image: (artist.image.find((imageItem) => imageItem.size === 'large') || {} as any)['#text'] || '',
    }));

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

    const genericErrorResponse = new InternalErrorResponse('Internal server error');
    return genericErrorResponse.send(res);
  }
});
