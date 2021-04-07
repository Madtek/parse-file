#!/usr/bin/env node

//Most awesome dirty hack script
console.log("process.argv", process.argv, __dirname);

let fs = require("fs");
let readline = require("readline");
let result = {de:{}, en:{}, fr:{}, it:{}};

const defaultNs = "translation";
let useDefaultNs = false;
if (process.argv.indexOf("--ignore-ns") >= 0) {
    useDefaultNs = true;
}

let noNs = false;
if (process.argv.indexOf("--no-ns") >= 0) {
    noNs = true;
}

//FileName
let startIdx = process.argv[2].lastIndexOf("/");
startIdx = startIdx < 0 ? 0 : startIdx + 1;
const fileName = process.argv[2].slice(startIdx, process.argv[2].lastIndexOf("."));

function writeResults(rl) {
    rl.on("close", () => {
        // console.log("parse result", result);

        fs.writeFile(fileName + ".de.json", JSON.stringify(result.de), (er) => {
            if(er) {
                throw er;
            }
            console.log("SAVE DONE: " + fileName + ".de.json");
        });

        fs.writeFile(fileName + ".en.json", JSON.stringify(result.en), (er) => {
            if(er) {
                throw er;
            }
            console.log("SAVE DONE: " + fileName + ".en.json");
        });

        fs.writeFile(fileName + ".fr.json", JSON.stringify(result.fr), (er) => {
            if(er) {
                throw er;
            }
            console.log("SAVE DONE: " + fileName + ".fr.json");
        });

        fs.writeFile(fileName + ".it.json", JSON.stringify(result.it), (er) => {
            if(er) {
                throw er;
            }
            console.log("SAVE DONE: " + fileName + ".it.json");
        });
    })

}

function parseNls() {
    fs.readFile( process.argv[2], (err, data) => {
        if(err) {
            throw err;
        }
        // console.log(data.toString());

        const rl = readline.createInterface({
            input: fs.createReadStream( process.argv[2] ),
            output: process.stdout,
            console: false
        });


        let line = "";
        let idx = 0;
        let ns = "";
        let entries = [];
        rl.on("line", (input) => {
            line = input.toString();

            if(line.indexOf("<") >= 0) {
                return;
            }

            //ist eine .htm zeile
            idx = line.indexOf(".htm");
            if(idx > 0) {
                if (useDefaultNs) {
                    ns = defaultNs;
                } else {
                    ns = line.slice(0, idx);
                }

                if (noNs) {
                    //have enough entries for all
                    entries = line.split("\t");
                    if (entries.length >= 6) {
                        result.de[entries[1]] = entries[4];
                        result.en[entries[1]] = entries[4];
                        result.fr[entries[1]] = entries[5];
                        result.it[entries[1]] = entries[6];
                    }
                } else {
                    if (!result.de[ns]) {
                        result.de[ns] = {};
                        result.en[ns] = {};
                        result.fr[ns] = {};
                        result.it[ns] = {};
                    }

                    //have enough entries for all
                    entries = line.split("\t");
                    if (entries.length >= 6) {
                        result.de[ns][entries[1]] = entries[4];
                        result.en[ns][entries[1]] = entries[4];
                        result.fr[ns][entries[1]] = entries[5];
                        result.it[ns][entries[1]] = entries[6];
                    }
                }

            }
        });

        writeResults(rl);

    });
}

function parseXml() {
    fs.readFile( process.argv[2], (err, data) => {
        if(err) {
            throw err;
        }
        // console.log(data.toString());

        const rl = readline.createInterface({
            input: fs.createReadStream( process.argv[2] ),
            output: process.stdout,
            console: false
        });


        let line = "";
        let idx = 0;
        let ns = "";
        let entries = [];

        let key = 0;
        let aspect = "";
        let lang = "";
        let str = "";
        rl.on("line", (input) => {
            line = input.toString();

            if(line.indexOf("<code") >= 0) {
                idx = line.indexOf("key=") + 5;
                // idx = line.indexOf("constant=") + 10;
                key = line.slice(idx, line.indexOf("\"", idx));
            }

            if(line.indexOf("<aspect") >= 0) {
                idx = line.indexOf("name=") + 6;
                aspect = line.slice(idx, line.indexOf("\"", idx));
            }

            if(line.indexOf("<text") >= 0) {
                idx = line.indexOf("language=") + 10;
                lang = line.slice(idx, line.indexOf("\"", idx));

                if(!result[lang]) {
                    result[lang] = {};
                    if(noNs) {
                        result[lang][defaultNs] = {};
                    }
                }

                idx = line.indexOf(">", idx) + 1;
                str = line.slice(idx, line.indexOf("</", idx));

                if(noNs) {
                    result[lang][key] = str;
                }
                else {
                    result[lang][defaultNs][key] = str;
                }
            }

        });

        writeResults(rl);

    });
}


if(process.argv[2].indexOf("nls") >= 0) {
    parseNls();
}
else if (process.argv[2].indexOf("xml") >= 0) {
    parseXml();
}