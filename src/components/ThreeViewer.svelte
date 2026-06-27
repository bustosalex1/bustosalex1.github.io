<script lang="ts">
    import { Canvas } from "@threlte/core";
    import ThreeScene from "./ThreeScene.svelte";

    interface Props {
        model: string;
        caption?: string;
    }

    let { model, caption }: Props = $props();

    // Populated via the `onResetReady` callback from `ThreeScene` once the
    // model loads and the camera is framed. Stays undefined until then, which
    // keeps the button hidden via the `{#if}` below.
    let resetView: (() => void) | undefined = $state();
</script>

<figure class="w-full my-0 border border-line hard-shadow">
    <div
        class="aspect-video relative bg-secondary-bg cursor-grab active:cursor-grabbing"
    >
        <Canvas>
            <ThreeScene {model} onResetReady={(fn) => (resetView = fn)} />
        </Canvas>
        {#if resetView}
            <div class="bg-secondary-bg absolute bottom-3 right-3 z-10">
                <button
                    onclick={resetView}
                    class="font-mono text-xs px-3 py-1.5 border border-line bg-secondary-bg text-ink-secondary hover:text-primary hover:bg-primary/10 transition-all duration-150 cursor-pointer select-none"
                >
                    Reset View
                </button>
            </div>
        {/if}
    </div>
    {#if caption}
        <figcaption
            class="font-mono text-sm text-left m-0 p-2 text-ink border-t border-line bg-secondary-bg"
        >
            {caption}
        </figcaption>
    {/if}
</figure>
