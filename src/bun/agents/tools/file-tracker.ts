import { statSync } from "node:fs";

/**
 * Per-agent-instance file tracker.
 *
 * Tracks content hashes and modification times for files an agent has read or
 * written. Before an edit is applied, the tracker compares the stored mtime
 * against the current disk mtime to detect external modifications (e.g. by
 * another concurrent agent).
 *
 * Lifecycle: one instance per sub-agent run — created in runSubAgent(),
 * garbage-collected when the agent finishes. Never persisted.
 */

export interface TrackedFile {
	contentHash: string;
	mtimeMs: number;
}

export type FreshnessResult =
	| { status: "fresh" }
	| { status: "modified_externally" }
	| { status: "untracked" };

function hashContent(content: string): string {
	const hasher = new Bun.CryptoHasher("sha256");
	hasher.update(content);
	return hasher.digest("hex");
}

function getMtimeMs(filePath: string): number | null {
	try {
		return statSync(filePath).mtimeMs;
	} catch {
		return null;
	}
}

export class FileTracker {
	private files = new Map<string, TrackedFile>();
	private writtenFiles = new Set<string>();

	/**
	 * Record a file's content hash and current mtime.
	 * Called after read_file, write_file, and successful edits.
	 */
	track(absolutePath: string, content: string): void {
		const mtimeMs = getMtimeMs(absolutePath);
		if (mtimeMs === null) return; // file doesn't exist (shouldn't happen after read/write)
		this.files.set(absolutePath, {
			contentHash: hashContent(content),
			mtimeMs,
		});
	}

	/**
	 * Check whether a tracked file is still fresh on disk.
	 *
	 * - "fresh"               — mtime matches, safe to edit
	 * - "modified_externally" — mtime changed since last track(), another agent or
	 *                           process modified the file
	 * - "untracked"           — file was never read/written by this agent
	 */
	checkFreshness(absolutePath: string): FreshnessResult {
		const entry = this.files.get(absolutePath);
		if (!entry) return { status: "untracked" };

		const currentMtime = getMtimeMs(absolutePath);
		if (currentMtime === null) {
			// File was deleted — treat as modified
			return { status: "modified_externally" };
		}

		// Allow a small tolerance (1ms) for filesystem rounding
		if (Math.abs(currentMtime - entry.mtimeMs) > 1) {
			return { status: "modified_externally" };
		}

		return { status: "fresh" };
	}

	/**
	 * Record a file write/edit. Call after write_file, edit_file, etc.
	 * Also calls track() to update the content hash and mtime.
	 */
	trackWrite(absolutePath: string, content: string): void {
		this.writtenFiles.add(absolutePath);
		this.track(absolutePath, content);
	}

	/** Return all files that were written/edited during this agent run. */
	getModifiedFiles(): string[] {
		return Array.from(this.writtenFiles);
	}

	/** Remove tracking for a file. */
	remove(absolutePath: string): void {
		this.files.delete(absolutePath);
	}

	/** Clear all tracked files. */
	clear(): void {
		this.files.clear();
		this.writtenFiles.clear();
	}
}
