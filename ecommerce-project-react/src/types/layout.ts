import type { RefObject } from 'react';

export interface MainLayoutContext {
  mainRef: RefObject<HTMLElement | null>;
}

export interface BannerItem {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  buttonText: string;
  image: string;
  bgColor: string;
}
