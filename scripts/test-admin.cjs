const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const jar = new Map();
const requestHeaders = new Map();
const originalLoad = Module._load;
Module._load = function(name, ...rest) {
  if (name === 'next/headers') return { cookies: async () => ({ get: key => jar.has(key) ? { value: jar.get(key) } : undefined, set: (key,value) => jar.set(key,value), delete: key => jar.delete(key) }), headers: async () => requestHeaders };
  if (name === 'next/cache') return { revalidatePath() {} };
  return originalLoad.call(this, name, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(require('node:fs').readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const auth = require('../lib/admin-auth.ts');
const actions = require('../app/admin/actions.ts');
const plans = require('../app/plan-actions.ts');
const { cmsPages } = require('../lib/cms-catalog.ts');
const { createCopy, validateCmsValues } = require('../lib/cms-contract.ts');
const { readCmsDocument, persistCmsDocument } = require('../lib/cms-store.ts');
test('CMS validation, drafts, publication, rollback data and concurrent writers', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-cms-'));
  process.env.ADMIN_DATA_DIR = dir;
  try {
    const page = cmsPages.find(p => p.id === 'home'), field = page.fields.find(f => f.kind === 'text');
    const values = { [field.key]: 'Проверка черновика <b>без HTML</b>' };
    assert.equal(validateCmsValues(page, values), true);
    assert.equal(validateCmsValues(page, { unknown: 'value' }), false);
    const image = page.fields.find(f => f.kind === 'image');
    for (const value of ['javascript:alert(1)', '//example.com/x.jpg', '/images/../../private', 'data:image/svg+xml,<svg/>']) assert.equal(validateCmsValues(page, { [image.key]: value }), false);
    const link = page.fields.find(f => f.kind === 'link');
    assert.equal(validateCmsValues(page, { [link.key]: 'javascript:alert(1)' }), false);
    assert.equal(validateCmsValues(page, { [link.key]: 'https://example.com/path' }), true);
    const initial = await readCmsDocument(page.id);
    assert.equal(initial.revision, 0);
    const draft = await persistCmsDocument(page.id, 0, values, false, 'Редактор');
    assert.equal(draft.ok, true);
    assert.deepEqual(draft.document.published, {});
    assert.deepEqual((await readCmsDocument(page.id)).draft, values);
    const published = await persistCmsDocument(page.id, 1, values, true, 'Администратор');
    assert.equal(published.ok, true);
    assert.deepEqual(published.document.published, values);
    assert.deepEqual(published.document.history[0].values, {});
    const competing = await Promise.all([persistCmsDocument(page.id, 2, {}, false, 'A'), persistCmsDocument(page.id, 2, {}, false, 'B')]);
    assert.equal(competing.filter(r => r.ok).length, 1);
    assert.equal(competing.find(r => !r.ok).conflict, true);
    assert.equal(createCopy(values).text(field.key, 'old'), values[field.key]);
    const input = { heading: { title: 'old' }, untouched: { value: 1 } };
    const resolved = createCopy({ 'example.heading.title': 'new' }).data('example', input);
    assert.equal(resolved.heading.title, 'new');
    assert.equal(input.heading.title, 'old');
    assert.strictEqual(resolved.untouched, input.untouched);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('Pending accounts, role gates, approval, session revocation, logout and login throttling', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-access-'));
  process.env.ADMIN_DATA_DIR = dir;
  process.env.ADMIN_OWNER_PASSWORD = 'test-owner-password-long';
  process.env.PLAN_ADMIN_PASSWORD = '';
  const email = 'editor@example.test', password = 'test-account-password-long';
  try {
    jar.clear();
    assert.equal(await auth.currentAdmin(), null);
    assert.equal((await actions.adminSavePage('home', 0, {}, true)).ok, false);
    assert.equal((await plans.savePlan('simo', 0, [])).ok, false);
    await assert.rejects(actions.adminReadPage('home'));
    await assert.rejects(actions.adminUsers());
    assert.equal((await auth.requestAdminAccess('Редактор', email, password)).ok, true);
    assert.equal((await auth.loginAdminAccount(email, password)).ok, false);
    assert.equal(await auth.currentAdmin(), null);
    assert.equal((await auth.loginAdminAccount('admin', process.env.ADMIN_OWNER_PASSWORD)).ok, true);
    const ownerToken = jar.get('site-admin-session');
    const fileBytes = await fs.readFile(path.join(__dirname, '../public/images/home-mobile.webp'));
    const upload = new FormData(); upload.set('file', new File([fileBytes], 'photo.webp', { type: 'image/webp' }));
    const uploaded = await actions.adminUploadImage(upload);
    assert.equal(uploaded.ok, true);
    const media = require('../app/admin-media/[name]/route.ts');
    const response = await media.GET(new Request('http://localhost' + uploaded.url), { params: Promise.resolve({ name: uploaded.url.split('/').at(-1) }) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Content-Type'), 'image/webp');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), fileBytes);
    assert.equal((await media.GET(new Request('http://localhost'), { params: Promise.resolve({ name: '../access.json' }) })).status, 404);
    const invalidUpload = new FormData(); invalidUpload.set('file', new File(['<svg onload="alert(1)"></svg>'], 'image.svg', { type: 'image/svg+xml' }));
    assert.equal((await actions.adminUploadImage(invalidUpload)).ok, false);
    const field = cmsPages.find(p => p.id === 'home').fields.find(f => f.kind === 'text');
    await actions.adminSavePage('home', 0, { [field.key]: 'Published value' }, true);
    await actions.adminSavePage('home', 1, {}, false);
    const { getCmsCopy } = require('../lib/cms-store.ts');
    assert.equal((await getCmsCopy()).text(field.key, 'default'), 'Published value');
    requestHeaders.set('x-admin-preview', 'home');
    assert.equal((await getCmsCopy()).text(field.key, 'default'), 'default');
    requestHeaders.clear();
    // Resume the role-gate checks with an empty revision-zero document.
    await fs.rm(path.join(dir, 'content-home.json'));
    const users = await actions.adminUsers();
    assert.equal(users.length, 1);
    assert.equal(JSON.stringify(users).includes('passwordHash'), false);
    assert.equal(users[0].status, 'pending');
    assert.equal((await actions.adminChangeAccess(users[0].id, 'editor', 'approved')).ok, true);
    jar.clear();
    assert.equal((await auth.loginAdminAccount(email, password)).ok, true);
    const editorToken = jar.get('site-admin-session');
    assert.equal((await auth.currentAdmin()).role, 'editor');
    assert.equal((await actions.adminSavePage('home', 0, {}, false)).ok, true);
    assert.equal((await actions.adminSavePage('home', 1, {}, true)).ok, false);
    assert.equal((await plans.savePlan('simo', 0, [])).ok, false);
    assert.equal((await actions.adminChangeAccess(users[0].id, 'admin', 'approved')).ok, false);
    jar.set('site-admin-session', ownerToken);
    assert.equal((await actions.adminChangeAccess(users[0].id, 'manager', 'approved')).ok, true);
    jar.set('site-admin-session', editorToken);
    assert.equal(await auth.currentAdmin(), null);
    assert.equal((await auth.loginAdminAccount(email, password)).ok, true);
    const managerToken = jar.get('site-admin-session');
    assert.equal((await auth.currentAdmin()).role, 'manager');
    assert.equal((await actions.adminUploadImage(upload)).ok, false);
    await assert.rejects(actions.adminReadPage('home'));
    assert.equal((await actions.adminSavePage('home', 1, {}, false)).ok, false);
    jar.set('site-admin-session', ownerToken);
    assert.equal((await actions.adminChangeAccess(users[0].id, 'manager', 'revoked')).ok, true);
    jar.set('site-admin-session', managerToken);
    assert.equal(await auth.currentAdmin(), null);
    assert.equal((await auth.loginAdminAccount(email, password)).ok, false);
    jar.set('site-admin-session', ownerToken);
    await auth.logoutAdminAccount();
    jar.set('site-admin-session', ownerToken);
    assert.equal(await auth.currentAdmin(), null);
    jar.clear();
    for (let i = 0; i < 10; i++) assert.equal((await auth.loginAdminAccount('admin', 'wrong')).ok, false);
    assert.match((await auth.loginAdminAccount('admin', process.env.ADMIN_OWNER_PASSWORD)).message, /15 минут/);
    // An old-plan cookie cannot be forged with an empty password when only ADMIN_OWNER_PASSWORD is configured.
    const crypto = require('node:crypto'), expires = String(Date.now() + 10000), payload = expires + '.nonce';
    jar.set('settlement-plan-admin', payload + '.' + crypto.createHmac('sha256', '').update(payload).digest('hex'));
    assert.equal(await auth.currentAdmin(), null);
  } finally { requestHeaders.clear(); jar.clear(); await fs.rm(dir, { recursive: true, force: true }); }
});
test('Every registered field has a valid default and globally unique identity', () => {
  const keys = new Set();
  for (const page of cmsPages) {
    assert.match(page.id, /^[a-z0-9-]+$/);
    for (const field of page.fields) {
      assert.equal(keys.has(field.key), false, field.key);
      keys.add(field.key);
      assert.equal(validateCmsValues(page, { [field.key]: field.value }), true, field.key);
    }
  }
});
