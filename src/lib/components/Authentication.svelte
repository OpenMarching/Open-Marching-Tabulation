<script lang="ts">
    import {pb} from '$lib/pocketbase'

    let user: string
    let password: string


    const login = async () => pb.collection('users').authWithPassword(user, password)

</script>

<form class="card bg-base-300 shadow-xl p-4 flex flex-col gap-2 items-center" on:submit|preventDefault={login}>
    <h3 class="text-xl font-black">Login</h3>
    <input type="text" placeholder="User" class="input input-bordered w-full max-w-xs" bind:value={user}/>
    <input type="password" placeholder="Password" class="input input-bordered w-full max-w-xs" bind:value={password}/>
    <button class="btn btn-info w-full" formaction="submit">Login</button>
</form>
