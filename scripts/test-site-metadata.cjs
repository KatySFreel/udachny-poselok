const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText, filename);

function load(mode) {
  for (const name of ['SITE_URL','PREVIEW_URL','PAGES_PREVIEW','NEXT_PUBLIC_BASE_PATH']) delete process.env[name];
  Object.assign(process.env, mode);
  for (const filename of ['../lib/site-metadata.ts','../lib/site-path.ts','../app/sitemap.ts','../app/robots.ts']) delete require.cache[require.resolve(filename)];
  return { ...require('../lib/site-metadata.ts'), sitemap:require('../app/sitemap.ts').default, robots:require('../app/robots.ts').default };
}
const page = {title:'Заголовок',description:'Описание',path:'/kontakty'};

test('Production canonical, OG and Twitter point to the current page; CMS overrides stay in sync', () => {
  const seo = load({SITE_URL:'https://example.test'});
  const metadata = seo.createPageMetadata(page);
  assert.equal(metadata.alternates.canonical.href,'https://example.test/kontakty');
  assert.equal(metadata.openGraph.url.href,metadata.alternates.canonical.href);
  assert.equal(metadata.openGraph.siteName,'Удачный посёлок');
  assert.equal(metadata.twitter.card,'summary_large_image');
  assert.deepEqual(metadata.twitter.images,metadata.openGraph.images);
  const copy = require('../lib/cms-contract.ts').createCopy({'seo.contacts.title':'Новый заголовок','seo.contacts.description':'Новое описание'});
  const updated = seo.localizePageMetadata(metadata,copy,'contacts');
  for (const target of [updated,updated.openGraph,updated.twitter]) {
    assert.equal(target.title,'Новый заголовок');
    assert.equal(target.description,'Новое описание');
  }
  assert.equal(updated.alternates.canonical.href,metadata.alternates.canonical.href);
  assert.equal(metadata.title,page.title);
  assert.equal(seo.sitemap().length,24);
  assert.equal(new Set(seo.sitemap().map(entry => entry.url)).size,24);
  assert.ok(seo.sitemap().some(entry => entry.url.endsWith('/poselki/simo')));
  assert.ok(seo.sitemap().some(entry => entry.url.endsWith('/poselki/troitskaya-sloboda')));
  assert.ok(seo.sitemap().every(entry => !/\/admin/.test(entry.url)));
  assert.equal(seo.robots().sitemap,'https://example.test/sitemap.xml');
});

test('Pages preview keeps its base path and never publishes production canonical or sitemap', () => {
  const seo = load({SITE_URL:'https://example.test',PAGES_PREVIEW:'1',PREVIEW_URL:'https://preview.test',NEXT_PUBLIC_BASE_PATH:'/udachny-poselok'});
  const metadata = seo.createPageMetadata({...page,image:{src:'/images/blog/cover.webp',alt:'Пейзаж'}});
  assert.equal(seo.indexable,false);
  assert.equal(metadata.alternates,undefined);
  assert.equal(metadata.openGraph.url.href,'https://preview.test/udachny-poselok/kontakty');
  assert.equal(metadata.openGraph.images[0].url.href,'https://preview.test/udachny-poselok/images/blog/cover.webp');
  assert.deepEqual(seo.sitemap(),[]);
  assert.equal(seo.robots().sitemap,undefined);
});

test('An unconfigured local host has no fabricated canonical or social image URL', () => {
  const seo = load({});
  const metadata = seo.createPageMetadata(page);
  assert.equal(seo.indexable,false);
  assert.equal(metadata.alternates,undefined);
  assert.equal(metadata.openGraph.url,undefined);
  assert.equal(metadata.openGraph.images,undefined);
  assert.deepEqual(seo.sitemap(),[]);
});
