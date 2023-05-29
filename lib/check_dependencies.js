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
                let msg = `Invalid dependency: { ${dep}: ${version} }`;
                console.log(msg);
                throw new Error(msg);
            }
        }
    }
}

const checkDependencies = function (packageJsonPath, ignored) {
    let rawData = fs.readFileSync(packageJsonPath);
    let packageJson = JSON.parse(rawData);

    checkDependencyList(packageJson, 'dependencies');
    checkDependencyList(packageJson, 'devDependencies');
};

module.exports = checkDependencies;
