# r137 USDZ material and texture backport

The maintained source is `USDZExporter.js`. Generate `examples/js/exporters/USDZExporter.js` with the repository Rollup/Babel/ESLint example pipeline. Keep async `parse(scene): Promise<Uint8Array>`; the optional second argument accepts upstream `quickLookCompatible` (default false). No engine upgrade or second exporter is involved.

## Pinned source

[Three r160, d04539a76736ff500cae883d6a38b3dd8643c548](https://github.com/mrdoob/three.js/blob/d04539a76736ff500cae883d6a38b3dd8643c548/examples/jsm/exporters/USDZExporter.js): material color as linear `UsdUVTexture.inputs:scale`, image conversion without canvas tint, PNG image output and flipY, cloned repeat/offset plus rotation/origin correction, repeat/clamp/mirror mapping, optional Quick Look transform workaround, and DoubleSide warning. These related pieces are ported together.

## r137 adaptations and retained repairs

- `texture.id + flipY` replaces `texture.source.id + flipY` because r137 predates Texture.source. Textures shared by differently colored materials reuse the image; each shader carries its own linear factor.
- `texture.encoding === sRGBEncoding` replaces modern colorSpace checks. Normal data stays explicitly raw.
- Keep the single r137 `st` UV set and existing string primvar reader / float2 connection types. No modern texture.channel or multi-UV feature is imported.
- Keep `/Root/Materials` and complete Root/Geometry default prims, full mesh geometry and MaterialBindingAPI. Do not adopt r160's scene hierarchy/camera/anchoring/compressed-texture features.
- Keep the earlier alpha/cutout/opacity repairs (upstream 5d81b2724cb6beb8d7663145c68a43b99e3bbbef and 5a86ea8560397bcd3ec357e73a3ba7b2d795f86b), using buildColor4's alpha argument for opacity. Standalone alphaMap precedence and constant cutout remain.
- Keep raw normal scale/bias and the source glTF normalScale.x convention (3220e981e9b3d2a77d615bbf2aa9da114f6cf551 and 281815cbebe8c3bd48cde7f2cca6d2fced26141e). Do not undo the r137 loader's tangent-less normal convention.
- Preserve async parse, warn/skip behavior, geometry, ZIP ordering, zero compression and 64-byte alignment.

## Local opaque-alpha correctness repair (2026-10-23)

The constant-opacity branch uses 1 when neither `transparent` nor a positive `alphaTest` enables alpha coverage. BLEND and MASK retain their source opacity; textured alpha connections, cutout thresholds and the diffuse texture opacity multiplier are unchanged. No source material is mutated. A MASK cutoff of zero accepts every fragment and is opaque, including a zero source alpha.

This is a local correctness patch, not an upstream backport: executing the pinned r160 helper reproduces opaque opacity 0.4. ROOT's later r180/dev inspection also found the direct `material.opacity` assignment. The semantics follow [glTF 2.0 alpha coverage](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#alpha-coverage) and r137's existing loader `transparent`/`alphaTest` mapping. The frontend material harness loads real OPAQUE/BLEND/MASK GLBs, runs preflight, exports and checks opacity, texture-alpha multiplication, thresholds and source immutability.

## Capability limits

Desktop checks establish emitted values and USD composition, not native Quick Look appearance. The upstream quickLookCompatible branch is retained verbatim; it is approximate per its upstream comments and is unverified on an actual device. The SDK uses the default false branch pending device evidence.

One r160 Transform2d SRT node does not reproduce r137's loaded UV matrix for a rotation with unequal X/Y repeats (except half-turns). A fixture with repeat (0.5, 0.8), offset (0.1, 0.3), rotation pi/6 and UV (0.2, 0.25) yields source (0.24910254, 0.39320508), exported (0.13660254, 0.42320508). Executing the pinned upstream buildMaterial produces identical shader values. The SDK narrowly excludes that combination; uniform-scale rotation, half-turns and unrotated nonuniform scale remain eligible. No custom transform algorithm is substituted.

Double-sided rendering is still unsupported and warned about, as upstream. The SDK does not promise native fidelity for double-sided surfaces. Existing limits for distinct secondary UVs, arbitrary UV matrices/centers outside source GLB transforms, animation/skinning, custom materials and unsupported material factors remain; this backport does not expand them.

Regression commands and actual candidate-package evidence are in the frontend `test/repro/web-ar` harness and `docs/plans/web-ar-backport-evidence-20261022.md`. Native, production package/distribution resolution and deployed integration remain open.
