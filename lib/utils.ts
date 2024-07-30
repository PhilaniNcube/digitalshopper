import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Analytics from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




const GTM_CONTAINER_ID = "GTM-W63KNR93";

const analytics = Analytics({
  app: 'Digital Shopper', // Call this whatever you like.
  plugins: [
    googleTagManager({
      containerId: GTM_CONTAINER_ID,
      enabled: true,
    }),
  ],
});

export default analytics;
