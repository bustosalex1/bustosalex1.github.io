<script lang="ts">
    import Menu from "~icons/material-symbols/menu-rounded";
    import Close from "~icons/material-symbols/close-rounded";
    import ThemeToggle from "@components/ThemeToggle.svelte";

    import { fade, slide } from "svelte/transition";
    import { backIn, backOut } from "svelte/easing";
    import { MediaQuery } from "svelte/reactivity";

    const md = new MediaQuery("min-width: 768px");
    interface Props {
        url: string;
    }

    let { url }: Props = $props();
    const links = [
        { title: "Posts", link: "/" },
        { title: "Photos", link: "/photos" },
        {
            title: "Quotes I Like",
            link: "/experiments/quotes/source",
            base: "/experiments/quotes",
        },
    ];

    /**
     * A bit of state to keep track of whether or not a sidebar menu is shown,
     * instead of a row of links at the top of the page. This is done for
     * smaller screens.
     */
    let show = $state(false);

    // a little bit of reactivity to make it so that the page can't be scrolled
    // if the screen is small enough to have the links displayed as a sidebar
    $effect(() => {
        if (show) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    });

    $effect(() => {
        if (md.current) {
            show = false;
        }
    });
</script>

<!--@component
Component providing links to main pages on my website. New links and their
slugs can be added in the `links` variable. This component also displays the
title of the website (my name).
-->
<div
    class={[
        "flex flex-row w-full h-11 border-line border items-stretch bg-secondary-bg relative z-30",
        { "hard-shadow": !show },
    ]}
>
    <a
        href="/"
        class="font-bold whitespace-nowrap text-white transition-all duration-150 content-center px-4 border-line border-r font-mono text-sm bg-primary"
    >
        Alex Bustos
    </a>
    {#each links as { title, link, base } (link)}
        <a
            href={link}
            class={[
                {
                    "underline text-primary":
                        (url.includes(base ?? link) && link !== "/") ||
                        (url.includes("posts") && link === "/") ||
                        (url === "/" && link === "/") ||
                        (url === "" && link === "/"),
                },
                "hover:text-primary transition-all duration-150 px-4 border-line content-center whitespace-nowrap border-r hidden md:block font-mono text-sm text-ink relative hover:bg-primary/10",
            ]}
        >
            {title}
        </a>
    {/each}

    <!--diagonal line spacing between links and menu / theme toggle-->
    <div class="grow diagonal-lines"></div>

    <ThemeToggle />
    <button
        class="md:hidden content-center w-11 hover:text-primary group transition-all duration-150 hover:bg-primary/10 cursor-pointer border-line border-l"
        onclick={() => {
            show = !show;
        }}
    >
        {#if show}
            <Close
                class="h-5 w-5 mx-auto text-ink-secondary group-hover:text-primary transition-all duration-150"
            />
        {:else}
            <Menu
                class="h-5 w-5 mx-auto text-ink-secondary group-hover:text-primary transition-all duration-150"
            />
        {/if}
    </button>

    {#if show}
        <div
            class="absolute top-full -left-px -right-px bg-secondary-bg border border-line flex flex-col items-stretch"
            in:slide={{ axis: "y", duration: 250, easing: backOut }}
            out:slide={{ axis: "y", duration: 250, easing: backIn }}
        >
            {#each links as { title, link, base }, i (link)}
                <a
                    href={link}
                    class={[
                        {
                            "underline text-primary":
                                (url.includes(base ?? link) && link !== "/") ||
                                (url.includes("posts") && link === "/") ||
                                (url === "/" && link === "/") ||
                                (url === "" && link === "/"),
                        },
                        "hover:text-primary hover:bg-primary/10 transition-all duration-150 px-4 border-line content-center whitespace-nowrap h-11 font-mono text-sm",
                        { "border-b": i < links.length - 1 },
                    ]}
                >
                    {title}
                </a>
            {/each}
        </div>
    {/if}
</div>

{#if show}
    <button
        class="fixed inset-0 z-20 backdrop-blur-lg"
        aria-label="menu-backdrop"
        transition:fade={{ duration: 150 }}
        onclick={() => {
            show = false;
        }}
    ></button>
{/if}
