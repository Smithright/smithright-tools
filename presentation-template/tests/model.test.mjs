import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import '../src/model.js';
const source=JSON.parse(await readFile(new URL('../deck.json',import.meta.url),'utf8'));
assert.equal(FoldModel.validate(source).slides.length,7);
function rejects(change,pattern){const next=structuredClone(source);change(next);assert.throws(()=>FoldModel.validate(next),pattern);}
rejects(d=>d.schemaVersion=2,/schemaVersion/);
rejects(d=>d.slides[1].id=d.slides[0].id,/unique/);
rejects(d=>d.slides[0].id='deck',/reserved/);
rejects(d=>d.slides[0].accent='red; background:url(https://example.com)',/accent/);
rejects(d=>d.slides[0].layout='arbitrary-html',/layout/);
rejects(d=>d.slides[0].script='alert(1)',/unknown field/);
rejects(d=>d.slides=[],/1–80/);
rejects(d=>d.slides[5].items[0].value=101,/0 to 100/);
rejects(d=>d.slides[1].items.pop(),/exactly 4/);
rejects(d=>d.slides[0].details[0].body='x'.repeat(8001),/8000/);
console.log('PASS: source contract and invalid-input controls');
