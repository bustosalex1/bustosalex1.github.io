<script lang="ts">
    import Moon from "~icons/line-md/sunny-outline-to-moon-alt-loop-transition";
    import Sun from "~icons/line-md/moon-alt-to-sunny-outline-loop-transition";
    import { onMount } from "svelte";

    let isDark = $state(false);

    function toggleTheme() {
        const next = isDark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        isDark = !isDark;
    }

    onMount(() => {
        isDark = localStorage.getItem("theme") === "dark";
    });
</script>

<button
    onclick={toggleTheme}
    class="w-11 content-center text-center border-l border-line hover:cursor-pointer text-ink-secondary hover:text-primary transition-all duration-150 hover:bg-primary/10"
>
    {#if isDark}
        <Moon class="mx-auto h-5 w-5" />
    {:else}
        <Sun class="mx-auto h-5 w-5" />
    {/if}
</button>
