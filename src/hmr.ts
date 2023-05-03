// Customized HMR-safe stores
// Based off https://github.com/svitejs/svite/blob/ddec6b9/packages/playground/hmr/src/stores/hmr-stores.js
import type { Writable } from 'svelte/store';
import { AppStore } from './lib/AppStore';
import { CurrentTrack, SpotifyState } from './lib/SpotifyStateStore';
import { profile } from './lib/Profile';

let stores: Record<string, Writable<any>> = {};

export function registerStore<T>(id: string, store: Writable<T>) {
  stores[id] = store;
}

registerStore('appstore', AppStore);
registerStore("spotifystate", SpotifyState);
registerStore("currentrack", CurrentTrack)
registerStore("profile", profile)


// preserve the store across HMR updates
if (import.meta.hot) {
  if (import.meta.hot.data.stores) {
    
    stores = import.meta.hot.data.stores
    console.log(stores )
  }
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    import.meta.hot.data.stores = stores
  })
} 