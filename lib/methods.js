// remove much spaces
const removeMuchSpaces = str => {
    return str = str.replace(/ +/g, ' ');
}

// add comma to the end of parameter row
const addCommaToEnd = str => {
    return str = !str.match( /\,$/ ) ? str + ',' : str;
}

// only one space before and after arrow
const alignArrows = str => {
    return str = str.replace(/( *)\=\>( *)/g, arrow => {
        return ' => ';
    });
}

// remove much spaces after open bracket and before close bracket
const beautifyTTBrackets = line => {
    let bracketOpen = /\[\%((-|~){0,1})( *)/g;
    let bracketClose = /( *)(-|~{0,1})\%\]/g;

    if ( line.match(bracketOpen) ) {
      line = line.replace(bracketOpen, str => {
          str = str + ' ';
          str = removeMuchSpaces(str);
          return str;
      });
    }

    if ( line.match(bracketClose) && !line.match(/^( *)(-|~{0,1})\%\]/g) ) {
      line = line.replace(bracketClose, str => {
          str = ' ' + str;
          str = removeMuchSpaces(str);
          return str;
      });
    }

    return line;
}

module.exports = {
  removeMuchSpaces   : removeMuchSpaces,
  addCommaToEnd      : addCommaToEnd,
  alignArrows        : alignArrows,
  beautifyTTBrackets : beautifyTTBrackets,
};
