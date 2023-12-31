import {
  CreateDependencies,
  DependencyType,
  validateDependency,
} from '@nx/devkit';
import * as fs from 'fs';

export const createDependencies: CreateDependencies = (opts, ctx) => {
  var projects = Object.values(ctx.projects);
  //Get all of the go projects mod files to get the module names
  var modules = [];
  for (var i = 0; i < projects.length; i++) {
    const checkForGoModFile = `${ctx.workspaceRoot}/${projects[i].root}/go.mod`;
    if (fs.existsSync(checkForGoModFile)) {
      modules.push({
        projectName: projects[i].name,
        moduleName: parseGoModModuleNames(checkForGoModFile)[0],
      });
    }
  }

  var results = [];

  for (var i = 0; i < projects.length; i++) {
    const projectName = projects[i].name;
    var goFiles = [];
    try {
      goFiles = ctx.filesToProcess.projectFileMap[projectName].filter((e) =>
        e.file.endsWith('.go'),
      );
    } catch (e) {
      continue;
    }

    for (var j = 0; j < goFiles.length; j++) {
      const goFilePath = `${ctx.workspaceRoot}/${goFiles[j].file}`;
      parseGoImports(goFilePath).forEach((importPath) => {
        const moduleMatch = modules.filter((m) => {
          try {
            const moduleroot = importPath.split('/src/')[0];
            return moduleroot === m.moduleName;
          } catch (e) {
            return false;
          }
        });
        if (moduleMatch.length > 0) {
          const newDependency = {
            source: projectName,
            target: moduleMatch[0].projectName,
            sourceFile: goFiles[j].file,
            type: DependencyType.static,
          };
          validateDependency(newDependency, ctx);
          results.push(newDependency);
        } else if (importPath.startsWith('github.com')) {
          const newDependency = {
            source: projectName,
            target: importPath,
            sourceFile: goFiles[j].file,
            type: DependencyType.implicit,
          };
          validateDependency(newDependency, ctx);
          results.push(newDependency);
        }
      });
    }
  }

  return results;
};

function parseGoImports(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s*\(\s*([\s\S]*?)\s*\)/g;
  const importStatementRegex = /"([^"]+)"/g;

  const imports: string[] = [];

  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    const importBlock = match[1];
    let importMatch;
    while ((importMatch = importStatementRegex.exec(importBlock)) !== null) {
      imports.push(importMatch[1]);
    }
  }

  return imports;
}

function parseGoModModuleNames(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const moduleRegex = /module\s+([\w/.-]+)/g;

  const moduleNames: string[] = [];

  let match;
  while ((match = moduleRegex.exec(fileContent)) !== null) {
    const moduleName = match[1];
    moduleNames.push(moduleName);
  }

  return moduleNames;
}
