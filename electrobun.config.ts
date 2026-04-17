import type { ElectrobunConfig } from "electrobun";

export default {
	app: {
		name: "AutoDesk",
		identifier: "com.sarfrazai.autodesk",
		version: "0.0.13",
	},
	runtime: {
		// Keep Bun alive when the last window closes so we can recreate it
		// from the tray.  Electrobun does not support cancelling window close
		// events, so this is the only way to implement minimize-to-taskbar.
		exitOnLastWindowClosed: false,
	},
	build: {
		// Vite builds to dist/, we copy from there
		copy: {
			"dist/index.html": "views/mainview/index.html",
			"dist/assets": "views/mainview/assets",
			"assets/icon.png": "views/assets/icon.png",
			"assets/tray-icon.png": "views/assets/tray-icon.png",
			"assets/icon.ico": "views/assets/icon.ico",
			"assets/icon.ico": "app.ico",
			"plugins": "plugins",
			"skills": "skills",
		},
		// Ignore Vite output in watch mode — HMR handles view rebuilds separately
		watchIgnore: ["dist/**"],
		mac: {
			bundleCEF: false,
		},
		linux: {
			bundleCEF: true,
		},
		win: {
			bundleCEF: false,
			icon: "assets/icon.ico",
		},
	},
	// Update distribution — point to your GitHub Releases page.
	// Format: "https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download"
	// The updater fetches {baseUrl}/{channel}-{os}-{arch}-update.json to check for updates.
	release: {
		baseUrl: "https://github.com/sarfraznawaz2005/autodesk/releases/latest/download",
	},
} satisfies ElectrobunConfig;
