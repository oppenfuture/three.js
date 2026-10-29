# Three releases

Use the existing **Release** workflow (`workflow_dispatch`), selecting the release branch in GitHub's branch picker. For the current beta this is PR #156's `web-ar/usdz-exporter-r137-20261022` branch. Dispatch on a branch, not a tag. All jobs check out the dispatched SHA; the artifact action pushes only the four build files back to the selected branch without switching the source revision. A concurrent branch update can make that ordinary, non-forced push fail.

The version in `package.json` selects the npm dist-tag; there is no separate channel input:

| Package version | npm tag | Versioned CDN filename, in both existing buckets |
| --- | --- | --- |
| `0.137.18-beta.1` (or another `X.Y.Z-beta.N`) | `beta` | `three-0.137.18-beta.1.js` |
| `0.137.18` (or another stable `X.Y.Z`) | `latest` | `three-0.137.18.js` |

Release validates the version, builds, and commits only the four generated `build/three*` distribution files back to the selected branch. The two dependent jobs build the original dispatched revision, retain the existing versioned uploads to `oppentech-static` and `oppentech-test`, and publish to the existing internal npm registry with the derived tag. Artifact commit failure prevents those jobs. They remain separate jobs, so the overall release is not atomic: inspect all jobs before consuming the result. Named package versions must be new; rerunning an already published version may fail rather than replace it.

Keep beta iteration and artifact commits on the same feature PR. After the beta is verified and the feature is ready, update that PR to the intended stable version and merge the feature once into `r137-dev`; select `r137-dev` for its stable Release. This preparation does not itself dispatch, merge or publish anything. Update renderer dependencies and editor CDN URLs only after the intended package/artifacts actually exist and their identity has been checked.

Automatic **CD** remains development distribution on ordinary pushes to `r137-dev` (and manual dispatch). It uploads the unminified build to the existing test route `/holodeck/js/cd/three-<commit-SHA>.js`. Its npm job strips any prerelease/build suffix from the package version and uses a temporary version such as `0.137.18-dev.sha<commit-SHA>` with the explicit `dev` tag. It does not commit that version or update `beta`/`latest`. Each publish job checks out once, so preprocessing cannot discard the development version edit. Neither workflow limits the package version to the 0.137 line; this change does not upgrade the current r137 engine.

## Checkout and event behavior

The artifact job uses checkout's default repository `GITHUB_TOKEN` and requests only `contents: write`; the other Release jobs request `contents: read`. Checkout persists its token for the existing artifact push. No custom checkout PAT or new credential is required. Hosted permissions/push behavior still need confirmation; no local check proves that the repository will accept the push.

Run [40809507365](https://github.com/oppenfuture/three.js/actions/runs/40809507365) failed fetching at checkout with the pre-existing custom `_GITHUB_PUSH_PAT` input, before installation/build or CDN/npm jobs. The masked log does not establish token expiry, scope, or whether the checkout action version contributed. This repair changes the authentication route; it does not diagnose the secret or claim a successful retry.

According to [GitHub's token event rules](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow), an artifact push authenticated with `GITHUB_TOKEN` does not start push workflows. On the beta feature branch, CD would already be excluded by its `r137-dev` filter. On a future `r137-dev` Release, the artifact push will not start an additional CD run; Release itself still uploads both versioned CDN files and publishes its named npm version. Ordinary user pushes/merges still trigger CD. If development distribution for the artifact commit is wanted, select that branch for the existing manual CD workflow separately; this repair does not dispatch it.

An open PR's `synchronize` event can create approval-required workflow runs under GitHub's rules. Existing CI ignores build-only paths, but PR filters use the cumulative three-dot diff, so a feature PR with source changes can still qualify. No automatic approval or extra workflow chaining is added; inspect any GitHub approval banner. Retry remains the user's action.

The root workflow install uses the committed pnpm lock with Node 20.19.5 and pnpm 10.22.0. The separate deployment utility has no pnpm lock and retains its existing installation route with `--no-frozen-lockfile`. Neither workflow changes the engine revision or generates a second USDZ exporter.
