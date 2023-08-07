import fs from 'fs'

function get_test_file_names(directory: string): string[] {
    return fs
        .readdirSync(directory, {withFileTypes: true})
        .filter(item => item.isFile())
        .filter(item => item.name.endsWith('.json'))
        .map(item => `${directory}/${item.name}`)
}

const setInput = (name: string, value: string): void => {
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] = value
}

export {get_test_file_names, setInput}
