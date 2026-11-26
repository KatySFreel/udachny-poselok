export const roles = { admin: 'Администратор', editor: 'Редактор', manager: 'Менеджер участков', viewer: 'Наблюдатель' } as const;
export type AdminRole = keyof typeof roles;
export type AdminIdentity = { id: string; name: string; email: string; role: AdminRole };
export type AccessUser = AdminIdentity & { status: 'pending' | 'approved' | 'rejected' | 'revoked'; requestedAt: string; approvedBy?: string };
export const canEditContent = (role: AdminRole) => role === 'admin' || role === 'editor';
export const canEditPlans = (role: AdminRole) => role === 'admin' || role === 'manager';
