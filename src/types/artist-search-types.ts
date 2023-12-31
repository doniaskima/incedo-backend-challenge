
export interface Record {
  name: string;
  mbid: string;
  url: string;
  image_small?: string;
  image?: string;
}


export interface Artist {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: Image[];
}

export type IArtistData = {
  results: {
    artistmatches: {
      artist: Artist[]
    }
  }
}

export interface Image {
  "#text": string;
  size: string;
}
