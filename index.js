#!/usr/bin/env node
'use strict';

// Modules
const methods  = require('./lib/methods.js');
const fs       = require('fs');
const glob     = require('glob');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));

let bracketsPair = [];
let skipLines = [];
let isParamsEnd = true;
let paramsEndLines = [];

if (args.hasOwnProperty('files')) {
    const filesPath = args.files;

    glob(filesPath, {}, function(er, files){
        files.forEach(function(file){
            run(file);
        });
    });
}

function run (filename) {

    // read file, split lines as array cells, transform and write
    fs.readFile(filename, function(err, fileContent) {
        fileContent = fileContent.toString().split('\n');
        let outputArray = [];

        for (let line = 0; line < fileContent.length; line++) { // start scan lines

          // add html.body.stylesheets
          fileContent[line] = fileContent[line].replace( /html\.stylesheets\.push/g, 'html.body.stylesheets.push' );

          // beautify brackets
          fileContent[line] = methods.beautifyTTBrackets(fileContent[line]);

          // split params in one line
          if ( fileContent[line].match( /params( *)=>( *)\{( *)\S(.*)\}/g ) ) {

            let paramLines   = [];
            let parameters   = fileContent[line].match( /\{(.*)\}/g).toString().slice(1).slice(0, -1).trim();
            let arrows       = parameters.match( /\=\>/g );
            let restSymbols  = fileContent[line].match( /\}(.*)/g).toString().trim();
            let indentLength = fileContent[line].match( /( *)/ )[0];
            let indent       = '';

            for (let i = 0; i < indentLength.length; i++) {
              indent = indent + ' ';
            }

            fileContent[line] = fileContent[line].replace(restSymbols,'').trim();
            restSymbols = restSymbols.split(' ');

            for (var i = 0; i < arrows.length; i++) {
              let parametersPair = fileContent[line].match(/(\S*)( *)(=>[^=>]+)( *)$/g)[0];
              paramLines.push(indent + '\t\t\t' + parametersPair);
              fileContent[line] = fileContent[line].replace(parametersPair,'').trim();
            }

            paramLines.push(indent + '\t\t' + restSymbols[0]);
            paramLines.push(indent + '\t'   + restSymbols[1]);

            // Line indentation
            fileContent[line] = indent + fileContent[line];

            // insert params
            fileContent.splice(line + 1, 0, ...paramLines);

          }

          // save params end rows
          if ( fileContent[line].match( /params( *)\=\>( *)\{/g ) ) {
              for (let j = line+1; j < fileContent.length; j++) {
                if ( fileContent[j].match( /\{/ ) ) {
                  isParamsEnd = false;
                }
                if (fileContent[j].match( /\}/ ) && !isParamsEnd) {
                  isParamsEnd = true;
                  continue;
                }
                if (fileContent[j].match( /\}/ ) && isParamsEnd) {
                  paramsEndLines.push(j);
                  break;
                }
              }
          }

          // find blocks with params
          if ( fileContent[line].match( /params( *)\=\>( *)\{/g ) ) {

            // beautify params row
            fileContent[line] = fileContent[line].replace(/params( *)\=\>( *)\{/g, str => {
                str = 'params => {';
                return str;
            });

            // find brackets and push them into array
            for (let j = line+1; j < fileContent.length; j++) {

              if (fileContent[j].match( /\}/ ) && paramsEndLines.includes(j)) break;
              fileContent[j] = methods.alignArrows(fileContent[j]);

              if (fileContent[j].match( /\{/ )) {
                for (let l = j+1; l < fileContent.length; l++) {
                  if (fileContent[l].match( /\}/ )) {
                    fileContent[l] = methods.addCommaToEnd(fileContent[l]);
                    bracketsPair.push({'open': j,'close': l});
                    break;
                  }
                }
              }

              if (fileContent[j].match( /\=\>( *)\[/ )) {
                for (let l = j; l < fileContent.length; l++) {
                  skipLines.push(l);
                  if (fileContent[l].match( /\]/ )) {
                    skipLines.push(l);
                    break;
                  }
                }
              }

            }

          } // end params

          outputArray.push(fileContent[line]);
        } // end scan lines

        fileContent = outputArray.join('\n');



        // Split again

        fileContent = fileContent.toString().split('\n');
        let longestKey = 0;

        while (bracketsPair.length) {

          // skip lines for inner parameters
          for (let i = bracketsPair[0].open; i < bracketsPair[0].close+1; i++) {
            skipLines.push(i);
          }

          // trnasform inner parameters
          for (let i = bracketsPair[0].open + 1; i < bracketsPair[0].close; i++) {
            fileContent[i] = methods.addCommaToEnd(fileContent[i]);

            let key = fileContent[i].match(/[\S]+/);
            if (key && key.length) {
              longestKey = Math.max(longestKey, key[0].length);
            }
          }

          for (let i = bracketsPair[0].open +1; i < bracketsPair[0].close; i++) {
            fileContent[i] = fileContent[i].replace(/[\S]+/, str => {
                while (str.length < longestKey) {
                  str = str + ' ';
                }
                return str;
            });
          }

          longestKey = 0;
          bracketsPair.splice(0,1); // remove first element from bracketsPair

        } // end while

        for (let line = 0; line < fileContent.length; line++) {

          if ( fileContent[line].match( /params( *)\=\>( *)\{/g ) ) {

            // beautify params row
            fileContent[line] = fileContent[line].replace(/params( *)\=\>( *)\{/g, str => {
                str = 'params => {';
                return str;
            });

            for (let j = line+1; j < fileContent.length; j++) {
              if (fileContent[j].match( /\}/ ) && paramsEndLines.includes(j)) break;
              if (skipLines.includes(j)) continue;

              fileContent[j] = methods.addCommaToEnd(fileContent[j]);

              let key = fileContent[j].match(/[\S]+/);
              if (key && key.length) {
                longestKey = Math.max(longestKey, key[0].length);
              }

            }

            for (let j = line+1; j < fileContent.length; j++) {
              if (fileContent[j].match( /\}/ ) && paramsEndLines.includes(j)) break;
              if (skipLines.includes(j)) continue;

              fileContent[j] = fileContent[j].replace(/[\S]+/, str => {
                  while (str.length < longestKey) {
                    str = str + ' ';
                  }
                  return str;
              });

            }

          } // end params

          longestKey = 0;
        }

        fileContent = fileContent.join('\n');

        fs.writeFile(filename, fileContent, 'utf8', error => {
           if (error) return console.log(error);
        });
    });
}
