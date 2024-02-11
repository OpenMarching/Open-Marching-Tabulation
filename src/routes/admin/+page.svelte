<script>
    import {pb, currentUser} from '$lib/pocketbase'
    import {makeRandString} from '$lib/utils/Random'
    import {onDestroy, onMount} from "svelte";
    import {trigger} from '$lib/utils/ToastStore'

    let users = []

    onMount(async () => {
        users = await pb.collection('users').getFullList({
            sort: 'admin'
        });
        pb.collection('users').subscribe('*', function (e) {
            if (e.action === 'create') {
                e.record.checked = false
                users = [e.record, ...users]
            }
            if (e.action === 'delete') {
                users = users.filter(user => user.id !== e.record.id)
            }
        }, { /* other options like expand, custom headers, etc. */});
        users.forEach(user => {
            user.checked = false
        })
    })

    onDestroy(() => {
        pb.collection('users').unsubscribe()
    })

    async function deleteUsers() {
        let selectedUsers = users.filter(user => user.checked)
        selectedUsers.forEach(async (user) => {
            const result = await pb.collection('users').delete(user.id)
            if (result === true) trigger('Deleted User', 'success')
        })
    }

    let newUserData = {
        "username": "",
        "email": "",
        "emailVisibility": true,
        "password": "",
        "passwordConfirm": "",
        "name": "",
        "admin": false,
        "user": "",
        "user_password": ""
    }
    $: newUserData.username = newUserData.name.toLowerCase().replace(/ /g, '_')

    async function createNewUser() {
        if (newUserData.name.length < 1) {
            trigger('Name Required', 'error')
            return
        }
        newUserData.password = makeRandString(12)
        newUserData.passwordConfirm = newUserData.password
        newUserData.user_password = newUserData.password
        const result = await pb.collection('users').create(newUserData)
        trigger('Created User', 'success')
        document.getElementById('new_user_modal').close()
    }
</script>


<div class="flex flex-col w-full h-full gap-4 py-4">
    <div class="flex flex-row w-full items-center justify-between">
        <h1 class="text-2xl px-4">Admin Panel</h1>
        <p class="px-4 lg:hidden">Better Managed On Desktop</p>
    </div>
    <div class="flex flex-col card bg-base-300 p-2 rounded-none px-4 gap-2">
        <h2 class="text-xl">Edit Users</h2>
        {#if users}
            <table class="table table-zebra">
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>username</th>
                    <th>password</th>
                    <th>Admin</th>
                </tr>
                </thead>
                <tbody>
                {#each users as user}
                    <tr>
                        <td>
                            {#if user.id === $currentUser.id}
                                <p class="tooltip" data-tip="Cannot Delete Myself">me</p>
                            {:else}
                                <input type="checkbox" class="checkbox" bind:checked={user.checked}>
                            {/if}
                        </td>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.user_password}</td>
                        <td>{user.admin}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
            <div class="flex flex-row justify-between">
                <button class="btn" disabled={users.filter(user => user.checked).length < 1}
                        on:click={deleteUsers}>{users.filter(user => user.checked).length <= 1 ? "Delete" : "Delete All Selected"}</button>
                <button class="btn btn-success" onclick="new_user_modal.showModal()">Create New
                    User
                </button>
            </div>
        {/if}
    </div>
</div>

<dialog id="new_user_modal" class="modal">
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
            </button>
        </form>
        <h3 class="font-bold text-lg py-4">Create New User</h3>
        <form on:submit|preventDefault={createNewUser} class="flex flex-col w-full gap-2" method="dialog">
            <input type="text" placeholder="Name" class="input input-bordered w-full"
                   bind:value={newUserData.name}/>
            <p class="w-full tooltip text-left" data-tip="Name User Will Login With.">
                Username: {newUserData.username}</p>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Admin</span>
                    <input type="checkbox" bind:checked={newUserData.admin} class="checkbox"/>
                </label>
            </div>
            <button class="btn btn-success">Create New User</button>
        </form>
    </div>
</dialog>
