#!/usr/bin/env node

// Original from: https://github.com/rdmurphy/create-clone/blob/main/src/cli.ts

import mri from "mri";

async function main(argv_: string[]) {
  const { _, ...flags } = mri(argv_.slice(2));

  const force = flags.force;

  // we only care about the first command, anything else is whatever
  const [repoPath, dest = process.cwd()] = _;

  // await createClone(repoPath, dest, { force });
}

main(process.argv).catch(console.error);

