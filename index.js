#!/usr/bin/env node

//Most awesome dirty hack script
console.log("process.argv", process.argv, __dirname);

let fs = require("fs");
let readline = require("readline");
let result = {de:{}, en:{}, fr:{}, it:{}};

const defaultNs = "translation";
let ignnoreNs = false;
if (process.argv.indexOf("--ignore-ns") >= 0) {
    ignnoreNs = true;
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
                if(ignnoreNs) {
                    ns = defaultNs;
                }
                else {
                    ns = line.slice(0, idx);
                }

                if(!result.de[ns]) {
                    result.de[ns] = {};
                    result.en[ns] = {};
                    result.fr[ns] = {};
                    result.it[ns] = {};
                }

                //have enough entries for all
                entries = line.split("\t");
                if(entries.length >= 6) {
                    result.de[ns][entries[1]] = entries[4];
                    result.en[ns][entries[1]] = entries[4];
                    result.fr[ns][entries[1]] = entries[5];
                    result.it[ns][entries[1]] = entries[6];
                }
            }
        });

        rl.on("close", () => {
            // console.log("parse result", result);

            fs.writeFile("result.json", JSON.stringify(result), (er) => {
                if(er) {
                    throw er;
                }
                console.log("SAVE result file DONE.");
            });
        })

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
        rl.on("line", (input) => {
            line = input.toString();

            if(line.indexOf("<") >= 0) {
                return;
            }

            //ist eine .htm zeile
            idx = line.indexOf(".htm");
            if(idx > 0) {
                if(ignnoreNs) {
                    ns = defaultNs;
                }
                else {
                    ns = line.slice(0, idx);
                }

                if(!result.de[ns]) {
                    result.de[ns] = {};
                    result.en[ns] = {};
                    result.fr[ns] = {};
                    result.it[ns] = {};
                }

                //have enough entries for all
                entries = line.split("\t");
                if(entries.length >= 6) {
                    result.de[ns][entries[1]] = entries[4];
                    result.en[ns][entries[1]] = entries[4];
                    result.fr[ns][entries[1]] = entries[5];
                    result.it[ns][entries[1]] = entries[6];
                }
            }
        });

        rl.on("close", () => {
            // console.log("parse result", result);

            fs.writeFile("result.json", JSON.stringify(result), (er) => {
                if(er) {
                    throw er;
                }
                console.log("SAVE result file DONE.");
            });
        })

    });
}

    
if(process.argv[2].indexOf("nls") >= 0) {
    parseNls();
}
else if (process.argv[2].indexOf("xml") >= 0) {
    parseXml();
}
else {
    console.log("example Usage: npx @madtek/parse-file ./url --ignore-ns")
}