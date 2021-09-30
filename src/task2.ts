const csv = require("csvtojson");
const { pipeline } = require("stream");
const fs = require("fs");
const path = require("path");

const csvPath = path.join(__dirname, "./csv/nodejs-hw1-ex1.csv");
const jsonPath = path.join(__dirname, "./csv/example.json");

// pipeline(
//   fs.createReadStream(csvPath),
//   csv(),
//   fs.createWriteStream(jsonPath),
//   (err: any) => {
//     if (err) {
//       console.error("Pipeline failed.", err);
//     } else {
//       console.log("Pipeline succeeded.");
//     }
//   },
// );

csv()
  .fromFile(csvPath)
  .on("json", (jsonObj: any) => {
    //when parse finished, result will be emitted here.
    console.log(jsonObj);
  });
