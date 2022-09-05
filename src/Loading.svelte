<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div class="mt-[49vh] flex justify-center  " out:fade>
    <div>
        <div>Loading</div>
        <progress class="progress w-56" />
    </div>
</div>
