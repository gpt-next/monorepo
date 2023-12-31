import { CreateDependencies, DependencyType } from '@nx/devkit';

export const createDependencies: CreateDependencies = (opts, ctx) => {
  var results = [
    {
      source: 'test',
      target: 'some-target',
      sourceFile: 'main.go',
      type: DependencyType.implicit,
    },
  ];
  throw new Error('test');

  return results;
};
