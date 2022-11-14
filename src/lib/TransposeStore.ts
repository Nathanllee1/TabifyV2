import { writable } from "svelte/store";
import { Tab } from "./TabStore";
import { transpose } from 'chord-transposer';

export let transposeStore = createTranspose();

function transposeTab(steps:number) {
    const chords = document.getElementsByClassName("_3PpPJ OrSDI");

    for (const chord of chords) {
        chord.textContent = transpose(chord.textContent).up(steps)
    }
}

function createTranspose() {
    const { subscribe, set, update } = writable({
        semitones: 0
    })

    return {
        subscribe,
        set,
        increase: () => {
            update((transp) => {
                transp.semitones += 1
                transposeTab(1)
                return transp
            })
        },
        decrease: () => {
            update((transp) => {
                transp.semitones -= 1
                transposeTab(-1)
                return transp
            })
        }
    }
}

/**
 * Reset transposition on each tab
 */
Tab.subscribe((tab) => {
    transposeStore.set({
        semitones: 0
    })
})