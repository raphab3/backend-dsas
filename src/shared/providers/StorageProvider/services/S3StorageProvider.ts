import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  HeadObjectCommand,
  DeleteObjectsCommand,
  UploadPartCommand,
  CreateMultipartUploadCommand,
  CompletedPart,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '@config/env';

interface S3UploadConfig {
  contentType?: string;
  contentDisposition?: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read' | 'public-read-write';
}

interface S3PaginationOptions {
  maxKeys?: number;
  prefix?: string;
  continuationToken?: string;
}

@Injectable()
export class S3Provider {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Provider.name);
  private readonly bucket: string;
  private readonly CHUNK_SIZE = 5 * 1024 * 1024;

  constructor() {
    this.logger.log(`Bucket configurado: ${env.AWS_S3_BUCKET}`);
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = env.AWS_S3_BUCKET;
  }

  /**
   * Faz upload de um arquivo para o S3
   */
  async uploadFile(
    filePath: string,
    key: string,
    config?: { contentType?: string; metadata?: Record<string, string> },
  ): Promise<string> {
    try {
      const fileStats = await stat(filePath);
      this.logger.log(
        `Iniciando upload multipart - Tamanho do arquivo: ${fileStats.size} bytes`,
      );

      // Determinar o Content-Type baseado na extensão do arquivo
      const contentType =
        config?.contentType || this.getContentTypeFromKey(key);

      // Iniciar upload multipart
      const multipartUpload = await this.s3Client.send(
        new CreateMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          ContentType: contentType,
          Metadata: config?.metadata,
        }),
      );

      const uploadId = multipartUpload.UploadId;
      const completedParts: CompletedPart[] = [];
      const fileStream = createReadStream(filePath, {
        highWaterMark: this.CHUNK_SIZE,
      });

      let partNumber = 1;
      let buffer = Buffer.alloc(0);

      try {
        for await (const chunk of fileStream) {
          buffer = Buffer.concat([buffer, chunk]);

          // Se temos um chunk completo ou é o último pedaço
          if (buffer.length >= this.CHUNK_SIZE) {
            const part = await this.uploadPart(
              key,
              uploadId!,
              partNumber,
              buffer,
            );

            completedParts.push({
              PartNumber: partNumber,
              ETag: part.ETag,
            });

            this.logger.log(`Parte ${partNumber} enviada com sucesso`);

            partNumber++;
            buffer = Buffer.alloc(0);
          }
        }

        // Enviar o último pedaço se houver
        if (buffer.length > 0) {
          const part = await this.uploadPart(
            key,
            uploadId!,
            partNumber,
            buffer,
          );

          completedParts.push({
            PartNumber: partNumber,
            ETag: part.ETag,
          });

          this.logger.log(`Última parte ${partNumber} enviada com sucesso`);
        }

        // Completar o upload multipart
        await this.s3Client.send(
          new CompleteMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
              Parts: completedParts.sort(
                (a, b) => (a.PartNumber || 0) - (b.PartNumber || 0),
              ),
            },
          }),
        );

        this.logger.log(`Upload multipart concluído com sucesso para: ${key}`);
        return key;
      } catch (error) {
        // Em caso de erro, abortar o upload multipart
        await this.s3Client.send(
          new AbortMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            UploadId: uploadId,
          }),
        );
        throw error;
      }
    } catch (error) {
      this.logger.error(`Erro no upload multipart: ${error.message}`);
      throw error;
    }
  }

  private async uploadPart(
    key: string,
    uploadId: string,
    partNumber: number,
    buffer: Buffer,
  ) {
    const command = new UploadPartCommand({
      Bucket: this.bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: buffer,
    });

    return await this.s3Client.send(command);
  }

  /**
   * Faz upload de um buffer ou stream para o S3
   */
  async uploadContent(
    content: Buffer | Readable,
    key: string,
    config?: S3UploadConfig,
  ): Promise<string> {
    try {
      // Determinar Content-Type baseado na extensão se não for especificado
      const contentType =
        config?.contentType || this.getContentTypeFromKey(key);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: content,
        ContentType: contentType,
        ContentDisposition: config?.contentDisposition || 'inline',
        Metadata: config?.metadata,
        ACL: config?.acl,
      });

      await this.s3Client.send(command);
      this.logger.log(
        `Content uploaded successfully to S3: ${key} with ContentType: ${contentType}`,
      );
      return key;
    } catch (error) {
      this.logger.error(`Failed to upload content to S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gera uma URL pré-assinada para download
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      // Determinar o Content-Type baseado na extensão
      const contentType = this.getContentTypeFromKey(key);
      const isPdf = contentType === 'application/pdf';

      // Configurar o objeto GetObject com os parâmetros apropriados
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: contentType,
        ResponseContentDisposition: isPdf ? 'inline' : 'attachment',
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtém um objeto do S3 como stream
   */
  async getObjectStream(key: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return response.Body as Readable;
    } catch (error) {
      this.logger.error(`Failed to get object stream: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lista objetos em um diretório
   */
  async listObjects(options?: S3PaginationOptions) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        MaxKeys: options?.maxKeys,
        Prefix: options?.prefix,
        ContinuationToken: options?.continuationToken,
      });

      return await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Failed to list objects: ${error.message}`);
      throw error;
    }
  }

  /**
   * Faz download do conteúdo de um objeto do S3
   */
  async downloadContent(key: string): Promise<Buffer> {
    try {
      this.logger.debug(`Downloading content from S3: ${key}`);

      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      this.logger.debug(`S3 response received for ${key}, content type: ${response.ContentType}`);

      // Converter o stream para um buffer
      if (response.Body instanceof Readable) {
        const buffer = await this.streamToBuffer(response.Body);
        this.logger.debug(`Content converted to buffer: type=${typeof buffer}, isBuffer=${Buffer.isBuffer(buffer)}, length=${buffer.length}`);
        return buffer;
      } else {
        this.logger.error(`S3 response body is not a readable stream for ${key}`);
        throw new Error('S3 response body is not a readable stream');
      }
    } catch (error) {
      this.logger.error(`Failed to download content from S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Converte um stream para buffer
   */
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => {
        this.logger.debug(`Received chunk: type=${typeof chunk}, isBuffer=${Buffer.isBuffer(chunk)}, length=${chunk.length || 'unknown'}`);
        chunks.push(Buffer.from(chunk));
      });

      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        this.logger.debug(`Stream converted to buffer: chunks=${chunks.length}, total size=${buffer.length}`);
        resolve(buffer);
      });

      stream.on('error', (err) => {
        this.logger.error(`Error converting stream to buffer: ${err.message}`);
        reject(err);
      });
    });
  }

  /**
   * Copia um objeto dentro do S3
   */
  async copyObject(sourceKey: string, destinationKey: string) {
    try {
      const command = new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${sourceKey}`,
        Key: destinationKey,
      });

      await this.s3Client.send(command);
      this.logger.log(`Object copied from ${sourceKey} to ${destinationKey}`);
    } catch (error) {
      this.logger.error(`Failed to copy object: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica se um objeto existe
   */
  async objectExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Deleta um objeto do S3
   */
  async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Object deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete object: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deleta múltiplos objetos do S3
   */
  async deleteObjects(keys: string[]): Promise<void> {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: {
          Objects: keys.map((Key) => ({ Key })),
        },
      });

      await this.s3Client.send(command);
      this.logger.log(`${keys.length} objects deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete objects: ${error.message}`);
      throw error;
    }
  }

  /**
   * Determina o Content-Type baseado na extensão do arquivo
   */
  private getContentTypeFromKey(key: string): string {
    const extension = key.split('.').pop()?.toLowerCase();

    const mimeTypes = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      html: 'text/html',
      csv: 'text/csv',
      zip: 'application/zip',
    };

    return extension && mimeTypes[extension]
      ? mimeTypes[extension]
      : 'application/octet-stream';
  }
}
