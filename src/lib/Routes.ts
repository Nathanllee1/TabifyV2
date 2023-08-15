import App from "../App/App.svelte";
import Explore from "../App/Explore/Explore.svelte";
import Profile from "../App/Profile/Profile.svelte";
import TabContainer from "../App/TabContainer.svelte";
import Root from "../Root.svelte";

export const routes = [
    {
        name: "/",
    },
    {
        name: "profile",
        component: Profile
    },
    {
        name: "explore",
        component: Explore
    },
    {
        name: "jam",
        component: TabContainer
    }
]

