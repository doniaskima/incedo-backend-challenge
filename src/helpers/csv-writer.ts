import { createObjectCsvWriter } from 'csv-writer';

/* Define a custom Header type */
type Header = { id: string; title: string }[];


export const writeToFile = async (filePath: string, records: Record[]) => {
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

interface Record {
  name: string;
  mbid: string;
  url: string;
  image_small: string;
  image: string;
}
