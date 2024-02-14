<script lang="ts">
    import { UserStore } from "../lib/UserStore";
    import { get } from "svelte/store";
    import { clickOutside } from "../lib/utils";
    import { push } from "svelte-spa-router";

    let active = false;
</script>

{#if get(UserStore).profile}
    <div
        class="z-50"
        use:clickOutside
        on:click_outside={() => (active = false)}
    >
        <button
            tabindex="0"
            class="btn btn-ghost btn-circle avatar ml-5 mt-2"
            on:click={() => (active = !active)}
        >
            {#if get(UserStore)?.profile.images[0]}
                <div class="w-12 rounded-full">
                    <img
                        src={get(UserStore)?.profile.images[0].url}
                        alt="profile"
                    />
                </div>
            {:else}
                <div class="w-12 rounded-full" />
            {/if}
        </button>

        <!-- Dropdown content -->
        {#if active}
            <ul
                tabindex="0"
                class="mt-3 p-2 shadow-2xl menu menu-compact bg-base-100 rounded-box w-52 absolute top-16 right-2"
            >
                <li>
                    <div
                        on:click={() => {
                            push("/profile");
                            active = false;
                        }}
                    >
                        Profile
                    </div>
                    <button on:click={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("tokenExpiresIn")
                        window.location.assign("/")
                    }} class="text-error">Logout</button>
                </li>
            </ul>
        {/if}
    </div>
{/if}
