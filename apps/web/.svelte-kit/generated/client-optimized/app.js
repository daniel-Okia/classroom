export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/join": [~3],
		"/learn": [~4],
		"/learn/[topic]": [~5],
		"/login": [6],
		"/messages": [~7],
		"/platform": [~8],
		"/practice": [~9],
		"/progress": [~10],
		"/schools/register": [~15],
		"/school": [~11],
		"/school/notices": [12],
		"/school/requests": [~13],
		"/school/setup": [~14],
		"/slot/[id]": [~16],
		"/teacher/[classId]": [~17]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';