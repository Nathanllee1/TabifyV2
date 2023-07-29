<script lang="ts">
    import { onMount } from "svelte";
    let message;
    onMount(() => {
        message = new URLSearchParams(window.location.search).get("message");
    });
</script>

<div class="flex flex-col min-h-screen bg-base-200">
    <div class="navbar bg-base-100">
        <div class="btn btn-ghost normal-case text-xl">Tabify</div>
    </div>
    <div class="hero align-middle flex-1">
        <div class="flex justify-items-center w-5/6 max-w-screen-lg">
            <div>
                <div class="lg:text-6xl text-5xl font-light leading-tight">
                    Connect <span class="underline">Spotify</span> and
                    <span class="underline"> Ultimate Guitar</span>
                    for a
                    <span class="font-extrabold">fan-tab-ulous</span>
                    jamming experience
                </div>
                <h2 class="text-3xl mt-4">
                    Tabify shows you the chords for the song you're listening to
                    on Spotify!
                </h2>

                <br />
                <a class="btn text-white bg-[#1db954]" href="/api/login">
                    Login with Spotify
                </a>

                <div class="text-slate-500 mt-2">
                    * Only works for Premium users, sorry :(
                </div>
            </div>
            <img
                class="hidden lg:block"
                src="/splash.svg"
                alt="Guy playing guitar"
            />
            <div />
        </div>
    </div>
    <a
        class="text-2xl mb-4 text-gray-500 text-center animate-bounce"
        href="#details">More details ↓</a
    >
</div>
<div
    class="flex flex-col min-h-screen justify-between bg-base-200"
    id="details"
>
    <div class="hero mt-10 p-9">
        <div>
            <h1 class="text-5xl">How does Tabify work?</h1>
            <div class="divider" />
            <h2 class="text-3xl">
                Tabify connects to your Spotify and pulls up the music for the
                current song playing!
            </h2>
            <br />
            <h2 class="text-xl">Never google tabs again!</h2>
            <br />
            <video class="lg:max-w-4xl" autoplay loop>
                <source src="/demoVideo.webm" />
                <track kind="captions" /></video
            >
            <br /><br />
            <h1 class="text-xl">Get started today!</h1>
            <br />
            <a class="btn mb-10 text-white bg-[#1db954]" href="/api/login">
                Login with Spotify
            </a>
        </div>
    </div>

    <footer class="footer p-10 bg-neutral text-neutral-content self-end">
        <div>Made with ❤️ by Nathan, Emma, Nic, Blake, and Bella</div>
    </footer>
</div>
{#if message}
    <div class="toast">
        <div class="alert alert-info">
            <span>{message}</span>
        </div>
    </div>
{/if}
