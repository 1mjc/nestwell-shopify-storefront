# Shopify Connection Notes

The user’s verified Shopify Admin session for the Nestwell store is available through the personal browser session. The store’s existing public domain resolves to `wenestwell.com`, while the requested Shopify store domain remains `kjir11-dn.myshopify.com` for Storefront API requests.

The original project integration authorization loop was blocked by a sandbox CAPTCHA verification challenge. The verified personal browser avoids that block. The official Shopify **Headless** sales channel was installed with user confirmation and its storefront-creation page is open at `https://admin.shopify.com/store/wenestwell/headless/new`.

The next approved setup step is to create a Headless storefront named `Nestwell Storefront`, then configure its Storefront API permissions for product and collection reads, inventory availability, tags, and cart or checkout interactions. Shopify’s current Storefront API documentation identifies the Headless channel as the supported route for generating and managing private Storefront API tokens.

The Headless page renders the **Create storefront** control as a Shopify internal custom element rather than a standard accessible button. The page is confirmed open, but the control is not currently addressable through the browser’s indexed interactive-element list. This is a UI-automation limitation, not an account or authorization failure.

The storefront was successfully created through the Headless channel and is currently named `Nestwell Headless` by Shopify. Its management page is `https://admin.shopify.com/store/wenestwell/headless/343092`, where the **Storefront API** management control is available for permission configuration and private-token generation.

The Storefront API management page is active and Shopify has generated both public and private access tokens for this storefront. Token values are intentionally not recorded in this project file. The next setup action is to enable the minimum Storefront API permissions needed for product discovery, collection browsing, inventory availability, product tags, and cart or checkout flows.
