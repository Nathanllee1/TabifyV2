<script>
    import Icon from "@iconify/svelte";
    import { AppPage } from "./AppPage";

</script>
<div class="flex min-h-screen justify-center p-8">
    <div class="w-5/6 max-w-screen-sm align-middle flex-1">
        <div class="flex mb-9 justify-between">
            <div class="text-5xl">Profile</div>
            <div class="btn btn-circle btn-ghost cursor-pointer self-center" on:click={() => {AppPage.set("main")}}>
                <Icon icon="ant-design:close-outlined" style="font-size:25px;"/>

            </div>
        </div>

        <div class="mb-14">
            <div class="text-3xl">Stats</div>
            <div class="divider" />
    
            <div class="stats shadow">
                <div class="stat">
                    <div class="stat-title">Total Tabs Played</div>
                    <div class="stat-value text-primary">89,400</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Time Spent Jamming</div>
                    <div class="stat-value text-secondary">1hr 3min</div>
                </div>
            </div>
        </div>
        


        <div class="text-3xl">Preferences</div>
        <div class="divider" />
        <div>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Dark Mode</span>
                    <input type="checkbox" class="toggle" checked />
                </label>
            </div>
            <div class="flex align-middle justify-between p-[0.25rem]">
                <span class="label-text self-center">Difficulty Preference</span
                >
                <select class="select select-bordered  w-full max-w-xs">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>
            </div>
        </div>
    </div>
</div>
