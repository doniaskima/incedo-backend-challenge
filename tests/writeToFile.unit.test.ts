import { writeToFile } from '../src/helpers/csv-writer';
 

jest.mock('csv-writer', () => {
  return {
    createObjectCsvWriter: jest.fn().mockReturnValue({
      writeRecords: jest.fn(),
    }),
  };
});

describe('writeToFile', () => {
  it('should write records to a CSV file', async () => {
    const filePath = 'test.csv';
    const records = [
      {
        name: 'Artist 1',
        mbid: '123',
        url: 'https://example.com',
        image_small: 'image_small_1.jpg',
        image: 'image_1.jpg',
      },
      {
        name: 'Artist 2',
        mbid: '456',
        url: 'https://example.com',
        image_small: 'image_small_2.jpg',
        image: 'image_2.jpg',
      },
    ];

    await writeToFile(filePath, records);

    // Assert that createObjectCsvWriter was called with the correct arguments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createObjectCsvWriter } = require('csv-writer');

    expect(createObjectCsvWriter).toHaveBeenCalledWith({
      path: filePath,
      header: [
        { id: 'name', title: 'name' },
        { id: 'mbid', title: 'mbid' },
        { id: 'url', title: 'url' },
        { id: 'image_small', title: 'image_small' },
        { id: 'image', title: 'image' },
      ],
    });

    // Assert that writeRecords was called with the records
    const csvWriterInstance = createObjectCsvWriter();
    expect(csvWriterInstance.writeRecords).toHaveBeenCalledWith(records);
  });
});