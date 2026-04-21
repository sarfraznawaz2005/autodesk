# Domain: shared

**Directory:** `src/shared`
**Files:** 22
**Symbols:** 53

## Files

### `src/shared/rpc.ts`

**Exports:**
- `AutoDeskRPC` (line 4)


### `src/shared/rpc/agents.ts`

**Types:**
- `AgentsRequests` (line 1)


### `src/shared/rpc/analytics.ts`

**Types:**
- `AnalyticsRequests` (line 1)


### `src/shared/rpc/conversations.ts`

**Types:**
- `ConversationRow` (line 1)
- `ConversationsRequests` (line 11)


### `src/shared/rpc/council.ts`

**Types:**
- `CouncilRequests` (line 1)


### `src/shared/rpc/dashboard.ts`

**Types:**
- `DashboardRequests` (line 1)


### `src/shared/rpc/deploy.ts`

**Types:**
- `DeployRequests` (line 1)


### `src/shared/rpc/git.ts`

**Types:**
- `GitRequests` (line 1)


### `src/shared/rpc/inbox.ts`

**Types:**
- `InboxRequests` (line 1)


### `src/shared/rpc/index.ts`

**Types:**
- `BunRequests` (line 24)
- `AutoDeskRPC` (line 45)

**Exports:**
- `SettingsRequests` (line 54)
- `ProvidersRequests` (line 54)
- `ProjectsRequests` (line 54)
- `ConversationsRequests` (line 54)
- `AgentsRequests` (line 54)
- `KanbanRequests` (line 54)
- `NotesRequests` (line 54)
- `DeployRequests` (line 54)
- `GitRequests` (line 54)
- `IntegrationsRequests` (line 54)
- `InboxRequests` (line 54)
- `AnalyticsRequests` (line 54)
- `SystemRequests` (line 54)
- `BunMessages` (line 54)
- `PluginsRequests` (line 54)
- `LspRequests` (line 54)
- `DashboardRequests` (line 54)
- `SkillsRequests` (line 54)
- `CouncilRequests` (line 54)
- `UpdaterRequests` (line 54)
- `WebviewSchema` (line 54)


### `src/shared/rpc/integrations.ts`

**Types:**
- `ChannelRow` (line 1)
- `IntegrationsRequests` (line 11)


### `src/shared/rpc/kanban.ts`

**Types:**
- `KanbanTaskRow` (line 1)
- `KanbanRequests` (line 18)


### `src/shared/rpc/lsp.ts`

**Interfaces:**
- `LspServerStatus` (line 1)

**Types:**
- `LspRequests` (line 9)


### `src/shared/rpc/notes.ts`

**Types:**
- `NoteRow` (line 1)
- `PromptRow` (line 11)
- `NotesRequests` (line 21)


### `src/shared/rpc/plugins.ts`

**Types:**
- `PluginsRequests` (line 1)


### `src/shared/rpc/projects.ts`

**Types:**
- `ProjectRow` (line 1)
- `ProjectsRequests` (line 13)


### `src/shared/rpc/providers.ts`

**Types:**
- `ProvidersRequests` (line 1)


### `src/shared/rpc/settings.ts`

**Types:**
- `SettingsRequests` (line 1)


### `src/shared/rpc/skills.ts`

**Types:**
- `SkillValidationError` (line 1)
- `SkillsRequests` (line 6)


### `src/shared/rpc/system.ts`

**Types:**
- `SystemRequests` (line 1)
- `BunMessages` (line 241)


### `src/shared/rpc/updater.ts`

**Types:**
- `UpdaterRequests` (line 1)


### `src/shared/rpc/webview.ts`

**Types:**
- `WebviewSchema` (line 3)


## Change Recipe

To add a new feature to the **shared** domain:

1. Update the model/schema in `src/shared/`
