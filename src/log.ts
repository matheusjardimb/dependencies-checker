import * as core from '@actions/core'

function info(msg: string, quietMode: boolean): void {
    if (!quietMode) {
        core.info(msg)
    }
}

export {info}
