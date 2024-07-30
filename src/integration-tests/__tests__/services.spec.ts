import { BlobFileService } from "../../../src/services/blob";

describe.only("Blob File provider", () => {
  let blobService: BlobFileService;
  beforeAll(() => {
    blobService = new BlobFileService(
      {
        logger: console as any,
      },
      {
        blob_read_write_token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
      }
    );
  });

  it("Upload files to blob", async () => {
    const data = "\x00\xff\xfe\xe2"

    const resp = await blobService.upload({
      filename: 'test.txt',
      mimeType: 'text/plain',
      content: data,
    })
    
  });
});
