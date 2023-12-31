import { CreateDependencies } from "@nx/devkit";


export const createDependencies: CreateDependencies = (opts, ctx) => {
    var results = [];
    const nxProjects = Object.values(ctx.projects);
    console.log('nxProjects', nxProjects);
    const filesToProcess = Object.values(ctx.filesToProcess);
    console.log('filesToProcess', filesToProcess);
    return results
}