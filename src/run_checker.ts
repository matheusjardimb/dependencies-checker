import * as core from '@actions/core'
import {globSync, isDynamicPattern} from 'tinyglobby'
import checkDependencies from './check_dependencies'
import {packageJsonPathDefault, packageJsonPathKey, quietModeKey} from './constants'
import {InvalidPackageFileError, MultipleFilesError, UnknownOptionError} from './errors'
import {info} from './log'

type cliOptionsType = {paths: string[]; quiet: boolean}

function parseCliArgs(args: string[]): cliOptionsType {
    const options: cliOptionsType = {paths: [], quiet: false}
    for (const arg of args) {
        if (arg === '--quiet' || arg === '-q') {
            options.quiet = true
        } else if (arg.startsWith('-')) {
            throw new UnknownOptionError(arg)
        } else {
            options.paths.push(arg)
        }
    }
    return options
}

function getQuietMode(cliQuiet: boolean): boolean {
    const quietMode = core.getInput(quietModeKey)
    return cliQuiet || quietMode.toLowerCase() === 'true'
}

function getPackageJsonPatterns(cliPaths: string[], quietMode: boolean): string[] {
    if (cliPaths.length > 0) {
        return cliPaths
    }
    const inputPaths = core.getMultilineInput(packageJsonPathKey)
    if (inputPaths.length > 0) {
        return inputPaths
    }
    info(`Parameter packageJsonPath not informed.`, quietMode)
    return [packageJsonPathDefault]
}

function expandPatterns(patterns: string[]): string[] {
    const packageJsonPaths: string[] = []
    for (const pattern of patterns) {
        if (!isDynamicPattern(pattern)) {
            packageJsonPaths.push(pattern)
            continue
        }
        const matches = globSync(pattern, {ignore: ['**/node_modules/**'], expandDirectories: false})
        if (matches.length === 0) {
            throw new InvalidPackageFileError(pattern)
        }
        packageJsonPaths.push(...matches.sort())
    }
    return [...new Set(packageJsonPaths)]
}

function validateDependencies(cliArgs: string[] = []): void {
    const options = parseCliArgs(cliArgs)
    const quietMode = getQuietMode(options.quiet)
    const packageJsonPaths = expandPatterns(getPackageJsonPatterns(options.paths, quietMode))

    if (packageJsonPaths.length === 1) {
        info(`Reading '${packageJsonPaths[0]}' file`, quietMode)
        checkDependencies(packageJsonPaths[0], quietMode)
        return
    }

    let failures = 0
    for (const packageJsonPath of packageJsonPaths) {
        info(`Reading '${packageJsonPath}' file`, quietMode)
        try {
            checkDependencies(packageJsonPath, quietMode)
        } catch (error) {
            // One line per file, so each failure gets its own annotation in GitHub and stays readable elsewhere
            core.error(`${packageJsonPath}: ${(error as Error).message}`)
            failures++
        }
    }
    if (failures > 0) {
        throw new MultipleFilesError(failures, packageJsonPaths.length)
    }
}

export default validateDependencies
