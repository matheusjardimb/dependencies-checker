#!/usr/bin/env node

import * as core from '@actions/core'
import validateDependencies from './run_checker'

async function runChecker(): Promise<void> {
    core.info('Started validating dependencies')
    try {
        validateDependencies()
        core.info('Finished validating without errors!')
    } catch (error) {
        core.error(error as Error)
        core.setFailed(error as Error)
    }
}

runChecker()
