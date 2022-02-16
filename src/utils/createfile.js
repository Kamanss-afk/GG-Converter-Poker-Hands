import fs from 'fs';

export const createfileSync = destPath => {
  try{
    fs.writeFileSync(destPath, '\n');
  } catch (error) {
    throw new Error(`[CREATE FILE] -> Unable to create file: ${error.message}`);
  }
};