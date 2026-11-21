import type { CatalogGateway,Product } from '@/domain/catalog';
import products from './products.json';
const mockProducts = products as Product[];
export const mockCatalogGateway:CatalogGateway={async getProducts(){return mockProducts},async getProduct(id){return mockProducts.find(p=>p.id===id)??null}};
