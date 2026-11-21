import fs from 'node:fs';
const path=new URL('../apps/customer/src/api/mock/products.json',import.meta.url);
const products=JSON.parse(fs.readFileSync(path,'utf8'));
const names=new Set(), ids=new Set();
for(const item of products){if(!item.id||!item.name||!item.category||!item.imageUrl)throw Error('Invalid product record');if(ids.has(item.id))throw Error('Duplicate product id: '+item.id);ids.add(item.id);names.add(item.name);if(item.priceRub!==null)throw Error('Unverified price in catalog: '+item.name)}
if(products.length!==15||ids.size!==15||names.size!==15)throw Error('Expected 15 distinct catalog entries');
console.log('OK: 15 items, unique IDs and names, no invented prices. Binary images are checked separately.');
