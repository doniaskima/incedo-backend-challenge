import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import artistDict from '../data/artists.json';
import { writeToFile } from '../helpers/csv-writer';
import axios from 'axios';
import { Artist, Record } from '../types/artist-search-types';

 
// Create a function for fetching artist data from the API
const fetchArtistDataFromAPI = async (artistName: string): Promise<Artist[]> => {
  const URL = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName}&api_key=${process.env.API_KEY}&format=json`;
  try {
    const response = await axios.get(URL);
    if (response.status !== 200) {
      throw new Error('Failed to fetch artist data');
    }
    return response.data.results.artistmatches.artist;
  } catch (error) {
    throw error;
  }
}

export const searchArtistData = async (artistName: string): Promise<Artist[]> => {
  try {
    let artistData = await fetchArtistDataFromAPI(artistName);
    if (artistData.length < 4) {
      const randomIndex = Math.floor(Math.random() * artistDict.randomArtists.length);
      const randomArtist = artistDict.randomArtists[randomIndex] as Artist;
      artistData = [...artistData, randomArtist];
    }
    return artistData;
  } catch (error) {
    throw error;
  }
};



export const writeArtistsToFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { csvFileName, artistName } = req.params || 'defaultArtistsList';

  try {
    const artistsData = await searchArtistData(artistName);

    const records: Record[] = [];
    artistsData.forEach((artist) => {
      const imageSmall = artist.image.find((imageItem) => imageItem.size === 'small')?.['#text'];
      const imageLarge = artist.image.find((imageItem) => imageItem.size === 'large')?.['#text'];

      records.push({
        name: artist.name,
        mbid: artist.mbid,
        url: artist.url,
        image_small: imageSmall || '', 
        image: imageLarge,
      });
    });

    await writeToFile(`src/data/${csvFileName}.csv`, records);

    console.log('Successfully written CSV file');
    res.status(200).send('CSV File successfully created');
  } catch (error) {
    throw error;
  }
});
