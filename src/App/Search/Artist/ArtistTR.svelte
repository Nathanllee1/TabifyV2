<script lang="ts">
    import { push } from "svelte-spa-router";

    import { getTimestamp, playSong } from "../../../lib/utils";
    import { onMount } from "svelte";
    import { checkOnTabify } from "../../../lib/TabStore";

    import Loader from "../InTabifyIcon.svelte";
    import { CurrentTrack } from "../../../lib/SpotifyStateStore";

    export let track: SpotifyApi.TrackObjectFull;

    let inTabify;

    onMount(async () => {
        inTabify = await checkOnTabify(
            track.name,
            track.artists[0].name,
            track,
        );
    });
</script>

<tr
    class={`hover cursor-pointer rounded-xl ${
        inTabify ? "" : "grayscale opacity-40 "
    }
    ${$CurrentTrack && $CurrentTrack.uri === track.uri
        ? "text-primary"
        : ""
    }`}
    on:click={async () => {
        await playSong(track.uri);
        push("/jam");
    }}
>
    <td class="md:block hidden ">
        <img  src={track.album.images[1].url} alt={track.name} width="70px" />
    </td>
    <td class="text-lg">{track.name}</td>
    <Loader {inTabify} />
    <td>{getTimestamp(track.duration_ms)}</td>
</tr>
