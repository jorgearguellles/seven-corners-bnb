import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

declare global {
  interface Window {
    Stripe?: (key: string) => any;
  }
}

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return window.Stripe?.(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return null;
};
