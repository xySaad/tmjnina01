<script>
	import { resolve } from '$app/paths';
</script>

<nav class="links">
	<a class="card" href={resolve('/eventsTree')}>
		<span>🌳</span>
		<p>Event Tree</p>
	</a>

	<a class="card" href={resolve('/events')}>
		<span>📅</span>
		<p>Events</p>
	</a>
</nav>

<style>
	.links {
		display: flex;
		gap: 1.5rem;
		margin: auto;
	}

	.card {
		text-decoration: none;
		background: #1e293b;
		padding: 1.5rem 2rem;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: inherit;
		transition: 0.2s ease;
		min-width: 120px;
	}

	.card:hover {
		background: #334155;
		transform: translateY(-4px);
	}

	.card span {
		font-size: 1.8rem;
	}

	.card p {
		margin: 0;
		font-size: 0.95rem;
	}
</style>
