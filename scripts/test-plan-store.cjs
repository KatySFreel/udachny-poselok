const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = require("node:fs").readFileSync(filename, "utf8");
  module._compile(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
};
const {
  loadPlanDocument,
  persistPlanDocument,
} = require("../lib/plan-store.ts");
const { validatePlans } = require("../lib/plan-contract.ts");
const { settlementPages } = require("../content/settlement-pages.ts");

test("All settlement plans retain their source contours, phases and map states", () => {
  const counts = {
    "troitskaya-sloboda": [231],
    "istorii-severa": [168, 101],
    "bereg-tigody": [103],
    divnyy: [105],
    "severnyy-bereg": [24],
    "zelenyy-les": [336],
    simo: [24],
  };
  for (const page of settlementPages) {
    const plans = [page.plan, ...(page.additionalPlans ?? [])];
    assert.deepEqual(
      plans.map((p) => p.plots.length),
      counts[page.slug],
      page.slug,
    );
    assert(validatePlans(plans), page.slug);
  }
  const simo = settlementPages.find((p) => p.slug === "simo").plan;
  assert.equal(simo.plots.filter((p) => p.status === "construction").length, 2);
  assert.equal(simo.plots.filter((p) => p.status === "unavailable").length, 4);
  assert.equal(simo.overlays.length, 5);
  const tigoda = settlementPages.find((p) => p.slug === "bereg-tigody").plan;
  assert.equal(tigoda.plots.filter((p) => p.paths).length, 7);
  assert.equal(tigoda.plots.filter((p) => p.certificateEligible).length, 51);
});

test("Figma prices cover the sale plots and keep distinct duplicate numbers", () => {
  const prices = require('../content/settlement-plot-prices.json');
  assert.equal(Object.values(prices).reduce((sum, rows) => sum + Object.keys(rows).length, 0), 230);
  for (const page of settlementPages) {
    const plots = [page.plan, ...(page.additionalPlans ?? [])].flatMap(plan => plan.plots);
    for (const [id, expected] of Object.entries(prices[page.slug])) {
      const matches = plots.filter(plot => plot.id === id);
      assert.equal(matches.length, 1, id);
      assert.equal(matches[0].area, expected.area, id);
      assert.equal(matches[0].price, expected.price, id);
      assert(['available', 'construction'].includes(matches[0].status), id);
      assert(expected.area > 0 && Number.isSafeInteger(expected.price) && expected.price > 0, id);
    }
    const unknownPrices = plots.filter(plot => plot.status === 'available' && !plot.price).map(plot => plot.number);
    assert.deepEqual(unknownPrices, page.slug === 'simo' ? ['988', '965'] : [], page.slug);
    assert.equal(page.startingPrice, Math.min(...plots.filter(plot => plot.status === 'available' && plot.price).map(plot => plot.price)), page.slug);
  }
  assert.equal(prices['severnyy-bereg']['severnyy-bereg-2136-north'].price, 1564000);
  assert.equal(prices['severnyy-bereg']['severnyy-bereg-2136-east'].price, 1382000);
  assert.equal(prices.simo['simo-968'].price, 2800000);
  assert.equal(prices['troitskaya-sloboda']['troitskaya-u125'].price, 611000);
});

test("Plan storage: valid source, durable edits, concurrent revisions and invalid writes", async () => {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "settlement-plans-"),
  );
  const previous = process.env.PLAN_DATA_DIR;
  process.env.PLAN_DATA_DIR = directory;
  try {
    const initial = await loadPlanDocument("troitskaya-sloboda");
    assert.equal(initial.plans[0].plots.length, 231);
    assert(validatePlans(initial.plans));
    const plans = structuredClone(initial.plans),
      plot = plans[0].plots.find((p) => p.number === "2550");
    plot.price = 1_271_000;
    plot.certificateEligible = true;
    const results = await Promise.all([
      persistPlanDocument(initial.slug, 0, plans),
      persistPlanDocument(initial.slug, 0, plans),
    ]);
    assert.equal(results.filter((r) => r.ok).length, 1);
    assert(results.find((r) => !r.ok).conflict);
    const saved = await loadPlanDocument(initial.slug);
    assert.equal(saved.revision, 1);
    assert.equal(
      saved.plans[0].plots.find((p) => p.id === plot.id).price,
      1_271_000,
    );
    assert.equal(
      JSON.parse(
        await fs.readFile(path.join(directory, initial.slug + ".json"), "utf8"),
      ).revision,
      1,
    );
    for (const mutate of [
      (p) => p[0].plots.push(p[0].plots[0]),
      (p) => (p[0].plots[0].points[0][0] = -1),
      (p) => (p[0].image = "../private"),
      (p) => (p[0].plots[0].status = "invalid"),
      (p) => (p[0].plots[0].price = -10),
      (p) => (p[0].plots[0].phaseId = "missing"),
      (p) => (p[0].backgroundDataUrl = "data:image/svg+xml,<svg/>"),
    ]) {
      const invalid = structuredClone(saved.plans);
      mutate(invalid);
      assert.equal(
        (await persistPlanDocument(initial.slug, 1, invalid)).ok,
        false,
      );
      assert.equal((await loadPlanDocument(initial.slug)).revision, 1);
    }
    assert.equal(await loadPlanDocument("../../private"), null);
    assert.equal(await loadPlanDocument("missing-settlement"), null);
  } finally {
    if (previous === undefined) delete process.env.PLAN_DATA_DIR;
    else process.env.PLAN_DATA_DIR = previous;
    await fs.rm(directory, { recursive: true, force: true });
  }
});
