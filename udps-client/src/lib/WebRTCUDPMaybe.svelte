<script lang="ts">
	import { onMount } from 'svelte';

	let channel;

	onMount(async () => {
		const { geckos } = await import('@geckos.io/client');

		// or add a minified version to your index.html file
		// https://github.com/geckosio/geckos.io/tree/master/bundles

		channel = geckos({ port: null, url: 'https://udps-restless-sunset-50.fly.dev' }); // default port is 9208

		channel.onConnect((error) => {
			if (error) {
				console.error(error.message);
				return;
			}

			channel.on('chat message', (data) => {
				console.log(`You got the message ${data}`);
				messages = [...messages, [`You got the message ${data}`, Date.now() - time]];
			});

			channel.emit('chat message', 'a short message sent to the server');
		});
	});

	let text = '';
	let messages = [];
	let time = 0;

	const testRoundTrip = ({ text }) => {
		time = Date.now();
		channel.emit('chat message', text);
	};
</script>

<h1>Hello!</h1>

<form on:submit|preventDefault={() => testRoundTrip({ text })}>
	<input type="search" bind:value={text} />

	<button type="submit">Test</button>
</form>

{#each messages as [message, time]}
	<p>{time} --- {message}</p>
{/each}
