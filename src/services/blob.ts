import { AbstractFileProviderService, MedusaError } from "@medusajs/utils";
import { FileTypes, Logger } from "@medusajs/types";
import { put, del, list, ListCommandOptions } from "@vercel/blob";

type InjectedDependencies = {
  logger: Logger;
};

type BlobFileServiceConfig = {
  blob_read_write_token: string;
};

export class BlobFileService extends AbstractFileProviderService {
  static identifier = "blob";
  protected config_: BlobFileServiceConfig;
  protected logger_: Logger;

  constructor(
    { logger }: InjectedDependencies,
    { blob_read_write_token }: BlobFileServiceConfig
  ) {
    super();

    this.logger_ = logger;
    this.config_ = {
      blob_read_write_token,
    };
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    let blob;
    try {
      blob = await put(file.filename, file.content, {
        access: "public",
        token: this.config_.blob_read_write_token,
        addRandomSuffix: false,
      });
      this.logger_.info(blob.url);
    } catch (e) {
      this.logger_.error(e?.message);
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, e?.message);
    }
    return blob;
  }

  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
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
    // const command = new GetObjectCommand({
    //   Bucket: this.config_.bucket,
    //   Key: `${fileData.fileKey}`,
    // });

    // return await getSignedUrl(this.client_, command, {
    //   expiresIn: this.config_.downloadFileDuration,
    // });

    return;
  }

  async list(option:ListCommandOptions) {

    let option_:ListCommandOptions = {
      token:this.config_.blob_read_write_token,
      limit:option.limit||50
    }
    if (option.cursor){
      option_.cursor = option.cursor
    }
    if(option.prefix) {
      option_.prefix = option.prefix
    }

    const res = await list(option_);
    return res
  }
}
