import type { Actor } from '@classroom/core';
declare global { namespace App { interface Locals { user: { id: string; name: string } | null; actor: Actor | null } } }
export {};
