import TabContainer from "../App/TabContainer.svelte";
import Explore from "../App/Explore/Explore.svelte";
import { writable } from "svelte/store";
import Profile from "../App/Profile/Profile.svelte";

export const routes = {
    "/": Explore,
    "/jam": TabContainer,
    "/profile": Profile
}