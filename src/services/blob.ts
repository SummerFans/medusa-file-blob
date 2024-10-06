import { AbstractFileProviderService, MedusaError } from "@medusajs/utils";
import { FileTypes, Logger } from "@medusajs/types";
import { put, del } from "@vercel/blob";
import { v4 as uuidv4 } from 'uuid'


type InjectedDependencies = {
  logger: Logger;
};

type BlobFileServiceConfig = {
  blob_read_write_token: string;
  add_random_suffix?: boolean;
  cache_control_maxAge?: number;
};

export class BlobFileService extends AbstractFileProviderService {
  static identifier = "blob";
  protected config_: BlobFileServiceConfig;
  protected logger_: Logger;

  constructor(
    { logger }: InjectedDependencies,
    { blob_read_write_token, add_random_suffix, cache_control_maxAge }: BlobFileServiceConfig
  ) {
    super();

    this.logger_ = logger;
    this.config_ = {
      blob_read_write_token,
      add_random_suffix,
      cache_control_maxAge,
    };
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    let blob;
    if (!file) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No file provided`)
    }
    try {
      let filename = file.filename;
      const content = Buffer.from(file.content, 'binary')

      if (!this.config_.add_random_suffix) {
        // If you need to add a random suffix, do not change the file name
        const extension = filename.split('.').pop();
        filename = `${uuidv4()}.${extension}`;
      }

      blob = await put(filename, content, {
        access: 'public',
        token: this.config_.blob_read_write_token,
        addRandomSuffix: this.config_.add_random_suffix ?? false,
        contentType: file.mimeType,
        cacheControlMaxAge: this.config_.cache_control_maxAge ?? 31536000
      });
      this.logger_.info(blob.url);
    } catch (e) {
      this.logger_.error(e?.message);
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, e?.message);
    }
    return blob;
  }

  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {

    this.logger_.debug("[DELETE]");

    try {
      await del(file.fileKey);
      this.logger_.info(file.fileKey);
    } catch (e) {
      this.logger_.error(e?.message);
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, e?.message)
    }
  }

  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    // TODO: Allow passing content disposition when getting a presigned URL

    return;
  }

}
