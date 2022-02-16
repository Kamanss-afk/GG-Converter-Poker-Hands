import fs from 'fs';
import stream from 'stream';
import path from 'path';
import os from 'os';

import { progressBar } from './utils/progress-bar.js';
import { createfileSync } from './utils/create-file.js';
import { stringTransformer } from './utils/transformer-string.js';
import { log } from './utils/logger.js'

const srcPath = process.argv[2];
const destPath = path.join(os.homedir(), 'Desktop/result.txt');

const main = () => {
  try {
    if(!fs.existsSync(srcPath)) throw new Error('The file on the specified path does not exist!');

    createfileSync(destPath);

    progressBar.start(fs.statSync(srcPath).size, 0);

    const readStream = fs.createReadStream(srcPath);
    const writeStream = fs.createWriteStream(destPath);
    
    const transformStream = new stream.Transform({
      transform(buffer, encoding, done) {
        const lines = buffer.toString().split('\n');
        const transformedChunkAsString = stringTransformer(lines).join('\n');
        const transformedBuffer = Buffer.from(transformedChunkAsString);
        this.push(transformedBuffer); 
        done();
      }
    });
    
    readStream.on('data', () => progressBar.update(readStream.bytesRead));
    readStream.on('close', () => log.info(`The file was successfully created: ${destPath}`));
    readStream.on('error', error => log.error(error));
    
    writeStream.on('error', error => log.error(error));
    transformStream.on('error', () => log.error(error));
    
    readStream.pipe(transformStream).pipe(writeStream);
  } catch (error) {
    log.error(`[MAIN] -> Error: ${error}`);
  }
};

main();