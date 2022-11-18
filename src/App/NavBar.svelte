<script lang="ts">
    import { UserStore } from "../lib/UserStore";
    import { get } from "svelte/store";
    import { AppPage } from "./AppPage";
    import HelpCard from "./HelpCard.svelte";
</script>

<div class="navbar bg-base-200">
    <div class="text-xl flex-1 ml-3 font-bold">Tabify</div>
    <label for="help-modal" class="btn btn-outline btn-info">Help</label>
    {#if get(UserStore).profile}
        <div class="dropdown dropdown-end ">
            <div tabindex="0" class="btn btn-ghost btn-circle avatar ml-5">
                <div class="w-12 rounded-full">
                    <img
                        src={get(UserStore)?.profile.images[0].url}
                        alt="profile"
                    />
                </div>
            </div>
            <ul
                tabindex="0"
                class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
            >
                <li>
                    
                    <div on:click={() => AppPage.set("profile")}>Profile</div>
                    
                    <a href="/" class="text-error">Logout</a>
                </li>
            </ul>
        </div>
    {/if}
</div>

<!--Popup modal-->
<input type="checkbox" id="help-modal" class="modal-toggle" />
<label for="help-modal" class="modal cursor-pointer">
    <label class="modal-box relative bg-base-200" for="">
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
