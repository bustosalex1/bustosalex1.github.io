<script lang="ts">
    import { Canvas } from "@threlte/core";
    import ThreeScene from "./ThreeScene.svelte";

    interface Props {
        model: string;
    }

    let { model }: Props = $props();
</script>

<div
    class="w-full border border-line hard-shadow bg-secondary-bg aspect-video relative"
>
    <Canvas>
        <ThreeScene {model} />
    </Canvas>
</div>
