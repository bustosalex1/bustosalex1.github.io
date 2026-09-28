<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Reset from "~icons/carbon/reset";
    import ThreeScene from "./ThreeScene.svelte";

    interface Props {
        model: string;
        caption?: string;
    }

    let { model, caption }: Props = $props();

    // Populated via the `onResetReady` callback from `ThreeScene` once the
    // model loads and the camera is framed. Stays undefined until then, which
    // keeps the reset button disabled.
    let resetView: (() => void) | undefined = $state();
</script>

<figure class="w-full my-0 border border-line hard-shadow overflow-hidden">
    <div class="aspect-video relative bg-secondary-bg">
        <Canvas>
            <ThreeScene {model} onResetReady={(fn) => (resetView = fn)} />
        </Canvas>
    </div>
    <figcaption class="caption-with-control">
        <button
            type="button"
            aria-label="Reset view"
            title="Reset view"
            disabled={!resetView}
            onclick={resetView}
            class="order-first flex w-9 min-h-9 shrink-0 cursor-pointer select-none items-center justify-center border-r border-line text-ink-secondary transition-all duration-150 disabled:cursor-default disabled:opacity-50 enabled:hover:bg-primary/10 enabled:hover:text-primary"
        >
            <Reset class="w-4 h-4" />
        </button>
        {#if caption}
            <span class="caption-text">{caption}</span>
        {/if}
    </figcaption>
</figure>
