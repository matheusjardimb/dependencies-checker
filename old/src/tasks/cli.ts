#!/usr/bin/env node

/* eslint-disable no-console */

// Inspired by https://github.com/rdmurphy/create-clone/blob/main/src/cli.ts

import mri from 'mri'
import {packageJsonPath_default} from '../consts'
import checkDependencies from '../check_dependencies'

const cleanup = (): void => {
    console.log('Cleaning up.')
}

const handleExit = (): void => {
    cleanup()
    console.log('Exiting without error.')
    process.exit()
}

const handleError = (e: Error): void => {
    console.error('ERROR! An error was encountered while executing')
    console.error(e)
    cleanup()
    console.log('Exiting with error.')
    process.exit(1)
}

process.on('SIGINT', handleExit)
process.on('uncaughtException', handleError)

async function main(argv_: string[]): Promise<void> {
    const args = mri(argv_.slice(2), {
        string: ['packageJsonPath'],
        default: {
            packageJsonPath: packageJsonPath_default
        }
    })
    const dest = process.cwd()
    const packageJsonFilePath = `${dest}/${args.packageJsonPath}`

    checkDependencies(packageJsonFilePath)
}

// eslint-disable-next-line github/no-then
main(process.argv).catch(handleError).then(handleExit)
