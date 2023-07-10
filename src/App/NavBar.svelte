<script lang="ts">
    import HelpCard from "./HelpCard.svelte";
    import ProfileMenu from "./ProfileMenu.svelte";
    import SearchBar from "./SearchBar.svelte";
</script>

<div class="navbar bg-base-200 justify-between">
    <div class="text-xl ml-3 font-bold">Tabify</div>

    <SearchBar />
    <div>
        <label for="help-modal" class="btn btn-outline btn-info">Help</label>
        <ProfileMenu />
    </div>
</div>

<!--Popup modal-->
<input type="checkbox" id="help-modal" class="modal-toggle" checked/>
<label for="help-modal" class="modal cursor-pointer">
    <label class="modal-box relative bg-base-200" for="">
        <label
            for="help-modal"
            class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
        >
        <br />
        <div class="flex gap-8 flex-col">
            <HelpCard
                q="How do you use Tabify?"
                a="Control Tabify by opening Spotify on your phone or computer and
                hitting play on your favorite playlists!"
            />

            <HelpCard
                q="How does this work?"
                a="Tabify grabs the tab of the current playing song on Spotify
            from Ultimate Guitar, a website that has user published
            guitar tabs"
            />

            <HelpCard
                q="Why doesn't this song have a tab?"
                a="Ultimate Guitar is a site with user published tabs, so it might not
                have a tab for a song. However, you can write one and it will show up in Tabify!"
            />
        </div>
    </label>
</label>

<style>
    /* override daisyui */
    .navbar {
        @apply min-h-fit
    }
</style>