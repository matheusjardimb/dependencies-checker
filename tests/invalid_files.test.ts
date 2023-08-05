import { describe, expect, it } from "@jest/globals";
import { InvalidPackageFileError } from "../src/errors";
import { get_test_file_names, setInput } from "../src/utils";
import { packageJsonPathKey } from "../src/constants";
import validateDependencies from "../src/run_checker";

const invalidJsonFiles = ["non_existing_package.json", ...get_test_file_names("tests/invalid_files")];

describe("Test invalid/malformed json files", () => {
    for (const filePath of invalidJsonFiles) {
        it(`${filePath} should throw InvalidPackageFileError`, () => {
            expect(() => {
                setInput(packageJsonPathKey, filePath);
                return validateDependencies();
            }).toThrow(InvalidPackageFileError);
        });
    }
});
