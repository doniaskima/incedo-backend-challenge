import { Request, Response } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import fs from 'fs';
import artistDict from '../data/artists.json';

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

export const getArtistData = asyncHandler(async (req: Request, res: Response) => {
  const artistName = req.params.artistName;
  const artistsData = await fetchArtistData(artistName);

  return res.json({ artistsData });
});
