<script lang="ts">
    import { AppPage } from "../lib/AppPage";

    export let linkName;
    export let href;
</script>

<button class={`hover:link self-center ${$AppPage === href ? "font-bold badge badge-secondary" : ""}`} on:click={() => AppPage.set(href)}>{linkName}</button>

