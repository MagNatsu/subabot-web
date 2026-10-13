---
name: local-jekyll-preview
description: Start or open a local Jekyll preview. Use when asked to run or preview this site.
---

# Local Jekyll preview

Run from the repository root.

1. Reuse an existing Jekyll server for this repository. Restart it only when asked.
2. Otherwise, choose a free random port between `30000` and `65000` and start Jekyll in a persistent terminal session, bound to `127.0.0.1`:

   ```sh
   bundle exec jekyll serve --livereload --host 127.0.0.1 --port PORT
   ```

3. Confirm the build succeeds and the URL responds with `curl -fsS`. Leave the server running. Open the site in Chrome when asked.

If Bundler rejects `:windows` in the `Gemfile`, create a temporary `Gemfile` outside the repository containing `gem "jekyll-theme-chirpy", "~> 7.6"`. Install its dependencies and run Jekyll with `BUNDLE_GEMFILE` pointing to that file. Leave the repository's dependencies unchanged.
