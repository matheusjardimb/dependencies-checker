#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const cleanup = () => {
  console.log("Cleaning up.");
};

const handleExit = () => {
  cleanup();
  console.log("Exiting without error.");
  process.exit();
};

const handleError = e => {
  console.error("ERROR! An error was encountered while executing");
  console.error(e);
  cleanup();
  console.log("Exiting with error.");
  process.exit(1);
};

process.on("SIGINT", handleExit);
process.on("uncaughtException", handleError);

console.log("Started");

// Cleanup
handleExit();
