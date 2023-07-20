<script lang="ts">

    import Icon from "@iconify/svelte";
    export let message;
    export let location: "bottom" | "left" | "top" | "right" = "bottom";
</script>
<!--
<div class={`tooltip tooltip-${location} cursor-pointer`}  data-tip={message}>
    <Icon class="self-center" icon="material-symbols:help-outline" />
</div>
-->