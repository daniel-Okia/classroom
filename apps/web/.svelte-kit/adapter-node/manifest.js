export const manifest = (() => {
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
		client: {"start":"_app/immutable/entry/start.3UD_kzQV.js","app":"_app/immutable/entry/app.vnM19xOy.js","imports":["_app/immutable/entry/start.3UD_kzQV.js","_app/immutable/chunks/entry.DD7OQoMf.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/index.CADa0VP9.js","_app/immutable/entry/app.vnM19xOy.js","_app/immutable/chunks/effects.Bw-LE6lJ.js","_app/immutable/chunks/disclose-version.CR518hP7.js","_app/immutable/chunks/index-client.Dp9BzwS1.js","_app/immutable/chunks/if.B7_HkxNR.js","_app/immutable/chunks/store.BoIo8Emr.js","_app/immutable/chunks/index.CADa0VP9.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/api/sync/_server.ts.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/logout/_server.ts.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/school/event/_id_.ics/_server.ts.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/school/poster.pdf/_server.ts.js'))
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

export const prerendered = new Set([]);

export const base = "";