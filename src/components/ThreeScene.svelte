<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import {
        Bounds,
        Gizmo,
        OrbitControls,
        Sky,
        useGltf,
    } from "@threlte/extras";
    import {
        ACESFilmicToneMapping,
        Box3,
        EdgesGeometry,
        LineBasicMaterial,
        LineSegments,
        MeshStandardMaterial,
        Vector3,
        type Group,
        type Mesh,
    } from "three";

    interface Props {
        model: string;
    }

    let { model }: Props = $props();

    // Tone mapping converts the HDR (high dynamic range) render output into
    // the LDR (low dynamic range) range that screens can display. Without it,
    // bright areas would clip to solid white. `toneMappingExposure` controls
    // overall scene brightness.
    const { renderer } = useThrelte();
    $effect.pre(() => {
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
    });

    const gltf = $derived(useGltf(model));
    const gridRadius = 5;

    // $effect.pre fires before DOM updates, ensuring setupModel mutates the
    // scene *before* <T is={$gltf.scene} /> renders for the first time. This
    // prevents a 1-frame flash of incorrectly scaled model.
    $effect.pre(() => {
        if ($gltf !== undefined) {
            setupModel($gltf);
        }
    });

    /**
     * Scales and centers the model to fit the grid + a margin, applies a gray
     * MeshStandardMaterial to the model (which responds to the Sky environment
     * lighting), and adds dark edge outlines.
     */
    function setupModel(gltf: { scene: Group }) {
        const box = new Box3().setFromObject(gltf.scene);
        const size = new Vector3();
        box.getSize(size);

        // Scale the model so its largest horizontal dimension fits within the
        // grid minus the margin, then center on X/Z and flush to Y=0.
        const margin = 2;
        const usableSize = gridRadius * 2 - margin;

        const maxHorizontal = Math.max(size.x, size.z);
        if (maxHorizontal > 0) {
            const targetScale = usableSize / maxHorizontal;
            gltf.scene.scale.setScalar(targetScale);

            const center = new Vector3();
            box.getCenter(center);

            gltf.scene.position.set(
                -center.x * targetScale,
                -box.min.y * targetScale,
                -center.z * targetScale,
            );
        }

        // gray material + dark edge lines on every mesh.
        gltf.scene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;

                mesh.material = new MeshStandardMaterial({
                    color: 0x888888,
                    roughness: 0.5,
                    metalness: 0.1,
                });

                // Lines along geometry edges where the face angle exceeds 20
                // degrees
                const edges = new EdgesGeometry(mesh.geometry, 20);
                const line = new LineSegments(
                    edges,
                    new LineBasicMaterial({ color: 0x333333 }),
                );
                mesh.add(line);
            }
        });
    }
</script>

<T.OrthographicCamera makeDefault position={[10, 5, 10]}>
    <OrbitControls
        autoRotate={true}
        autoRotateSpeed={0.75}
        enableDamping={true}
        enableZoom={true}
        zoomToCursor={false}
        rotateSpeed={1.0}
        zoomSpeed={1.0}
    >
        <Gizmo />
    </OrbitControls>
</T.OrthographicCamera>

<!-- Procedural sky dome for image-based lighting. The Sky is rendered to a
cubemap on mount and set as scene.environment; MeshStandardMaterials then use
it for diffuse + specular IBL. The sky itself is hidden. -->
<T.Group visible={false}>
    <Sky
        elevation={10}
        azimuth={200}
        turbidity={10}
        rayleigh={3}
        cubeMapSize={256}
    />
</T.Group>

<!-- don't render overall scene until GLTF has been processed -->
{#if $gltf}
    <Bounds margin={1.0} animate={false}>
        <T.PolarGridHelper args={[gridRadius, 16, 8]} />
        <T is={$gltf?.scene} />
    </Bounds>
{/if}
