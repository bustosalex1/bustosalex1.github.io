<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import {
        Bounds,
        Gizmo,
        OrbitControls,
        Sky,
        useGltf,
    } from "@threlte/extras";
    import { MediaQuery } from "svelte/reactivity";
    import {
        ACESFilmicToneMapping,
        Box3,
        EdgesGeometry,
        LineBasicMaterial,
        LineSegments,
        MeshStandardMaterial,
        OrthographicCamera,
        Vector3,
        type Group,
        type Mesh,
    } from "three";
    import type { OrbitControls as OrbitControlsImpl } from "three/addons";

    const md = new MediaQuery("min-width: 768px");

    interface Props {
        model: string;
        /**
         * Called once the model is loaded and the camera has been framed,
         * passing this component's `resetView` function up to the parent so it
         * can wire it to a DOM button outside <Canvas>.
         */
        onResetReady: (fn: () => void) => void;
    }

    let { model, onResetReady }: Props = $props();

    const { renderer, camera, invalidate } = useThrelte();

    // Tone mapping converts the HDR (high dynamic range) render output into
    // the LDR (low dynamic range) range that screens can display. Without it,
    // bright areas would clip to solid white. `toneMappingExposure` controls
    // overall scene brightness.
    $effect.pre(() => {
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
    });

    const gltf = $derived(useGltf(model));
    const gridRadius = 5;

    // $effect.pre fires before DOM updates, ensuring setupModel mutates the
    // scene before things are rendered.
    $effect.pre(() => {
        if ($gltf !== undefined) {
            setupModel($gltf);
        }
    });

    let controls: OrbitControlsImpl | undefined = $state();

    // Snapshot of camera state taken after `Bounds` frames the model. Not
    // $state because nothing reactive reads it.
    let savedCameraState:
        | {
              position: Vector3;
              target: Vector3;
              zoom: number;
          }
        | undefined;

    /**
     * Called by `Bounds` via `onFit` after the camera has been framed on the
     * model. Snapshots the camera state and hands `resetView` up to the
     * parent.
     */
    function saveCameraState() {
        if (!controls) return;
        const cam = $camera;
        savedCameraState = {
            position: cam.position.clone(),
            target: controls.target.clone(),
            zoom: cam instanceof OrthographicCamera ? cam.zoom : 1,
        };
        onResetReady(resetView);
    }

    /** Restores the camera to the position saved by `saveCameraState`. */
    function resetView() {
        if (!savedCameraState || !controls) return;
        const cam = $camera;
        cam.position.copy(savedCameraState.position);
        controls.target.copy(savedCameraState.target);
        if (cam instanceof OrthographicCamera) {
            cam.zoom = savedCameraState.zoom;
            cam.updateProjectionMatrix();
        }

        controls.enabled = true;
        controls.update();
        invalidate();
    }

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
        bind:ref={controls}
        autoRotate={true}
        autoRotateSpeed={0.75}
        enableDamping={true}
        enableZoom={true}
        zoomToCursor={false}
        rotateSpeed={1.0}
        zoomSpeed={1.0}
    >
        {#if md.current}
            <Gizmo />
        {/if}
    </OrbitControls>
</T.OrthographicCamera>

<!-- Procedural sky dome for image-based lighting. The Sky is rendered to a
cubemap on mount and set as scene.environment; `MeshStandardMaterials` then use
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
    <Bounds margin={1.0} animate={false} onFit={saveCameraState}>
        <T.PolarGridHelper args={[gridRadius, 16, 8]} />
        <T is={$gltf?.scene} />
    </Bounds>
{/if}
