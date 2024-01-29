<script>
    import { switchDevice } from "../lib/AppStore";

    let switching = false;

    async function callSwitch() {
        switching = true;
        await switchDevice();
    }
</script>

<input type="checkbox" id="my-modal" class="modal-toggle" checked />
<div class="modal">
    <div class="modal-box">
        <article class="prose">
            <h2>Tabify disconnected</h2>
            <button
                on:click={async () => await callSwitch()}
                class="btn btn-primary"
                disabled={switching}
                >Reconnect
                {#if switching}
                    <div>
                        <span class="loading loading-spinner"></span>
                    </div>
                {/if}
            </button>
        </article>
    </div>
</div>
