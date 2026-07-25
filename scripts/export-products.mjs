import { mkdir, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../src/data/products.ts', import.meta.url), 'utf8');
const startMarker = 'export const PRODUCTS: Product[] = ';
const start = source.indexOf(startMarker);
const end = source.indexOf('\n\nexport const BRANDS', start);

if (start < 0 || end < 0) throw new Error('Không tìm thấy mảng PRODUCTS trong src/data/products.ts');

const literal = source.slice(start + startMarker.length, end).replace(/;\s*$/, '');
const products = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
const backendResources = new URL('../../backend/product-service/src/main/resources/', import.meta.url);
const output = new URL('products.json', backendResources);
await mkdir(backendResources, { recursive: true });
await writeFile(output, JSON.stringify(products, null, 2) + '\n', 'utf8');
console.log(`Đã đồng bộ ${products.length} sản phẩm sang backend.`);
