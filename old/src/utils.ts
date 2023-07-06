import fs from 'fs'

function get_test_file_names(directory: string): string[] {
    return fs
        .readdirSync(directory, {withFileTypes: true})
        .filter(item => item.isFile())
        .filter(item => item.name.endsWith('.json'))
        .map(item => `${directory}/${item.name}`)
}
export default get_test_file_names
