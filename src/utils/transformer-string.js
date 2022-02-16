export const stringTransformer = lines => {
  try {
    return lines.reduce((accumulator, line, index, lines) => {
      if(line.match(/Poker/)) line = line.replace(/Poker/g, 'PokerStars'); // Replace "Poker"
      if(line.match(/#HD/)) line = line.replace(/#HD/g, '#11'); // Replace "HD"
      if(line.match(/Dealt to (?!Hero)(\w)+/g)) return accumulator;  // Skip "Dealt to [id]" lines
      if(line.match(//g)) return accumulator; // Skip lines with  symbols
      if(index != 0 && line == lines[index - 1]) return accumulator; // Skip duplicated lines
  
      return [...accumulator, line];
    }, [])
  } catch (error) {
    throw new Error(`[TRANSFORMER STRING] -> String transformation error: ${error.message}`);
  }
};