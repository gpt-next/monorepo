import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { AppGeneratorSchema } from './schema';

export async function appGenerator(tree: Tree, options: AppGeneratorSchema) {
  const projectRoot = `apps/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      serve: {
        command: `go run ./apps/${options.name}/src/main.go`,
      },
      'build-mac': {
        command: `GOOS=darwin go build --race -o ./dist/apps/${options.name}/main ./apps/${options.name}/src/main.go`,
      },
      'package-mac': {
        dependsOn: ['build-mac'],
        command:
          'docker build -f apps/test/Dockerfile . -t ghcr.io/gpt-next/monorepo-test:latest-local',
      },
      build: {
        command: `GOOS=linux go build --race -o ./dist/apps/${options.name}/main ./apps/${options.name}/src/main.go`,
        outputs: [`{workspaceRoot}/dist/apps/${options.name}/main`],
      },
      package: {
        dependsOn: ['build'],
        command: `docker build -f apps/${options.name}/Dockerfile . -t ghcr.io/gpt-next/monorepo-${options.name}:$IMAGE_TAG`,
      },
      lint: {
        command: `go vet ./apps/${options.name}/src/...`,
      },
      test: {
        command: `go test ./apps/${options.name}/src/...`,
      },
    },
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    isLambda: options.deployment === 'lambda',
  });
  await formatFiles(tree);
}

export default appGenerator;
