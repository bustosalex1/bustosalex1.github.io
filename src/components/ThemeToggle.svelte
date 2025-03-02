<script lang="ts">
    /**
     * Toggle that swaps between light and dark modes.
     */
    import Sun from "~icons/line-md/sunny-outline-loop";
    import Moon from "~icons/line-md/moon-alt-loop";

    function loadTheme() {
        const theme = localStorage.getItem("theme");
        if (theme === "light" || theme === "dark") {
            return theme;
        } else {
            return "light";
        }
    }

    let theme: "light" | "dark" = $state(loadTheme());
</script>

<button
    onclick={() => {
        const html = document.getElementById("html-root") as HTMLElement;
        if (theme === "light") {
            html.classList.add("dark");
            theme = "dark";
        } else {
            html.classList.remove("dark");
            theme = "light";
        }
        localStorage.setItem("theme", theme);
    }}
>
    {#if theme === "light"}
        <!-- moon icon (shows when light mode is enabled) -->
        <Moon class="w-5 h-5" />
    {:else}
        <!-- sun icon (shows when dark mode is enabled) -->
        <Sun class="w-5 h-5" />
    {/if}
</button>
