import type { CatalogGateway } from '@/domain/catalog';
import { mockCatalogGateway } from './mock/catalog';
/** Switch adapter, not screens, when backend/POS is confirmed. */
export const catalogGateway:CatalogGateway=mockCatalogGateway;
