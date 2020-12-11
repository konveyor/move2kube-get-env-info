/*
Copyright IBM Corporation 2020

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as fs from "fs";
import { join } from "path";
import * as core from "@actions/core";
function get_version_from_go_mod(go_mod) {
    const data = fs.readFileSync(go_mod);
    const lines = data.toString("utf-8").split("\n");
    for (const line of lines) {
        if (!line.startsWith("go ")) {
            continue;
        }
        return line.split(" ")[1];
    }
    return "";
}
function get_version_from_package_json(package_json) {
    const data = JSON.parse(fs.readFileSync(package_json).toString("utf-8"));
    if ("engines" in data && "node" in data["engines"])
        return data["engines"]["node"];
    return "";
}
function main() {
    const directory = core.getInput("dir") ? core.getInput("dir") : "./";
    core.info(`Getting information from files in directory ${directory}`);
    const files = fs.readdirSync(directory);
    core.info(`The files in the directory are:\n${files.join("\n")}`);
    let go_version = "";
    let node_version = "";
    for (const file of files) {
        const file_path = join(directory, file);
        if (file === "go.mod") {
            go_version = get_version_from_go_mod(file_path);
            continue;
        }
        if (file === "package.json") {
            node_version = get_version_from_package_json(file_path);
        }
    }
    core.setOutput("go_version", go_version);
    core.setOutput("node_version", node_version);
}
main();
//# sourceMappingURL=main.js.map