/** Enforce the shared layout boundaries and prevent positional card hiding. */
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');

const layoutWidths = new Set([768, 1024, 1280]);
// Existing home-page adjustments: tight phone controls and a title line break.
// Neither changes the composition or removes content cards.
const localWidths = new Map([['app/globals.css', new Set([366, 820])]]);
const failures = [];
let checked = 0;

function inspect(file) {
  checked++;
  const root = postcss.parse(fs.readFileSync(file, 'utf8'), {from:file});
  root.walkAtRules('media', rule => {
    for (const feature of rule.params.matchAll(/\([^()]*width[^()]*\)/g)) {
      for (const number of feature[0].matchAll(/(\d+(?:\.\d+)?)px/g)) {
        const width = Number(number[1]);
        if (!layoutWidths.has(width) && !localWidths.get(file)?.has(width)) {
          failures.push(`${file}:${rule.source.start.line}: unsupported width ${width}px; see docs/responsive-rules.md`);
        }
      }
      if (/width\s*>=\s*1280px|1280px\s*<=\s*width|width\s*<\s*1280px/.test(feature[0])) {
        failures.push(`${file}:${rule.source.start.line}: wide layout starts above 1280px; compact includes 1280px`);
      }
    }
  });
  root.walkRules(rule => {
    const positionalCard = /\.(?:grid|relatedRail)[^{}]*(?::nth-child\(|:last-child|:first-child)/.test(rule.selector);
    if (positionalCard && rule.nodes.some(node => node.type === 'decl' && node.prop === 'display' && node.value === 'none')) {
      failures.push(`${file}:${rule.source.start.line}: do not hide a content card to fit the grid`);
    }
  });
}
function walk(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.css')) inspect(file);
  }
}
walk('app');
walk('components');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`Responsive rules: ${checked} CSS files checked.`);
