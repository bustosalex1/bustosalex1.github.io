<script lang="ts">
    import type { Snippet } from "svelte";
    import type { ClassValue } from "svelte/elements";

    interface Props {
        children: Snippet;
        class: ClassValue;
        topLeft?: boolean;
        topRight?: boolean;
        bottomLeft?: boolean;
        bottomRight?: boolean;
        relative?: boolean;
        hideDots?: boolean;
    }

    const {
        children,
        bottomLeft = true,
        bottomRight = true,
        topLeft = true,
        topRight = true,
        relative = true,
        hideDots = false,
        ...props
    }: Props = $props();
</script>

<div class={[{ relative: relative }, props.class]}>
    {@render children()}

    {#if !hideDots}
        {#if topLeft}
            <div
                class="w-[7px] h-[7px] absolute border border-neutral-300 bg-background -top-1 -left-1"
            ></div>
        {/if}
        {#if topRight}
            <div
                class="w-[7px] h-[7px] absolute border border-neutral-300 bg-background -top-1 -right-1"
            ></div>
        {/if}
        {#if bottomLeft}
            <div
                class="w-[7px] h-[7px] absolute border border-neutral-300 bg-background -bottom-1 -left-1"
            ></div>
        {/if}
        {#if bottomRight}
            <div
                class="w-[7px] h-[7px] absolute border border-neutral-300 bg-background -bottom-1 -right-1"
            ></div>
        {/if}
    {/if}
</div>
