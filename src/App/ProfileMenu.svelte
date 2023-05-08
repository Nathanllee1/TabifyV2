<script lang="ts">
    import { UserStore } from "../lib/UserStore";
    import { get } from "svelte/store";
    import { AppPage } from "./AppPage";
    import { clickOutside } from "../lib/utils";

    let active = false;
</script>

{#if get(UserStore).profile}
    <div class="" use:clickOutside on:click_outside={() => (active = false)}>
        <div
            tabindex="0"
            class="btn btn-ghost btn-circle avatar ml-5 mt-2"
            on:click={() => (active = !active)}
        >
            <div class="w-12 rounded-full">
                <img
                    src={get(UserStore)?.profile.images[0].url}
                    alt="profile"
                />
            </div>
        </div>
        <!-- Dropdown content -->
        {#if active}
            <ul
                tabindex="0"
                class="mt-3 p-2 shadow-2xl menu menu-compact bg-base-100 rounded-box w-52 absolute top-16 right-2"
            >
                <li>
                    <div
                        on:click={() => {
                            AppPage.set("profile");
                            active = false;
                        }}
                    >
                        Profile
                    </div>
                    <a href="/" class="text-error">Logout</a>
                </li>
            </ul>
        {/if}
    </div>
{/if}
