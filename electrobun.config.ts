import type { ElectrobunConfig } from "electrobun";

export default {
	app: {
		name: "AutoDesk",
		identifier: "com.sarfrazai.autodesk",
		version: "0.0.28",
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
			"assets/uninstall.ps1": "uninstall.ps1",
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
			// Icon is embedded into the exe files via explicit rcedit calls in the
			// GitHub Actions release workflow (release.yml). Do NOT set `icon` here —
			// Electrobun 1.16.0's CLI binary has rcedit's path baked in from its own
			// CI environment (D:\a\electrobun\...) which doesn't exist locally, causing
			// a spurious ENOENT warning on every `bun run dev`.
		},
	},
	// Update distribution — point to your GitHub Releases page.
	// Format: "https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download"
	// The updater fetches {baseUrl}/{channel}-{os}-{arch}-update.json to check for updates.
	release: {
		baseUrl: "https://github.com/sarfraznawaz2005/autodesk/releases/latest/download",
	},
} satisfies ElectrobunConfig;
