<template>
    <div class="bg-black flex-1 ml-56 px-10 text-white pt-10 bg-white">
        <div class="container mx-auto w-full max-w-xs">
            <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" v-if="$store.getters.user == null">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Username
                    </label>
                    <input
                            v-model="email"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username" type="text" placeholder="Username">
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                            v-model="pwd"
                            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password" type="password" placeholder="******************">
                    <p class="text-red-500 text-xs italic">Please choose a password.</p>
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button" @click.prevent="login">
                        Sign In
                    </button>
                    <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                    </a>
                </div>
            </form>
            <div v-else>
                <span class="text-grey-darkest">Hello {{ $store.getters.fullName }}</span>
            </div>
        </div>

        <button @click.prevent="notifyMe">Hello world</button>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                email: 'alan.gasmer@phoenixtest.com',
                pwd: 'juqEy6',
                bundleID: 'com.symmetryk.Symmetryk1',
                vendorID: '7445892B2447-39CB-4106-B000-CBF7F832'
            }
        },
        methods: {
            notifyMe: function () {
                if (!("Notification" in window)) {
                    alert("This browser doesn't support system notifications")
                } else if (Notification.permission === "granted") {
                    this.notify()
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission(permission => {
                        if (permission === "granted") {
                            this.notify()
                        }
                    })
                }
            },
            notify: function () {
                var notification = new Notification("Title of Notification", {
                    icon: "https://www.fonline-reloaded.net/wiki/images/f/ff/Icon-Guide2.PNG",
                    body: "Notification coming"
                });

                notification.onclick = () => {
                    window.open('http://local.symmetryk.com');
                };

                setTimeout(notification.close.bind(notification), 3000);
            },
            login: function () {
                let vm = this;

                vm.$store.dispatch('login', {
                    email: this.email,
                    pwd: this.pwd,
                    vendorID: this.vendorID,
                    bundleID: this.bundleID
                }).then(function () {
                    vm.$router.push({name: 'create'})
                })
            }
        }
    }
</script>