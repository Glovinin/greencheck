'use client'

import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import { getStripePromise } from '@/lib/stripe'

export default function StripeProvider({ 
  children,
  clientSecret,
  paymentMethod
}: { 
  children: React.ReactNode,
  clientSecret?: string,
  paymentMethod?: string
}) {
  const options: StripeElementsOptions = {
    // O Stripe suporta apenas alguns locales específicos
    locale: 'pt',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0A2540', // Cor principal
        colorBackground: '#ffffff',
        colorText: '#0A2540',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
    },
    clientSecret,
    ...(clientSecret && paymentMethod === 'multibanco' ? {
      payment_method_types: ['multibanco'],
      defaultValues: {
        billingDetails: {
          address: {
            country: 'PT'
          }
        }
      }
    } : {})
  }

  return (
    <Elements stripe={getStripePromise()} options={options}>
      {children}
    </Elements>
  )
} 