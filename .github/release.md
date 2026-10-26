# Three r137 releases

Use the existing **Release** workflow (`workflow_dispatch`), selecting the release branch in GitHub's branch picker. For the current beta this is PR #156's `web-ar/usdz-exporter-r137-20261022` branch. Dispatch on a branch, not a tag. The workflow fails if that branch moved after dispatch or the package name/version does not match this r137 release line.

The version in `package.json` selects the npm dist-tag; there is no separate channel input:

| Package version | npm tag | Versioned CDN filename, in both existing buckets |
| --- | --- | --- |
| `0.137.18-beta.1` (or another `0.137.N-beta.N`) | `beta` | `three-0.137.18-beta.1.js` |
| `0.137.18` (or another stable `0.137.N`) | `latest` | `three-0.137.18.js` |

Release validates the version, builds, and commits only the four generated `build/three*` distribution files back to the selected branch. The two dependent jobs build the original dispatched revision, retain the existing versioned uploads to `oppentech-static` and `oppentech-test`, and publish to the existing internal npm registry with the derived tag. Artifact commit failure prevents those jobs. They remain separate jobs, so the overall release is not atomic: inspect all jobs before consuming the result. Named package versions must be new; rerunning an already published version may fail rather than replace it.

Keep beta iteration and artifact commits on the same feature PR. After the beta is verified and the feature is ready, update that PR to the intended stable version and merge the feature once into `r137-dev`; select `r137-dev` for its stable Release. This preparation does not itself dispatch, merge or publish anything. Update renderer dependencies and editor CDN URLs only after the intended package/artifacts actually exist and their identity has been checked.

Automatic **CD** remains development distribution on pushes to `r137-dev` (and manual dispatch). It uploads the unminified build to the existing test route `/holodeck/js/cd/three-<commit-SHA>.js`. Its npm job uses a temporary version such as `0.137.18-dev.sha<commit-SHA>` and the explicit `dev` tag, deriving the base from either a stable or beta package version. It does not commit that temporary version or update `beta`/`latest`. Each publish job checks out once, so preprocessing cannot discard the development version edit. A Release artifact commit on `r137-dev` may trigger CD; that run still stays in the SHA-specific development channel.

The root workflow install uses the committed pnpm lock with Node 20.19.5 and pnpm 10.22.0. The separate deployment utility has no pnpm lock and retains its existing installation route with `--no-frozen-lockfile`. Neither workflow changes the engine revision or generates a second USDZ exporter.
