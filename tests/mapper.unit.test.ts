import { mapArtistsData } from "../src/helpers/mapper";
import { Artist, Record } from "../src/types/artist-search-types";

describe("mapArtistsData function", () => {
  it("should map an array of artists to records", async () => {
    const artistsData: Artist[] = [
      {
        name: 'Taylor Swift',
        listeners: '4302543',
        mbid: '20244d07-534f-4eff-b4d4-930878889970',
        url: 'https://www.last.fm/music/Taylor+Swift',
        streamable: '0',
        image: [
          {
            '#text': 'small_image_url',
            size: 'small',
          },
          {
            '#text': 'large_image_url',
            size: 'large',
          },
        ],
      },
      {
        name: 'Adele',
        listeners: '5000000',
        mbid: 'some_mbid',
        url: 'https://www.last.fm/music/Adele',
        streamable: '1',
        image: [
          {
            '#text': 'small_image_url',
            size: 'small',
          },
          {
            '#text': 'large_image_url',
            size: 'large',
          },
        ],
      },
    ];

    const expectedRecords: Record[] = [
      {
        name: 'Taylor Swift',
        mbid: '20244d07-534f-4eff-b4d4-930878889970',
        url: 'https://www.last.fm/music/Taylor+Swift',
        image_small: 'small_image_url',
        image: 'large_image_url',
      },
      {
        name: 'Adele',
        mbid: 'some_mbid',
        url: 'https://www.last.fm/music/Adele',
        image_small: 'small_image_url',
        image: 'large_image_url',
      },
    ];

    const mappedRecords = await mapArtistsData(artistsData);
    expect(mappedRecords).toEqual(expectedRecords);
  });

  it("should handle empty artist data", async () => {
    const artistsData: Artist[] = [];
    const mappedRecords = await mapArtistsData(artistsData);
    expect(mappedRecords).toEqual([]);
  });
});
