#!/bin/bash
# One-time migration: add slug-based labels to existing Gitalk issues
# so the standard gitalk library can find them.
#
# The old gatsby-plugin-gitalk (@suziwen/gitalk fork) matched issues by
# searching the body for "Gitalk_<slug>". The standard gitalk library
# matches by GitHub issue labels. This script bridges the gap.
#
# For slugs > 50 chars (GitHub label limit), we use an MD5 hash instead,
# matching the logic in gatsby-node.js.

set -euo pipefail

REPO="izackwu/blog"
MAX_LABEL_LENGTH=50

gh api "repos/$REPO/issues?labels=Gitalk&state=all&per_page=100" --jq '
  .[] | select(.body | test("Gitalk_")) |
  {number, slug: (.body | capture("Gitalk_(?<id>[^ \\n]+)") | .id)} |
  "\(.number)\t\(.slug)"
' | while IFS=$'\t' read -r number slug; do
  if [ ${#slug} -gt $MAX_LABEL_LENGTH ]; then
    label=$(echo -n "$slug" | md5sum | cut -d' ' -f1)
    echo "Issue #$number: slug '$slug' (${#slug} chars) -> MD5 label '$label'"
  else
    label="$slug"
    echo "Issue #$number: label '$label'"
  fi

  gh api "repos/$REPO/issues/$number/labels" --method POST -f "labels[]=$label" --silent
done

echo "Done!"
