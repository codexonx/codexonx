'use server';

import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function createCheckoutSession(priceId: string) {
  // Auth kontrolü
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return redirect('/auth/login?from=/pricing');
  }

  const userId = (session.user as { id?: string | null })?.id ?? '';

  // Checkout session oluştur
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: session.user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: absoluteUrl('/dashboard?success=true'),
    cancel_url: absoluteUrl('/pricing?canceled=true'),
    metadata: {
      userId,
    },
  });

  // Redirect to checkout
  if (!checkoutSession.url) {
    throw new Error('Ödeme sayfası oluşturulamadı');
  }

  return redirect(checkoutSession.url);
}
