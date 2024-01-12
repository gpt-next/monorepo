#!/bin/bash

# get parameters
while getopts n:t: flag
do
  case "${flag}" in
    n) NEEDS_TAG=${OPTARG};;
    t) NEW_TAG=${OPTARG};;
  esac
done


# only tag if no tag already
if [ -z "$NEEDS_TAG" ]; then
  echo "Tagged with $NEW_TAG"
  git tag $NEW_TAG
  git push --tags
  git push
else
  echo "Already a tag on this commit"
fi

exit 0
