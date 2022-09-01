<script lang="ts">
  import { onMount } from "svelte";
  import { init } from "svelte/internal";

  import App from "./App.svelte";
  import { AppStore } from "./lib/stores";
  import Splash from "./Splash.svelte";
</script>

<svelte:head>
  <script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>

{#await AppStore.init() then value}
  {#if $AppStore.authenticated}
    <App />
  {:else}
    <Splash />
  {/if}
{/await}

<style lang="postcss">
</style>
