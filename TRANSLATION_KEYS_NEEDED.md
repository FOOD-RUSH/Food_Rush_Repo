# Translation Keys Required for Payment Warning

Add these translation keys to your localization files (`src/locales/en/translation.json` and `src/locales/fr/translation.json`):

## English (`src/locales/en/translation.json`)

```json
{
  "important_payment_notice": "IMPORTANT: Payment Required",
  "immediate_payment_required": "Payment is required IMMEDIATELY after placing your order. The restaurant will only see your order after successful payment.",
  "ensure_sufficient_funds": "Please ensure you have the FULL AMOUNT including delivery and service fees in your mobile money account BEFORE confirming this order.",
  "payment_methods_available": "Accepted: MTN Mobile Money & Orange Money"
}
```

## French (`src/locales/fr/translation.json`)

```json
{
  "important_payment_notice": "IMPORTANT : Paiement Requis",
  "immediate_payment_required": "Le paiement est requis IMMÉDIATEMENT après avoir passé votre commande. Le restaurant ne verra votre commande qu'après un paiement réussi.",
  "ensure_sufficient_funds": "Veuillez vous assurer d'avoir le MONTANT TOTAL incluant les frais de livraison et de service dans votre compte mobile money AVANT de confirmer cette commande.",
  "payment_methods_available": "Accepté : MTN Mobile Money & Orange Money"
}
```

## Notes

- These keys are used in `src/components/customer/CustomOrderConfirmationModal.tsx`
- The component has fallback English text if translations are missing
- Make sure to add these to both language files for consistency
- The warning message is designed to be clear and prominent to prevent payment issues
