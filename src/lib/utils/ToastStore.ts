import {writable, get} from "svelte/store";

setInterval(() => {
    if (!get(toastStore)) return;
    get(toastStore).forEach((item, index) => {
        if (Date.now() - item.created > item.timeout) {
            toastStore.update((items) => {
                items.splice(index, 1);
            });
        }
    })
}, 5)

export const toastStore  = writable([]);


interface ToastComponent {
    message: string,
    type: string,
    timeout: number,
    created?: number
}

export function trigger(message: string = '', type: string = '', timeout = 5000) {
    toastStore.set([...get(toastStore) || [], {message, type, timeout, created: Date.now()}]);
}