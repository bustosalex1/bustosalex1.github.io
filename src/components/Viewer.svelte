<script lang="ts">
    import { T, Canvas } from "@threlte/core";

    import { Bounds, Edges, Gizmo, OrbitControls } from "@threlte/extras";
</script>

<div class="w-full border border-line hard-shadow bg-secondary-bg">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[10, 5, 10]} lookAt.y={0.5}>
            <OrbitControls
                autoRotate={true}
                enableDamping={true}
                enableZoom={true}
                zoomToCursor={false}
                rotateSpeed={1.0}
                zoomSpeed={1.0}
            >
                <Gizmo />
            </OrbitControls>
        </T.PerspectiveCamera>

        <T.DirectionalLight position.y={10} position.z={10} position.x={10} />
        <T.AmbientLight intensity={0.3} />

        <Bounds margin={5.0}>
            <T.GridHelper args={[10, 10]} />

            <T.Mesh position.y={1}>
                <T.BoxGeometry args={[2, 2, 2]} />
                <T.MeshStandardMaterial color={0xff3e00} />
                <Edges thresholdAngle={20.0} color="white" scale={1.01} />
            </T.Mesh>
        </Bounds>
    </Canvas>
</div>
