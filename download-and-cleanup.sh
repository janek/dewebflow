#!/bin/bash
BASE_URL="https://untested.webflow.io"

# Pull and prettify index.html
wget -nv -O "index.html" $BASE_URL
prettier -w *.html

# Deletions for webflow branding and fluff
# sed -i "" -e "/data-wf/d" index.html
# sed -i "" -e "/<meta content=\"Webflow\"/d" index.html
# sed -i "" -e "/\/js\/webflow/d" index.html

prettier -w *.html
