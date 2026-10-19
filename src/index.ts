#!/usr/bin/env node

import * as core from '@actions/core'
import validateDependencies from './run_checker'

async function runChecker(): Promise<void> {
    try {
        validateDependencies(process.argv.slice(2))
    } catch (error) {
        core.setFailed(error as Error)
    }
}

runChecker()
