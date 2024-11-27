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

      // Iniciar upload multipart
      const multipartUpload = await this.s3Client.send(
        new CreateMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          ContentType: config?.contentType,
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
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: content,
        ContentType: config?.contentType ?? 'application/octet-stream',
        ContentDisposition: config?.contentDisposition,
        Metadata: config?.metadata,
        ACL: config?.acl,
      });

      await this.s3Client.send(command);
      this.logger.log(`Content uploaded successfully to S3: ${key}`);
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
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
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
}
