import { buildURLWithParams, getHeaders, spotifyRequest } from "../../lib/utils";

class Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void = () => { };
    reject: (reason?: any) => void = () => { };

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

class Timer {
    timeout: NodeJS.Timeout
    endTime: number
    constructor(fn, delay, ...params) {
        this.timeout = setTimeout(fn, delay, ...params);
        this.endTime = new Date().getTime() + delay;
    }

    getId() {
        return this.timeout;
    }

    getRemainingTime() {
        const remainingTime = this.endTime - new Date().getTime();
        return remainingTime > 0 ? remainingTime : 0;
    }
}

async function getRecommendations(id: string): Promise<{ recommendations: SpotifyApi.RecommendationsFromSeedsResponse, timeout: number }> {
    const headers = getHeaders();

    const res = await fetch(buildURLWithParams(
        "https://api.spotify.com/v1/recommendations",
        {
            seed_tracks: id,
            limit: "10",

        },
    ), { headers }
    )

    if (res.status === 429) {
        for (let [key, value] of res.headers.entries()) {
            console.log(`${key}: ${value}`);
        } 
        
        const retrySecs = 20 // parseInt(res.headers.get("Retry-After"))
        console.log("Rate limited, need to wait", retrySecs, "seconds")

        return { recommendations: undefined, timeout: retrySecs }
    }

    const recommendations: SpotifyApi.RecommendationsFromSeedsResponse = await res.json()


    return { recommendations, timeout: undefined }
}

let curTimeout: Timer

async function sleep(ms: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

export async function requestRecommendations(id: string) {

    if (curTimeout && curTimeout.getRemainingTime() > 0) {
        await sleep(curTimeout.getRemainingTime())
    }

    const { recommendations, timeout } = await getRecommendations(id)

    if (recommendations) {
        return recommendations
    }

    const deferred = new Deferred<SpotifyApi.RecommendationsFromSeedsResponse>()

    curTimeout = new Timer(async () => {

        const req2 = await getRecommendations(id)

        if (req2.timeout) {
            deferred.reject("Could not resolve recommendations")
        }

        deferred.resolve(req2.recommendations)
    }, timeout * 1000)

    return deferred.promise

}