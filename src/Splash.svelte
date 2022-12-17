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
                <br />
                <a class="btn text-white" href="/api/login"> Login with Spotify </a>
            </div>
            <img class="hidden lg:block" src="/splash.svg" alt="Guy playing guitar" />
            <div />
        </div>

    </div>
    <div class="text-lg mb-4 text-gray-500 text-center">More details ↓</div>

</div>
<div class="flex flex-col min-h-screen justify-between bg-base-200 ">
    <div class="hero mt-10 p-9">
        <div>
            <h1 class="text-5xl">How does Tabify work?</h1>
            <div class="divider"></div>
            <h2 class="text-3xl">Tabify shows you the chords for the song you're listening to on Spotify!</h2>
            <br>
            <h2 class="text-xl">Never google tabs again!</h2>
            <br>
            <video class="lg:max-w-4xl" autoplay loop>
                <source src="/demoVideo.webm">
            <track kind="captions"></video>
            <br><br>
            <h1 class="text-xl">Get started today!</h1>
            <br>
            <a class="btn mb-10 text-white" href="/api/login"> Login with Spotify </a>
        </div>
        
    </div>

    <footer class="footer p-10 bg-neutral text-neutral-content self-end">
        <div>Made with ❤️ by Nathan, Emma, Nic, Blake, and Bella</div>
    </footer>
</div>

<style>
    a {
        background-color: #1db954;
    }
</style>
