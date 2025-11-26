import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";

import Header from "../components/Header";

import styleCss from "../styles.css?url";

export const Route = createRootRouteWithContext()({
	head: () => ({
		links: [{ rel: "stylesheet", href: styleCss }],
	}),
	shellComponent: RootComponent,
	errorComponent: (props) => {
		return (
			<div class="p-4">
				<h2 class="text-xl font-bold text-red-600">Something went wrong!</h2>
				<p class="text-gray-600">{props.error.message}</p>
			</div>
		);
	},
});

function RootComponent() {
	return (
		<>
			<HeadContent />

			<Header />

			<Outlet />
			<TanStackRouterDevtools />

			<Scripts />
		</>
	);
}
