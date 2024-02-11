<script lang="ts">
    import {toastStore} from '$lib/utils/ToastStore'
    import {flip} from 'svelte/animate'
    import {quintOut} from 'svelte/easing'
</script>


<div class="toast toast-bottom toast-end">
    {#if $toastStore}
        {#each $toastStore as item ($toastStore.indexOf(item))}
            <div class={`alert text-left`} class:alert-success={item.type === 'success'}
                 class:alert-info={item.type === 'info'} class:alert-error={item.type === 'error'}
                 class:focus:alert-warning={item.type === 'warning'}
                 animate:flip={{ delay: 250, duration: 250, easing: quintOut }}>
                {item.message}
            </div>
        {/each}
    {/if}
</div>