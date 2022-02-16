import cliProgress from 'cli-progress';
import colors from 'ansi-colors';

export const progressBar = new cliProgress.SingleBar({
  format: 'Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Byte || Elapsed time: {duration}s',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
  stopOnComplete: true,
  synchronousUpdate: true,
  fps: 200,
});