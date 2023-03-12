const { workspaces } = require("./package.json");
const uniq = require("lodash/uniq");

function getAffectedWorkspaces(filesNames) {
    return uniq(
        filesNames.map((file) =>
            workspaces.find((workspace) => file.includes(workspace)),
        ),
    );
}

module.exports = {
    "**/*.ts?(x)": [
        (filesNames) => {
            const affectedWorkspaces = getAffectedWorkspaces(filesNames);

            return affectedWorkspaces
                .map((workspace) => `yarn workspace ${workspace} check:types`)
                .join(" && ");
        },
        (filesNames) => {
            const affectedWorkspaces = getAffectedWorkspaces(filesNames);

            return affectedWorkspaces
                .map((workspace) => `yarn workspace ${workspace} lint`)
                .join(" && ");
        },
    ],
};
