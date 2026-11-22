import fs from 'node:fs';
const path=new URL('../apps/customer/src/api/mock/products.json',import.meta.url);
const products=JSON.parse(fs.readFileSync(path,'utf8'));
const ids=new Set(),names=new Set();
for(const item of products){
  if(!item.id||!item.name||!item.category||!item.imageUrl)throw Error('Invalid product record');
  if(ids.has(item.id)||names.has(item.name))throw Error('Duplicate product: '+item.id);
  ids.add(item.id);names.add(item.name);
  if(typeof item.priceRub!=='number'||!Number.isFinite(item.priceRub)||item.priceRub<=0)
    throw Error('Expected owner-supplied positive price: '+item.name);
  if(item.category==='Пиццы'){
    if(!item.description||typeof item.weightGrams!=='number'||item.weightGrams<100)
      throw Error('Missing owner-supplied pizza description or weight: '+item.name);
    if(!item.variants?.length||item.variants.some(v=>typeof v.priceRub!=='number'||v.priceRub<=0))
      throw Error('Invalid pizza variant: '+item.name);
  }
  for(const group of item.modifierGroups??[]){
    if(group.minSelected<0||group.maxSelected<group.minSelected||group.maxSelected>group.modifiers.length)
      throw Error('Invalid extra selection limits: '+item.name);
  }
}
if(products.length!==15||ids.size!==15||names.size!==15)throw Error('Expected 15 distinct catalog entries');
console.log('OK: all 15 items have owner-supplied prices; nine pizzas have weights and descriptions.');
