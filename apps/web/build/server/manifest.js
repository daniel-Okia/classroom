const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["icon-192.png","icon-512.png","manifest.webmanifest","service-worker.js"]),
	mimeTypes: {".png":"image/png",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.fRcbXhjO.js","app":"_app/immutable/entry/app.CT0uHnAy.js","imports":["_app/immutable/entry/start.fRcbXhjO.js","_app/immutable/chunks/entry.BQ4mZNaJ.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/index.CADa0VP9.js","_app/immutable/entry/app.CT0uHnAy.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/index-client.Dp9BzwS1.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/store.BoIo8Emr.js","_app/immutable/chunks/index.CADa0VP9.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-BonSmr4Z.js')),
			__memo(() => import('./chunks/1-BcrRd4oq.js')),
			__memo(() => import('./chunks/2-YrPWHGgs.js')),
			__memo(() => import('./chunks/3-abvh2qfg.js')),
			__memo(() => import('./chunks/4-C8YUEJi5.js')),
			__memo(() => import('./chunks/5-BW7pFvhR.js')),
			__memo(() => import('./chunks/6-3EJ9cKbw.js')),
			__memo(() => import('./chunks/7-CzcWqR4I.js')),
			__memo(() => import('./chunks/8-DQl3xII_.js')),
			__memo(() => import('./chunks/9-Cuf5NjXC.js')),
			__memo(() => import('./chunks/10-BMNqObns.js')),
			__memo(() => import('./chunks/11-ZUj-1Nbc.js')),
			__memo(() => import('./chunks/12-lAIzCi7r.js')),
			__memo(() => import('./chunks/13-D32N1fyd.js')),
			__memo(() => import('./chunks/14-DZF3LW3d.js')),
			__memo(() => import('./chunks/15-D7JAydKu.js')),
			__memo(() => import('./chunks/16-CzMdO2IV.js')),
			__memo(() => import('./chunks/17-CmVuqWvm.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/sync",
				pattern: /^\/api\/sync\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-x5JUaiat.js'))
			},
			{
				id: "/join",
				pattern: /^\/join\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/learn",
				pattern: /^\/learn\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/learn/[topic]",
				pattern: /^\/learn\/([^/]+?)\/?$/,
				params: [{"name":"topic","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-jpXeoJg3.js'))
			},
			{
				id: "/messages",
				pattern: /^\/messages\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/platform",
				pattern: /^\/platform\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/practice",
				pattern: /^\/practice\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/progress",
				pattern: /^\/progress\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/schools/register",
				pattern: /^\/schools\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/school",
				pattern: /^\/school\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/school/event/[id].ics",
				pattern: /^\/school\/event\/([^/]+?)\.ics\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BA3Cma37.js'))
			},
			{
				id: "/school/notices",
				pattern: /^\/school\/notices\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/school/poster.pdf",
				pattern: /^\/school\/poster\.pdf\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-ZsH-3l54.js'))
			},
			{
				id: "/school/requests",
				pattern: /^\/school\/requests\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/school/setup",
				pattern: /^\/school\/setup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/slot/[id]",
				pattern: /^\/slot\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/teacher/[classId]",
				pattern: /^\/teacher\/([^/]+?)\/?$/,
				params: [{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
