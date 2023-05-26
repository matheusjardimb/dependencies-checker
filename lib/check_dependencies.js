const fs = require("fs");

// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies

function isValidDependency(dep) {
    // TODO: this method can be drastically improved, leaving this way just for testing
    return !(dep.includes('^') || dep.includes('~') || dep.includes('>') || dep.includes('<'));
}

function checkDependencyList(dependencyList, dependencyKey) {
    if (dependencyKey in dependencyList) {
        for (const [dep, version] of Object.entries(dependencyList[dependencyKey])) {
            if (!isValidDependency(version)) {
                console.log(`Invalid dependency: { ${dep}: ${version} }`);
                return false;
            }
        }
    }
    return true;
}

const checkDependencies = function (ignored) {
    let rawData = fs.readFileSync('package.json');
    let packageJson = JSON.parse(rawData);

    return (
        checkDependencyList(packageJson, 'dependencies') &&
        checkDependencyList(packageJson, 'devDependencies')
    );
};

module.exports = checkDependencies;
