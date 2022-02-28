import fs from 'fs';
import stream, { pipeline } from 'stream';
import path from 'path';
import os from 'os';

import { stringTransformer } from './utils/transformer-string.js';
import { log } from './utils/logger.js'

let srcPath = process.argv[2];

const main = async () => {
  try {
    if(!fs.existsSync(srcPath)) throw new Error('The file on the specified path does not exist!');
      
    const srcFiles = fs
      .readdirSync(srcPath)
      .filter(fileName => fileName.match(/.txt/g))
      .map(fileName => [srcPath, fileName].join('/').replace(/\\\\/g, '/'));
    
    if(!srcFiles.length) throw new Error('The directory does not contain files!');

    const destPath = path.join(os.homedir(), 'Desktop', 'ResultHands');
    fs.mkdirSync(destPath);

    log.warn(`The file processing process has started! Please wait...`);

    for (const file of srcFiles) {
      try {
        const readStream = fs.createReadStream(file);
        const writeStream = fs.createWriteStream(path.join(destPath, file.split('/').pop()));
        
        const transformStream = new stream.Transform({
          transform(buffer, encoding, done) {
            const lines = buffer.toString().split('\n');
            const transformedChunkAsString = stringTransformer(lines).join('\n');
            const transformedBuffer = Buffer.from(transformedChunkAsString);
            this.push(transformedBuffer); 
            done();
          }
        });

        pipeline(readStream, transformStream, writeStream, () => {})
          .on('error', error => { throw new Error(error) })
          .on('finish', () => {
            log.info('--> Files processed successfully! <--');
            process.exit();
          })
        
      } catch(error) {
        throw new Error(`Error: ${file}`);
      }

    };

  } catch (error) {
    log.error(`[MAIN] -> Error: ${error}`);
  }
};

main();