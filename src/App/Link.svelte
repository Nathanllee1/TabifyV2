<script lang="ts">
    import { Tab } from "../lib/TabStore";
    // @ts-ignore
    import {location} from 'svelte-spa-router'

    export let linkName;
    export let href;

    console.log($location)

</script>

<a
    class={`hover:link self-center ${
        $location === `/${href}` ? "font-bold badge badge-secondary" : ""
    }`}
    href={"/#/" + href}>{linkName}</a
>
