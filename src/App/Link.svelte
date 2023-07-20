<script lang="ts">
    import { AppPage } from "../lib/AppPage";

    export let linkName;
    export let href;
</script>

<button class={`hover:link ${$AppPage === href ? "link" : ""}`} on:click={() => AppPage.set(href)}>{linkName}</button>

