<script>

    import { switchDevice } from "../lib/AppStore";

</script>
<input type="checkbox" id="my-modal" class="modal-toggle" checked />
<div class="modal">
    <div class="modal-box">
        <article class="prose">
            <h2>Tabify disconnected</h2>
            <button on:click={async () => await switchDevice()} class="btn btn-primary">Reconnect</button>
        </article>
    </div>
</div>
