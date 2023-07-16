<script>

    import Icon from "@iconify/svelte";
    export let message;
    export let bottom = true;
</script>

<div class={`tooltip ${bottom ? "" : "tooltip-left"} self-center cursor-pointer`}  data-tip={message}>
    <Icon class="self-center" icon="material-symbols:help-outline"/>
</div>