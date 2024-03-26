<script lang="ts">
    import Icon from "@iconify/svelte";

    export let inTabify: boolean;
</script>

{#if inTabify !== undefined}
    {#if inTabify}
        <td>
            <div class="tooltip" data-tip="In Tabify">
                <Icon icon="icon-park:check-one" style="font-size:25px" />
            </div>
        </td>
    {:else}
        <td
            ><div class="tooltip" data-tip="Not In Tabify">
                <Icon icon="dashicons:no" style="font-size:25px" />
            </div></td
        >
    {/if}
{:else}
    <td>
        <span class="loading loading-spinner loading-sm"></span>
    </td>
{/if}
