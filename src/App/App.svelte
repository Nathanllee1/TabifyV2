<script lang="ts">
    // various stores
    import { AppStore } from "../lib/AppStore";
    import { AppPage } from "./AppPage";
    import Controls from "./Controls.svelte";
    import NavBar from "./NavBar.svelte";
    import Profile from "./Profile.svelte";
    import TabContainer from "./TabContainer.svelte";

    import Tutorial from "./Tutorial.svelte";

    $: appStore = $AppStore;
    $: appPage = $AppPage;
</script>

<div class="flex flex-col min-h-screen max-h-screen ">
    {#if !appStore.canSwitch}
        <Tutorial />
    {/if}

    <NavBar />

    {#if appPage === "main"}
        <TabContainer />
    {:else}
        <Profile />
    {/if}
    <Controls />
</div>
