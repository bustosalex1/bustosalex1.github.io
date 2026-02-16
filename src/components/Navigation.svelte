<script lang="ts">
    import Menu from "~icons/material-symbols/menu-rounded";
    import Close from "~icons/material-symbols/close-rounded";
    import ThemeToggle from "@components/ThemeToggle.svelte";

    import { fade, slide } from "svelte/transition";
    import { MediaQuery } from "svelte/reactivity";

    const md = new MediaQuery("min-width: 768px");
    interface Props {
        url: string;
    }

    let { url }: Props = $props();
    const links = [
        ["Posts", "/"],
        ["Quotes I Like", "/experiments/quotes"],
        ["Book Reviews", "/books"],
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
<div class="flex flex-row w-full h-11 border-line border items-stretch">
    <a
        href="/"
        class="font-bold whitespace-nowrap text-ink transition-all duration-150 content-center hover:text-primary px-4 border-line border-r font-mono text-sm hover:bg-primary/10"
    >
        Alex Bustos
    </a>
    {#each links as [title, link] (link)}
        <a
            href={link}
            class={[
                {
                    "underline text-primary":
                        (url.includes(link) && link !== "/") ||
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
        class={[
            "md:hidden content-center w-11 hover:text-primary group transition-all duration-150 hover:bg-primary/10 cursor-pointer border-line border-l",
            { "z-50 border-none": show },
        ]}
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
</div>

{#if show}
    <div
        class="fixed left-0 top-0 h-full bg-bg border-r border-line z-50 flex flex-col items-stretch min-w-60"
        transition:slide={{ axis: "x", duration: 150 }}
    >
        <div class="p-2 border-b border-line">
            <a
                href="/"
                class="font-bold whitespace-nowrap transition-all duration-150 content-center hover:text-primary font-mono"
            >
                Alex Bustos
            </a>
        </div>
        {#each links as [title, link] (link)}
            <a
                href={link}
                class={[
                    {
                        "underline text-primary":
                            (url.includes(link) && link !== "/") ||
                            (url.includes("posts") && link === "/") ||
                            (url === "/" && link === "/") ||
                            (url === "" && link === "/"),
                    },
                    "hover:text-primary transition-all duration-300 pr-4 pl-6 border-line content-center whitespace-nowrap border-b py-2 font-mono text-sm",
                ]}
            >
                {title}
            </a>
        {/each}
    </div>
    <button
        class="inset-0 z-40 fixed backdrop-blur-lg"
        aria-label="menu-backdrop"
        transition:fade={{ duration: 150 }}
        onclick={() => {
            show = false;
        }}
    ></button>
{/if}
