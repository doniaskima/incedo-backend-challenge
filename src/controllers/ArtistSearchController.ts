import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import fs from 'fs';
import artistDict from '../data/artists.json';
import { createObjectCsvWriter } from 'csv-writer';

/* Define a custom Header type */
type Header = { id: string; title: string }[];

interface Record {
  name: string;
  mbid: string;
  url: string;
  image_small: string;
  image: string;
}

interface Artist {
  name: string;
  listeners: number;
  mbid: string;
  url: string;
  streamable: boolean;
  image: Image[];
}

interface Image {
  "#text": string;
  size: string;
}

const fetchArtistData = async (artistName: string): Promise<Artist[]> => {
  const URL = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName}&api_key=${process.env.API_KEY}&format=json`;
  const response = await fetch(URL);
  const data = await response.json();
  const artistData = data.results.artistmatches.artist;

  // If there are fewer than 4 artists, add a random artist from the dictionary.
  if (artistData.length < 4) {
    const randomIndex = Math.floor(Math.random() * artistDict.randomArtists.length);
    const randomArtist = artistDict.randomArtists[randomIndex];
    artistData.push(randomArtist);
  }

  return artistData;
};

const writeToFile = async (filePath: string, records: Record[]): Promise<void> => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'name', title: 'name' },
      { id: 'mbid', title: 'mbid' },
      { id: 'url', title: 'url' },
      { id: 'image_small', title: 'image_small' },
      { id: 'image', title: 'image' },
    ] as Header,
  });

  await csvWriter.writeRecords(records);
};

export const getArtistData = asyncHandler(async (req: Request, res: Response) => {
  const artistName = req.params.artistName;
  const artistsData = await fetchArtistData(artistName);

  return res.json({ artistsData });
});

export const writeArtistsToFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { csvFileName, artistName } = req.params || 'defaultArtistsList';

  try {
    const artistsData = await fetchArtistData(artistName);

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
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
