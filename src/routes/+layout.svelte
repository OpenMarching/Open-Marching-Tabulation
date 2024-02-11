<script>
    import "../app.css";
    import {currentUser, pb} from "$lib/pocketbase";
    import Authentication from "$lib/components/Authentication.svelte";
    import {invalidateAll} from "$app/navigation";
    import ToastLog from "$lib/components/ToastLog.svelte";
    import {onMount} from 'svelte'

    let AppOptions = {}
    let time

    onMount(async () => {
        const res = await fetch('AppOptions.json')
        AppOptions = await res.json()
    });

    $: if ($currentUser) {
        invalidateAll();
    }

    setInterval(() => {
        time = new Date(Date.now()).toLocaleTimeString()
    }, 100)
</script>


{#if $currentUser}
    <div class="drawer lg:drawer-open max-lg:drawer-end h-full">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle"/>
        <div class="drawer-content flex flex-col items-center justify-center w-full">
            <div class="lg:hidden w-full flex flex-row justify-between bg-neutral">
                <p class="font-bold text-xl m-auto">{time}</p>
                <label for="my-drawer-2" class="btn btn-primary drawer-button">Open Menu</label>
            </div>
            <slot/>
        </div>
        <div class="drawer-side overflow-auto">
            <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu w-64 min-h-full text-base-content bg-base-200">
                <p class="p-4 font-black text-center text-lg">{AppOptions.organization_name}</p>
                {#if $currentUser.admin}
                    <li class="font-bold"><a href="/admin">Admin Options</a></li>
                {/if}
                <li class="font-bold">
                    <button on:click={() => pb.authStore.clear()}>LogOut</button>
                </li>
                <p class="font-bold w-full text-lg">Events</p>
                <hr>
            </ul>
        </div>
    </div>
{:else}
    <div class="flex flex-col w-full h-full items-center justify-between p-4">
        <div class="flex flex-col items-center">
            <p>{AppOptions.event_name || "Loading..."}</p>
            <p>{AppOptions.organization_name || "Loading..."}</p>
        </div>
        <Authentication/>
        <div class="flex flex-col items-center">
            <p>Powered By Open Marching.</p>
            <a href="https://openmarching.org" class="underline">OpenMarching.org</a>
        </div>
    </div>
{/if}

<ToastLog/>