import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import artistDict from '../data/artists.json';
import { writeToFile } from '../helpers/csv-writer';


interface Record {
  name: string;
  mbid: string;
  url: string;
  image_small: string;
  image: string;
}

interface Artist {
  name: string;
  listeners: string | number;  
  mbid: string;
  url: string;
  streamable: boolean;
  image: Image[];
}


interface Image {
  "#text": string;
  size: string;
}

// Create a function for fetching artist data from the API
const fetchArtistDataFromAPI = async (artistName: string): Promise<Artist[]> => {
  const URL = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName}&api_key=${process.env.API_KEY}&format=json`;
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }
    const data = await response.json();
    return data.results.artistmatches.artist;
  } catch (error) {
    throw error;
  }
};


const searchArtistData = async (artistName: string): Promise<Artist[]> => {
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


export const getArtistData = asyncHandler(async (req: Request, res: Response) => {
  const artistName = req.params.artistName;
  const artistsData = await searchArtistData(artistName);

  return res.json({ artistsData });
});

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
        image_small: imageSmall,
        image: imageLarge,
      });
    });

    // Write the artist data to a CSV file using the createObjectCsvWriter function.
    await writeToFile(`src/data/${csvFileName}.csv`, records);

    console.log('Successfully written CSV file');
    res.status(200).send('CSV File successfully created');
  } catch (error) {
    // Handle errors, you can log or rethrow the error as needed
    res.status(500).json({ msg: error.message });
  }
});