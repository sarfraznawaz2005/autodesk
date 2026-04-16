import { Updater } from "electrobun/bun";
import { broadcastToWebview } from "../engine-manager";

function relayStatus() {
	Updater.onStatusChange((entry) => {
		const progress = entry.details?.progress;
		broadcastToWebview("updateStatus", {
			status: entry.status,
			message: entry.message,
			...(progress !== undefined && { progress }),
		});
	});
}

export async function checkForUpdate() {
	try {
		relayStatus();
		const result = await Updater.checkForUpdate();
		return { ...result, devMode: false };
	} catch {
		// version.json not present — running in dev mode
		return {
			version: "",
			hash: "",
			updateAvailable: false,
			updateReady: false,
			error: "",
			devMode: true,
		};
	}
}

export async function downloadUpdate() {
	try {
		relayStatus();
		await Updater.downloadUpdate();
		return { success: true };
	} catch (e) {
		return { success: false, error: (e as Error).message };
	}
}

export async function applyUpdate() {
	try {
		await Updater.applyUpdate();
		return { success: true };
	} catch (e) {
		return { success: false, error: (e as Error).message };
	}
}
