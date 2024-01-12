#!/bin/bash

# get parameters
while getopts t: flag
do
  case "${flag}" in
    t) NEW_TAG=${OPTARG};;
  esac
done

echo "Tagged with $NEW_TAG"
git tag $NEW_TAG
git push --tags
git push

exit 0
