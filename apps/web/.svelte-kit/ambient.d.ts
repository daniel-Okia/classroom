
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const NVM_INC: string;
	export const npm_package_dependencies_drizzle_orm: string;
	export const CLAUDE_CODE_MESSAGING_TOKEN: string;
	export const COREPACK_ROOT: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const CLAUDE_EFFORT: string;
	export const npm_package_dependencies_pdfkit: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_devDependencies_typescript: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const npm_package_devDependencies_vite: string;
	export const TMPDIR: string;
	export const CLAUDE_CODE_CHILD_SESSION: string;
	export const CLAUDE_PID: string;
	export const npm_package_scripts_dev: string;
	export const MallocNanoZone: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const CLAUDE_AGENT_SDK_VERSION: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const npm_package_devDependencies__types_pdfkit: string;
	export const AI_AGENT: string;
	export const GIT_EDITOR: string;
	export const NVM_DIR: string;
	export const USER: string;
	export const npm_config_recursive: string;
	export const COMMAND_MODE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_svelte: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const npm_config_frozen_lockfile: string;
	export const PATH: string;
	export const MCP_CONNECTION_NONBLOCKING: string;
	export const npm_package_devDependencies__sveltejs_adapter_node: string;
	export const LaunchInstanceID: string;
	export const __CFBundleIdentifier: string;
	export const COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
	export const PWD: string;
	export const npm_command: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const CLAUDE_CODE_QUESTION_PREVIEW_FORMAT: string;
	export const npm_package_scripts_preview: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const XPC_FLAGS: string;
	export const npm_package_devDependencies_vitest: string;
	export const CLAUDE_CODE_SESSION_ATTENDED: string;
	export const npm_package_dependencies__classroom_db: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const CLAUDE_CODE_ENABLE_TASKS: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const HOME: string;
	export const SHLVL: string;
	export const CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
	export const npm_package_type: string;
	export const npm_package_scripts_test: string;
	export const VSCODE_NLS_CONFIG: string;
	export const CLAUDE_CODE_EXECPATH: string;
	export const LOGNAME: string;
	export const CLAUDE_CODE_EMIT_STARTUP_TIMING: string;
	export const npm_package_dependencies__classroom_content: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const VSCODE_IPC_HOOK: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const NVM_BIN: string;
	export const VSCODE_PID: string;
	export const npm_config_user_agent: string;
	export const CLAUDE_CODE_SESSION_ID: string;
	export const npm_package_dependencies__classroom_core: string;
	export const OSLogRateLimit: string;
	export const npm_package_devDependencies__types_qrcode: string;
	export const npm_package_dependencies_postgres: string;
	export const SECURITYSESSIONID: string;
	export const VSCODE_CWD: string;
	export const VSCODE_L10N_BUNDLE_LOCATION: string;
	export const CLAUDE_CODE_MESSAGING_SOCKET: string;
	export const CLAUDECODE: string;
	export const npm_package_scripts_check: string;
	export const npm_package_dependencies_qrcode: string;
	export const npm_node_execpath: string;
	export const TEST: string;
	export const VITEST: string;
	export const NODE_ENV: string;
	export const PROD: string;
	export const DEV: string;
	export const BASE_URL: string;
	export const MODE: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		NVM_INC: string;
		npm_package_dependencies_drizzle_orm: string;
		CLAUDE_CODE_MESSAGING_TOKEN: string;
		COREPACK_ROOT: string;
		NoDefaultCurrentDirectoryInExePath: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		CLAUDE_EFFORT: string;
		npm_package_dependencies_pdfkit: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		npm_package_devDependencies_typescript: string;
		INIT_CWD: string;
		SHELL: string;
		npm_package_devDependencies_vite: string;
		TMPDIR: string;
		CLAUDE_CODE_CHILD_SESSION: string;
		CLAUDE_PID: string;
		npm_package_scripts_dev: string;
		MallocNanoZone: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		CLAUDE_AGENT_SDK_VERSION: string;
		npm_package_private: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		npm_package_devDependencies__types_pdfkit: string;
		AI_AGENT: string;
		GIT_EDITOR: string;
		NVM_DIR: string;
		USER: string;
		npm_config_recursive: string;
		COMMAND_MODE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		npm_package_devDependencies_svelte: string;
		ELECTRON_RUN_AS_NODE: string;
		npm_config_frozen_lockfile: string;
		PATH: string;
		MCP_CONNECTION_NONBLOCKING: string;
		npm_package_devDependencies__sveltejs_adapter_node: string;
		LaunchInstanceID: string;
		__CFBundleIdentifier: string;
		COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
		PWD: string;
		npm_command: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		CLAUDE_CODE_QUESTION_PREVIEW_FORMAT: string;
		npm_package_scripts_preview: string;
		VSCODE_ESM_ENTRYPOINT: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_name: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		XPC_FLAGS: string;
		npm_package_devDependencies_vitest: string;
		CLAUDE_CODE_SESSION_ATTENDED: string;
		npm_package_dependencies__classroom_db: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		CLAUDE_CODE_ENABLE_TASKS: string;
		npm_package_version: string;
		npm_package_devDependencies_svelte_check: string;
		HOME: string;
		SHLVL: string;
		CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
		npm_package_type: string;
		npm_package_scripts_test: string;
		VSCODE_NLS_CONFIG: string;
		CLAUDE_CODE_EXECPATH: string;
		LOGNAME: string;
		CLAUDE_CODE_EMIT_STARTUP_TIMING: string;
		npm_package_dependencies__classroom_content: string;
		npm_lifecycle_script: string;
		VSCODE_CODE_CACHE_PATH: string;
		VSCODE_IPC_HOOK: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		NVM_BIN: string;
		VSCODE_PID: string;
		npm_config_user_agent: string;
		CLAUDE_CODE_SESSION_ID: string;
		npm_package_dependencies__classroom_core: string;
		OSLogRateLimit: string;
		npm_package_devDependencies__types_qrcode: string;
		npm_package_dependencies_postgres: string;
		SECURITYSESSIONID: string;
		VSCODE_CWD: string;
		VSCODE_L10N_BUNDLE_LOCATION: string;
		CLAUDE_CODE_MESSAGING_SOCKET: string;
		CLAUDECODE: string;
		npm_package_scripts_check: string;
		npm_package_dependencies_qrcode: string;
		npm_node_execpath: string;
		TEST: string;
		VITEST: string;
		NODE_ENV: string;
		PROD: string;
		DEV: string;
		BASE_URL: string;
		MODE: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
