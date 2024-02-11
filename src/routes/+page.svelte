<script>
    import Loader from '$lib/components/Loader.svelte';
    import {currentUser} from "$lib/pocketbase";
</script>

<div class="flex flex-col w-full h-full items-center justify-center">
    <p>Hello {$currentUser.name}</p>
</div>
