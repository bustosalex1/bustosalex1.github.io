<script lang="ts">
    import { onMount } from "svelte";
    import { cubicInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    interface Props {
        locations: string[];
    }

    const { locations }: Props = $props();

    const numberOfLocations = locations.length;

    let currentIndex = $state(0);
    let location = $derived(locations[currentIndex]);

    onMount(() => {
        setInterval(() => {
            if (currentIndex + 1 < numberOfLocations) {
                currentIndex += 1;
            } else {
                currentIndex = 0;
            }
        }, 2000);
    });

    let maxLen = $derived(Math.max(...locations.map((l) => l.length)));
    $inspect(maxLen);
</script>

<div class="overflow-hidden h-4" style={`width: ${maxLen + 1}ch;`}>
    {#key location}
        <div
            in:fly|local={{
                y: 10,
                easing: cubicInOut,
                duration: 200,
                delay: 300,
            }}
            out:fly|local={{
                y: 10,
                easing: cubicInOut,
                duration: 200,
                delay: 0,
            }}
            class="text-white font-mono transition-all text-right"
        >
            {location}
        </div>
    {/key}
</div>
