export const Z_INDEX = {
  NAVBAR: 100,
  DROPDOWN: 200,
  SIDEBAR: 300,
  DRAWER: 400,
  FILTERS: 500,
  MODAL: 1000,
  TOAST: 1100,
} as const;

export const LAYER_NAMES = [
  'NAVBAR',
  'DROPDOWN',
  'SIDEBAR',
  'DRAWER',
  'FILTERS',
  'MODAL',
  'TOAST',
] as const;

export type LayerName = (typeof LAYER_NAMES)[number];
