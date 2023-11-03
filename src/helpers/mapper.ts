import { Artist, Record } from "../types/artist-search-types";

export async function mapArtistsData(artistsData: Artist[]): Promise<Record[]> {
  return artistsData.map((artist) => {
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
}
