<script lang="ts">
  import App from "./App/App.svelte";
  import { AppStore } from "./lib/AppStore";
  import Loading from "./Loading.svelte";
  import Splash from "./Splash.svelte";
</script>

<svelte:head>
  <script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>


{#await AppStore.init()}
  <Loading />
{:then value}
  {#if $AppStore.authenticated}
    <App />
  {:else}
    <Splash />
  {/if}
{/await}
