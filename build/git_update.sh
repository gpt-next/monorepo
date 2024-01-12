#!/bin/bash

VERSION=""
RC_NUM=0

# get parameters
while getopts v: flag
do
  case "${flag}" in
    v) VERSION=${OPTARG};;
  esac
done

# get highest tag number, and add v0.1.0 if doesn't exist
git fetch --prune --unshallow 2>/dev/null
CURRENT_VERSION=`git describe --abbrev=0 --tags 2>/dev/null`

if [[ $CURRENT_VERSION == '' ]]; then
  # If no tags exist, start with v${VERSION}.0-rc1
  echo "No tags exist, starting with v${VERSION}.0-rc1"
  CURRENT_VERSION="v${VERSION}.0-rc1"
else
  # Extract release candidate number from the latest tag
  RELEASE_CANDIDATE=$(echo "$CURRENT_VERSION" | awk -F'[-rc]' '{print $2}')
  
  if [ -z "$RELEASE_CANDIDATE" ]; then
    echo "No release candidate number found in tag $CURRENT_VERSION"
    # If the latest tag is not a release candidate, reset RC_NUM and increment minor version
    RC_NUM=1
    VERSION_PARTS=(${CURRENT_VERSION//./ })
    MAJOR_VERSION=${VERSION_PARTS[0]}
    MINOR_VERSION=${VERSION_PARTS[1]}
    PATCH_VERSION=$((VERSION_PARTS[2]+1))
    CURRENT_VERSION="$MAJOR_VERSION.$MINOR_VERSION.$PATCH_VERSION"
  else
    echo "Release candidate number $RELEASE_CANDIDATE found in tag $CURRENT_VERSION"
    # If the latest tag is a release candidate, increment the release candidate number
    RC_NUM=$((RELEASE_CANDIDATE+1))
  fi
fi

echo "Current Version: $CURRENT_VERSION"

# replace . and - with space so can split into an array
CURRENT_VERSION_PARTS=(${CURRENT_VERSION//-/ })
CURRENT_VERSION_PARTS=(${CURRENT_VERSION_PARTS[0]//./ })
VNUM1=${CURRENT_VERSION_PARTS[0]}
VNUM2=${CURRENT_VERSION_PARTS[1]}
VNUM3=${CURRENT_VERSION_PARTS[2]}
echo "$VNUM1.$VNUM2.$VNUM3"

# create new tag
NEW_TAG="$VNUM1.$VNUM2.$VNUM3-rc$RC_NUM"
echo "($VERSION) updating $CURRENT_VERSION to $NEW_TAG"

# get current hash and see if it already has a tag
GIT_COMMIT=`git rev-parse HEAD`
NEEDS_TAG=`git describe --contains $GIT_COMMIT 2>/dev/null`

# only tag if no tag already
if [ -z "$NEEDS_TAG" ]; then
  echo "Tagged with $NEW_TAG"
  git tag $NEW_TAG
  git push --tags
  git push
else
  echo "Already a tag on this commit"
fi
echo "git-tag=$NEW_TAG" >> "$GITHUB_ENV"

exit 0
