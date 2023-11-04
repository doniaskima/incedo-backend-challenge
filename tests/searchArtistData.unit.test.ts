import express from 'express';
import { searchArtistData } from '../src/controllers/ArtistSearchController';
import request from 'supertest';
import { mockArtistData } from './mocks/searchArtistData.mocks';

const app = express();

app.get('/search/:artistName', searchArtistData);

export const fetchArtistDataFromAPI = jest.fn();
 

describe('searchArtistData', () => {
  it('should respond with artist data', async () => {
    const response = await request(app).get('/search/Marshmelllooooooooooooooo');
    expect(response.status).toBe(200);

    // Sort both arrays by a unique key to ensure order doesn't matter.
    // Sort and remove duplicates from sortedResponseData
    const sortedResponseData = response.body.artistsData
       .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
       .filter((value: { name: string }, index: number, self: { name: string }[]) => self.findIndex(item => item.name === value.name) === index);
 
     const sortedMockData = mockArtistData.artistsData.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
        expect(sortedResponseData).toEqual(sortedMockData);
  });
});

