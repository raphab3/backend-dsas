import * as crypto from 'crypto';
import multer from 'multer';
import { extname, resolve } from 'path';
import { promises as fs } from 'fs';

export const storageConfig = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = resolve('uploads');

    try {
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      console.error(`Error while creating directory: ${error}`);
      cb(error, '');
    }
  },

  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, res) => {
      if (err) return cb(err, '');

      return cb(null, res.toString('hex') + extname(file.originalname));
    });
  },
});

export const uploadConfig = multer({});
