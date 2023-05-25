const fs = require("fs");

const check_dependencies = function (ignored) {
    return new Promise((resolve) => {
        let rawData = fs.readFileSync('package.json');
        let packageJson = JSON.parse(rawData);
        console.log(packageJson['dependencies']);
        console.log(packageJson['devDependencies']);
        console.log(student);
    });
};

module.exports = check_dependencies;
