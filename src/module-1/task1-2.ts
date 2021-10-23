import csv from "csvtojson";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";

const csvPath = path.join(__dirname, "./csv/nodejs-hw1-ex1.csv");
const jsonPath = path.join(__dirname, "./csv/result.txt");

pipeline(
  fs.createReadStream(csvPath),
  csv(),
  fs.createWriteStream(jsonPath),
  (err: any) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
  },
);
