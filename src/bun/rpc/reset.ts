/**
 * Reset Application — wipes all data and quits the app.
 *
 * Rather than deleting the DB file (which is unreliable on Windows while the
 * Bun process still holds the file handle), we clear all data in-process:
 *   1. Disable FK constraints so tables can be dropped in any order.
 *   2. Drop every user table discovered in sqlite_master.
 *   3. Reset user_version to 0 so migrations run from scratch on next launch.
 *   4. Quit — migrations + seed will recreate and repopulate everything.
 */
import { Utils } from "electrobun/bun";
import { sqlite } from "../db/connection";

export function resetApplication(): { success: boolean } {
	// Temporarily disable FK constraints so tables can be dropped in any order
	sqlite.exec("PRAGMA foreign_keys = OFF");

	// Collect all user-created table names
	const tables = sqlite
		.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
		.all() as Array<{ name: string }>;

	// Drop every table
	for (const { name } of tables) {
		sqlite.exec(`DROP TABLE IF EXISTS "${name}"`);
	}

	// Reset migration version so migration_v1 runs fresh on next launch
	sqlite.exec("PRAGMA user_version = 0");

	// Schedule app quit shortly after returning the response
	setTimeout(() => {
		Utils.quit();
	}, 500);

	return { success: true };
}
