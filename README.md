# Heartmail Moment Maker

# MASTER BUILD PROMPT — PREMIUM INTERACTIVE DIGITAL CARDS PLATFORM

## 1. YOUR ROLE

Act as a senior product architect, UI/UX designer, frontend engineer, backend engineer, database architect, payment integration specialist, security engineer, SEO specialist, and QA engineer.

Design and build a production-ready, premium web application for creating personalized, interactive digital greeting cards and surprise experiences.

This must be a complete, working product—not just a landing page, static prototype, or collection of nonfunctional UI screens.

Use the attached MyHeartCraft website screenshots as functional inspiration. Analyze the landing page, category cards, trending cards, testimonials, FAQs, mobile card creator, step indicators, template previews, pricing, and checkout flow.

**Create an original brand identity, original components, better user experience, and more powerful features. Do not copy MyHeartCraft's name, branding, source code, illustrations, or exact layouts.**

The finished platform should feel like a premium digital gifting product that can compete internationally.

## 2. PRODUCT VISION

Build a platform where a user can:

1. Browse digital cards by occasion and relationship.
2. Select a card experience and design template.
3. Personalize the card using names, messages, photos, colors, animations, and other available options.
4. Interact with a live preview that closely matches the final recipient experience.
5. See transparent pricing, discounts, and the final payable amount.
6. Pay securely using a payment gateway.
7. Receive a unique, shareable card link after verified payment.
8. Share the card through WhatsApp, Instagram, Telegram, email, or by copying the link.
9. Let the recipient open and enjoy the card without installing an application or creating an account.

The recipient experience should be optimized for mobile browsers but work correctly on desktop and tablets.

Primary market: India, with an architecture ready for international expansion.

Default currency: INR (₹).

Business model: one-time payments per personalized digital card, with optional premium upgrades and future bundles.

## 3. REQUIRED TECHNOLOGY STACK

Use the following technologies unless the platform has a genuine technical limitation.

### Frontend
- React
- TypeScript with strict type checking
- Tailwind CSS
- Framer Motion for meaningful, performant UI animations
- Vite if using a conventional React SPA
- React Router or the platform's supported routing solution
- Lucide React for consistent interface icons

Do not introduce unnecessary UI frameworks or multiple overlapping animation libraries.

### Backend and data
- Supabase for PostgreSQL database, authentication, file storage, and Row Level Security
- Supabase Edge Functions or a secure server-side runtime for sensitive operations
- Database migrations and documented environment variables

If the chosen builder has a better-supported integrated backend, explain the trade-offs before substituting the architecture. Keep the application portable and avoid unnecessary proprietary dependencies.

### Payments
- Razorpay for Indian payments
- Razorpay Checkout or an equivalent supported hosted payment experience
- Server-side order creation, payment verification, and webhook processing
- Payment records and order states stored in the database

Keep the payment provider modular so another gateway can be added later.

### Deployment
- Vercel or another suitable production hosting provider
- Supabase for managed backend services
- Custom-domain support
- HTTPS, production environment variables, error monitoring, and deployment documentation

Do not hardcode secrets or credentials in frontend code.

## 4. BRAND IDENTITY AND DESIGN SYSTEM

Create a completely original visual identity. Use the working product name "HeartMuse" as a temporary name, but make the name configurable before launch.

The design should feel emotional, elegant, modern, playful, and premium—not childish or excessively pink.

### Primary palette
- Midnight navy: #17172B
- Electric violet: #7965F2
- Warm ivory: #FFF9F2
- Soft lavender: #EAE5FF
- Coral accent: #FF7D8E
- Muted text: #77758A
- White: #FFFFFF

Use accessible contrast ratios for text and interactive elements. Validate the final palette rather than assuming every combination passes accessibility requirements.

### Design direction
- Elegant display typography paired with a highly readable sans-serif.
- Spacious layouts with strong visual hierarchy.
- Rounded cards with restrained shadows.
- Subtle gradients, delicate decorative elements, and purposeful motion.
- Premium mockups of interactive cards on phone screens.
- Refined hover states and clear button feedback.
- Consistent spacing, radii, typography, color tokens, and responsive breakpoints.
- Light theme as the default, with selected dark visual themes inside card experiences.
- No excessive glassmorphism, generic AI-generated landing page patterns, or unnecessary animation.

Create multiple card-specific visual themes, including:
1. Midnight Romance.
2. Lavender Dreams.
3. Golden Celebration.
4. Minimal Ivory.
5. Neon Play.
6. Botanical Memories.
7. Cosmic Wishes.
8. Vintage Paper.

These are card themes, not separate website designs.

Create reusable design tokens and a consistent component library.

## 5. COMPLETE WEBSITE STRUCTURE

Build the following routes.

### Public website
- `/` — Home
- `/cards` — Browse all cards
- `/categories/:slug` — Occasion categories
- `/cards/:slug` — Card details and available designs
- `/create/:templateSlug` — Card creation wizard
- `/preview/:draftId` — Private draft preview
- `/pricing` — Pricing and optional bundles
- `/about` — About the brand
- `/contact` — Contact and support
- `/faq` — Frequently asked questions
- `/blog` — SEO-friendly articles
- `/blog/:slug` — Individual article
- `/privacy-policy` — Privacy policy
- `/terms` — Terms and conditions
- `/refund-policy` — Refund policy
- `/payment/success` — Payment confirmation
- `/payment/failed` — Payment failure and retry
- `/order/:orderId` — Customer order status, securely authorized
- `/c/:publicToken` — Published recipient card experience
- `/not-found` — Custom 404 page

### Admin dashboard
- `/admin`
- `/admin/cards`
- `/admin/templates`
- `/admin/categories`
- `/admin/orders`
- `/admin/payments`
- `/admin/coupons`
- `/admin/testimonials`
- `/admin/blog`
- `/admin/analytics`
- `/admin/settings`

Protect every admin route and privileged operation with server-side authorization.

Do not expose private drafts, customer information, payment data, or administrative data through public endpoints.

## 6. HOMEPAGE EXPERIENCE

Create a premium, conversion-focused homepage with the following sections.

### A. Navigation
- Original text logo and brand mark.
- Cards.
- Categories dropdown.
- How It Works.
- Pricing.
- Blog.
- Support.
- Primary CTA: Create a Card.
- Responsive mobile navigation.
- Sticky navigation where appropriate.

### B. Hero section
Use a headline such as:

"Turn Your Feelings Into an Unforgettable Experience."

Supporting text:

"Create personalized digital surprises filled with memories, beautiful animations, and words that matter. One link, one special moment."

Include:
- Primary CTA: Create Your Card.
- Secondary CTA: Explore Experiences.
- Interactive card mockup on a smartphone.
- A tasteful animated preview demonstrating a card opening.
- Floating visual elements that respect reduced-motion preferences.

Do not invent customer numbers, ratings, or testimonials.

### C. Occasion explorer
Create visually appealing category cards for:
- Birthday.
- Sorry and apology.
- Marriage proposal.
- Anniversary.
- Friendship.
- Thank you.
- Miss you.
- Mother's Day.
- Father's Day.
- Valentine's Day.
- Wedding.
- Graduation.
- Congratulations.
- Farewell.
- Long-distance relationships.
- Just because.
- Festivals and cultural occasions.
- Baby announcements.
- Personalized photo puzzles.

Each category should have an original icon or illustration, a concise description, and a working navigation link.

Categories and templates must be manageable from the admin dashboard.

### D. Trending experiences
Build a responsive horizontal carousel featuring real templates from the database.

Each card should display:
- Template artwork or live preview.
- Occasion.
- Theme.
- A descriptive label such as Popular or New, only when justified by actual data.
- Starting price.
- CTA to explore or create.

Implement functioning previous/next controls, keyboard navigation, touch gestures, and sensible mobile layouts.

### E. Featured interactive experiences
Showcase the most visually impressive cards:
- A birthday celebration with virtual candles and a cake reveal.
- A proposal with a playful question interaction.
- A photo puzzle with a hidden reveal.
- An anniversary timeline.
- A personalized apology letter.

Use actual working experiences rather than static images pretending to be interactive.

### F. How it works
Display four simple steps:

1. Choose an experience.
2. Personalize your card.
3. Preview and pay.
4. Share your private link.

Explain that the recipient does not need to download an app.

### G. Benefits
Explain the value proposition:
- Personal and customizable.
- Interactive rather than static.
- Instant digital delivery after verified payment.
- Works across devices.
- Shareable through messaging applications.
- Optional password protection and scheduled delivery where supported.

### H. Testimonials
Create a responsive testimonial section populated from approved database entries.

Provide an admin workflow to add, edit, approve, and remove testimonials.

Never fabricate user reviews or imply that a customer has endorsed the product without authorization.

### I. Pricing section
Explain the one-time payment model, what each card includes, and optional upgrades.

Show the original price, discounted price, savings, and final payable amount clearly.

### J. FAQ and final CTA
Include FAQs about creating cards, personalization, uploads, payments, refunds, privacy, sharing, expiration, and delivery.

Finish with a strong CTA and a complete footer.

## 7. CARD CATEGORIES AND INTERACTIVE EXPERIENCES

Create a reusable card engine that supports different experiences through template configuration and reusable React components.

Do not build a separate hardcoded application for each occasion.

### A. Birthday celebration
Include:
- Recipient and sender names.
- Birthday date.
- Customizable cake style and decorations.
- Candle count.
- Interactive candle-blowing experience, with a tap-to-blow fallback.
- Balloon popping.
- Confetti and celebration effects.
- Personalized letter.
- Optional photo gallery.
- Background music, subject to licensing.
- Final birthday reveal.

### B. Sorry card
Use the attached sorry-card creation flow as a functional reference.

Step 1: Recipient details.
- Recipient name.
- Sender name.
- Optional relationship.

Step 2: Personal message.
- Three editable message fields.
- Main personal apology letter.
- Character counter and sensible limits.
- Optional photo attachments.
- Optional four-digit passcode.
- Optional music selection.

Step 3: Select a design.
- Multiple original templates.
- Live preview.
- Theme selection.
- Optional animation preferences.

Step 4: Review.
- Confirm the names and messages.
- Preview the recipient experience.
- Display the final price and applicable discount.

Step 5: Checkout.
- Create a server-side payment order.
- Complete payment securely.
- Verify the result before publishing.

Step 6: Delivery.
- Generate the private card URL.
- Display a success page.
- Offer Copy Link and Share on WhatsApp actions.

Recipient experience:
- Animated introduction.
- Optional interactive reveal.
- Personalized apology messages.
- Letter or envelope animation.
- Closing message and optional response interaction.

All messages must be editable. Never force fixed text that the customer cannot change unless it is an intentional, documented design element.

### C. Proposal card
Include:
- Names and relationship details.
- Custom proposal question.
- Optional custom response choices.
- Playful interactions and animations.
- A celebratory ending after the recipient responds positively.

Provide an accessible, respectful alternative to a moving "No" button. Do not trap the recipient, prevent dismissal, or make the experience impossible to exit.

### D. Surprise photo puzzle
Include:
- Photo upload and cropping.
- 3×3 and 4×4 puzzle difficulty.
- Touch and mouse interactions.
- Randomized but solvable puzzle state.
- Move counter and optional timer.
- Hidden message or reveal.
- Optional follow-up question.
- Responsive game layout.
- Completion animation.

Validate puzzle solvability and provide keyboard-accessible controls.

### E. Anniversary experience
Include:
- Anniversary date and relationship milestone.
- Time-together counter where appropriate.
- Timeline of memories.
- Photo gallery.
- Custom messages and letters.
- Animated milestones.
- Final surprise reveal.

### F. Friendship card
Include:
- Best friend's name and sender name.
- Years of friendship.
- Shared memories.
- Photo reveal.
- Interactive friendship quiz or memory cards.
- Custom letter.
- Optional inside jokes.

### G. Thank you card
Include:
- Recipient and sender names.
- Reason for gratitude.
- Animated message reveals.
- Opening envelope.
- Handwritten-style letter.
- Optional photo and theme.

### H. Miss you card
Include:
- Recipient and sender names.
- Optional date of last meeting.
- Personalized messages.
- Photo reveal.
- Interactive letters or memory timeline.
- Optional countdown to a future meeting.

### I. Mother's Day and Father's Day
Include:
- Custom family names and nicknames.
- Sender relationship.
- Language selection.
- Personalized letters.
- Memory notes and photos.
- Warm visual themes.
- Animated closing message.

### J. Future template support
Allow administrators to create additional card templates without redesigning the entire application.

The template system should support reusable fields, optional fields, validation rules, themes, preview components, recipient experiences, pricing, and feature flags.

## 8. CARD CREATION STUDIO

The editor is one of the most important parts of this product.

Create a guided multi-step wizard with:
- Clear progress indicator.
- Back and Next buttons.
- Inline validation.
- Save draft.
- Restore draft.
- Responsive form controls.
- Accessible keyboard navigation.
- Unsaved-changes protection.
- Helpful empty states and errors.

### Customization capabilities
Where supported by the selected template, allow:
- Recipient name.
- Sender name.
- Custom headline.
- Multiple messages.
- Long-form letter.
- Photos and cropping.
- Color themes.
- Font combinations.
- Background style.
- Animation style.
- Music choice.
- Optional password.
- Optional delivery date.
- Optional expiry date.
- Optional additional message.

Show only relevant customization fields for each template.

### Live preview
Create a real preview of the actual recipient experience.

Requirements:
- Reflect edits immediately.
- Allow the creator to replay the experience.
- Provide mobile and desktop preview modes.
- Preview animations without triggering payment.
- Clearly mark any feature that is only enabled after payment.
- Prevent test interactions from altering the saved draft unexpectedly.

The preview must use the same renderer and template logic as the published recipient experience. Avoid building a separate fake preview.

### Draft persistence
Persist drafts in the database when appropriate. Use a temporary local draft only as a recovery mechanism.

Support anonymous draft creation through a secure server-managed session or equivalent design. Avoid exposing sequential database IDs or allowing users to modify other customers' drafts.

## 9. PRICING AND DISCOUNTS

Build a configurable pricing engine.

Example:
- Original price: ₹250.
- Special offer: ₹50 off.
- Final price: ₹200.
- Discount: 20%.

Display:

Original price: ₹250  
Special offer: −₹50  
You save: ₹50  
**Pay ₹200**

These are illustrative values, not permanent prices.

### Pricing requirements
- Store prices as integer paise for INR.
- Store the original price and discount configuration in the database.
- Calculate final prices on the server.
- Never trust an amount submitted by the browser.
- Support fixed discounts and percentage discounts.
- Support coupon codes where enabled.
- Support campaign start and end dates.
- Support optional upgrades and bundles.
- Display taxes or additional charges accurately when applicable.
- Do not invent fake discounts or reset countdown timers.
- Make promotional badges conditional on real pricing data.

The displayed total and the amount submitted to the payment gateway must match.

## 10. PAYMENT INTEGRATION — CRITICAL

Implement Razorpay as a genuine payment integration.

Do not simulate successful payments or publish paid cards when a frontend callback merely says payment succeeded.

### Checkout workflow

1. The user finishes personalizing the card.
2. The frontend requests a checkout order from a protected server endpoint.
3. The backend loads the applicable template price and calculates the final amount.
4. The backend creates an order using the Razorpay server-side API.
5. The frontend launches the supported Razorpay Checkout experience for that order.
6. The user completes the payment.
7. The backend verifies the payment signature and confirms the payment status with the provider as appropriate.
8. A signed webhook independently processes payment events and supports recovery if the browser closes.
9. Payment processing is idempotent, so duplicate callbacks or webhook deliveries cannot publish duplicate orders or grant duplicate entitlements.
10. After verified payment, the backend marks the order paid and publishes the finalized card.
11. The user receives the private card URL and sharing options.

### Payment security
- Keep Razorpay Key Secret and webhook secret exclusively on the server.
- Never accept payment status, amount, order ownership, or publication permission solely from the client.
- Verify signatures using the documented provider procedure.
- Verify that the payment belongs to the expected order and amount.
- Handle pending, failed, cancelled, captured, and refunded states.
- Make webhook processing idempotent.
- Prevent price tampering.
- Prevent unauthorized access to order details.
- Do not store card numbers, CVVs, UPI PINs, or other payment credentials.
- Provide clear retry and support paths for failed or pending payments.
- Never publish a card merely because the payment-success URL was opened.

If credentials are unavailable during development, implement the integration structure and a clearly labelled sandbox/test mode. Do not claim that live payments are working until real credentials, webhook configuration, and end-to-end verification have been completed.

## 11. PRIVATE CARD LINKS AND DELIVERY

After successful payment, generate an unpredictable, high-entropy public token for the recipient URL.

Example format:

`https://yourdomain.com/c/UNPREDICTABLE_TOKEN`

Requirements:
- The recipient does not need an account.
- The creator can preview the finalized card.
- The recipient can replay the experience.
- The creator can copy the URL.
- Include a WhatsApp sharing action using a properly encoded URL and optional message.
- Provide a QR code as an optional feature.
- Do not place sensitive recipient names, letters, photos, or payment details inside URL parameters.
- Exclude private recipient routes from search indexing.
- Avoid exposing database IDs or sequential tokens.
- Support optional PIN/password protection with server-side verification.
- Rate-limit password attempts.
- Provide configurable expiry and revocation.
- Make access behavior clear when a card expires or is revoked.

Use appropriate Open Graph metadata for share previews, but do not expose private letters or uploaded photographs in public link previews.

### Scheduled delivery
If scheduled delivery is enabled:
- Store the intended delivery time and timezone.
- Use a reliable scheduled server-side job.
- Ensure the card is not published or delivered early.
- Show the scheduled status to the creator.
- Provide cancellation or editing rules.
- Handle delayed jobs and retries safely.

Do not claim that scheduled messages are sent automatically through WhatsApp unless an authorized integration actually supports that behavior. The basic product should deliver a shareable URL.

## 12. DATABASE DESIGN

Create normalized PostgreSQL tables with migrations, appropriate indexes, foreign keys, constraints, and Row Level Security.

Suggested tables:

### `profiles`
- id
- display_name
- created_at
- updated_at

### `categories`
- id
- name
- slug
- description
- icon
- is_active
- sort_order

### `templates`
- id
- category_id
- name
- slug
- description
- thumbnail_url
- experience_type
- configuration JSONB
- base_price_paise
- currency
- is_active
- created_at
- updated_at

### `drafts`
- id
- owner_id, nullable for secure anonymous sessions
- template_id
- session_reference
- personalization JSONB
- status
- created_at
- updated_at
- expires_at

### `cards`
- id
- draft_id
- template_id
- public_token_hash or equivalent secure token representation
- recipient_access_settings
- personalization JSONB
- status
- published_at
- expires_at
- revoked_at
- created_at

### `orders`
- id
- owner_id, nullable for eligible anonymous checkout flows
- draft_id
- card_id, nullable until publication
- original_amount_paise
- discount_amount_paise
- final_amount_paise
- currency
- payment_provider
- provider_order_id
- status
- created_at
- updated_at

### `payments`
- id
- order_id
- provider_payment_id
- amount_paise
- currency
- status
- verified_at
- created_at

### `coupons`
- id
- code
- discount_type
- discount_value
- start_at
- expires_at
- usage_limit
- is_active

### `uploads`
- id
- owner_id or secure draft ownership reference
- storage_path
- mime_type
- size_bytes
- created_at

### `testimonials`
- id
- author_display_name
- content
- rating
- is_approved
- created_at

### `blog_posts`
- id
- title
- slug
- excerpt
- content
- cover_image
- status
- published_at
- updated_at

### `admin_audit_logs`
- id
- actor_id
- action
- resource_type
- resource_id
- created_at

Add any additional tables required for coupons, scheduled delivery, webhook event deduplication, customer support, analytics consent, or product settings.

Do not store unnecessary personal information. Apply appropriate data-retention policies.

## 13. SUPABASE SECURITY

Implement:
- Row Level Security on all customer-accessible tables.
- Server-side authorization for all privileged actions.
- Restricted admin access.
- Private storage buckets for drafts and customer uploads.
- Signed URLs or an equivalent secure mechanism for protected media.
- MIME type, file size, and file-content validation.
- Upload rate limits.
- Protection against cross-customer access.
- Safe public access to published cards using unguessable tokens.
- Server-side input validation using a suitable schema validation library.
- Secret management through environment variables.
- Proper handling of Supabase service-role credentials.

Never expose the service-role key to the browser.

Anonymous users must not be able to enumerate drafts, retrieve arbitrary uploads, inspect other customers' orders, or change published card data without authorization.

## 14. ADMIN DASHBOARD

Build a genuinely functional admin panel.

### Overview
- Total orders.
- Verified revenue.
- Payment success and failure counts.
- Popular templates.
- Sales over time.
- Coupon performance.
- Recent orders.

### Template management
- Create, edit, duplicate, publish, unpublish, and archive templates.
- Change prices and discount settings.
- Manage categories and template order.
- Configure fields and optional features.
- Preview the customer and recipient experiences.

### Orders and payments
- Search by order reference.
- Filter by status and date.
- View payment status.
- Inspect payment-provider references.
- Track refunds and failed payments.
- Provide safe support workflows.

Do not expose sensitive payment credentials or full customer messages unnecessarily.

### Content management
- Manage FAQs.
- Manage testimonials.
- Publish blog articles.
- Configure homepage sections.
- Update support contact details and legal-page content.
- Manage promotional campaigns.

All admin operations must persist to the database.

## 15. SEO AND PERFORMANCE

Implement technical SEO appropriate to the selected rendering architecture.

Requirements:
- Semantic HTML.
- Unique page titles and meta descriptions.
- Canonical URLs.
- Open Graph and Twitter/X metadata.
- XML sitemap for public pages.
- Robots.txt.
- Structured data where valid and appropriate.
- Breadcrumbs on relevant pages.
- Clean, readable URLs.
- Internal linking between related occasions and templates.
- Server-rendered or prerendered public marketing pages when supported.
- No indexing of drafts, private cards, checkout pages, admin pages, or private order data.
- Optimized images in modern formats.
- Responsive image sizing.
- Lazy loading below-the-fold images.
- Code splitting and route-level lazy loading.
- Minimize unnecessary JavaScript.
- Avoid layout shifts.
- Avoid loading heavy 3D assets on every page.
- Load animations and optional media only when required.

Target Lighthouse scores of 90+ across Performance, Accessibility, Best Practices, and SEO, with a stretch goal of 95–100 where achievable.

Measure real results on representative mobile and desktop pages. Do not claim a score of 100 without testing.

## 16. ACCESSIBILITY AND RESPONSIVE DESIGN

Support:
- Mobile phones from small screens upward.
- Tablets.
- Laptops.
- Desktop monitors.
- Touch and mouse interactions.
- Keyboard navigation.
- Visible focus states.
- Accessible form labels and error messages.
- Correct heading hierarchy.
- Reduced-motion preferences.
- Sufficient color contrast.
- Screen-reader announcements for important state changes.
- Accessible dialogs and menus.
- Non-audio alternatives for sound-dependent interactions.
- Play, pause, replay, and exit controls where appropriate.

The card editor and recipient experiences are mobile-first.

Never allow decorative effects to block content, form submissions, navigation, or checkout.

## 17. ANIMATION AND INTERACTION QUALITY

Use Framer Motion for purposeful transitions:
- Page and section entrances.
- Wizard transitions.
- Card reveals.
- Modal transitions.
- Template switching.
- Celebration effects.
- Interactive envelopes and letters.

Use CSS animations for lightweight decorative effects when simpler.

Avoid unnecessary particle systems, permanent motion, excessive re-renders, and expensive animation loops.

Animations must be interruptible, responsive, and safe to replay.

Honor reduced-motion preferences and ensure that all important information remains accessible without animation.

Do not add Three.js unless a particular feature genuinely benefits from 3D. Keep the initial experience fast and maintainable.

## 18. PRIVACY, CONTENT SAFETY, AND LEGAL READINESS

Provide editable privacy, terms, and refund policy pages that can be reviewed before launch.

Requirements:
- Obtain appropriate consent for optional analytics and marketing cookies.
- Provide clear photo upload and retention disclosures.
- Implement account deletion and data deletion workflows where applicable.
- Avoid collecting unnecessary personal information.
- Provide abuse reporting and card revocation.
- Protect uploads from public enumeration.
- Provide rate limiting and spam protection.
- Support applicable Indian privacy requirements and relevant international requirements for the markets served.
- Do not collect sensitive recipient data unless genuinely necessary.
- Do not claim legal compliance without appropriate review.

Music, fonts, illustrations, photos, and sound effects must be licensed for the intended commercial use.

## 19. ANALYTICS AND CONVERSION

Implement privacy-conscious event tracking where appropriate.

Track events such as:
- Homepage CTA click.
- Category viewed.
- Template selected.
- Draft started.
- Personalization completed.
- Preview opened.
- Checkout started.
- Payment succeeded.
- Payment failed.
- Card published.
- Share link copied.
- WhatsApp share initiated.

Do not include personal letters, names, uploaded images, payment credentials, or other sensitive content in analytics events.

Build an admin dashboard for meaningful conversion metrics. Distinguish verified payment revenue from pending or failed orders.

## 20. TESTING REQUIREMENTS

Create automated tests for critical application flows.

### Frontend tests
- Form validation.
- Wizard navigation.
- Draft restoration.
- Live preview synchronization.
- Puzzle interactions.
- Template switching.
- Pricing display.
- Error and loading states.

### Backend tests
- Authorization and ownership checks.
- Price calculation.
- Payment signature verification.
- Webhook signature verification.
- Webhook idempotency.
- Duplicate payment handling.
- Secure token generation.
- Card publication.
- Expiration and revocation.
- Upload restrictions.

### End-to-end tests
1. Browse templates.
2. Create a card.
3. Customize it.
4. Preview it.
5. Start checkout.
6. Complete a sandbox payment.
7. Verify payment server-side.
8. Publish the card.
9. Open the recipient link in a separate browser session.
10. Replay the card.
11. Copy and share the link.
12. Verify access restrictions.

Also test failed payments, duplicate webhooks, expired cards, invalid tokens, unauthorized access, and mobile layouts.

Do not mark a test as passed unless it has actually run.

## 21. DEVELOPMENT AND DELIVERY STRATEGY

Build the product in controlled phases while maintaining one coherent application.

### Phase 1 — Foundation
- Establish the design system.
- Build responsive navigation and homepage.
- Set up routes, TypeScript, Tailwind CSS, and Framer Motion.
- Configure Supabase.
- Create database migrations and security policies.

### Phase 2 — Card engine
- Implement categories and templates.
- Build the reusable card creation wizard.
- Implement draft persistence.
- Build the live preview and recipient renderer.
- Deliver three fully working template experiences: Birthday, Sorry, and Photo Puzzle.

### Phase 3 — Payments
- Implement server-side pricing.
- Integrate Razorpay in test mode.
- Implement order creation, payment verification, and signed webhooks.
- Add idempotent payment processing.
- Implement secure card publication and delivery.

### Phase 4 — Additional experiences
- Proposal.
- Anniversary.
- Friendship.
- Thank You.
- Miss You.
- Mother's Day.
- Father's Day.
- Remaining occasions and templates.

### Phase 5 — Admin and operations
- Admin authentication and authorization.
- Template management.
- Order and payment management.
- Coupons and promotions.
- Content management and analytics.

### Phase 6 — Production readiness
- Automated tests.
- Security review.
- Accessibility audit.
- Performance optimization.
- SEO validation.
- Production environment configuration.
- Custom domain and HTTPS.
- Payment webhook deployment.
- Backup and recovery plan.

Implement the phases sequentially. Prioritize a complete, reliable end-to-end flow over a large collection of unfinished templates.

## 22. NON-NEGOTIABLE BUILD RULES

1. Build a working application, not a static design mockup.
2. Do not leave primary buttons without working actions.
3. Do not use placeholder payment-success logic.
4. Do not hardcode all templates into one enormous component.
5. Use reusable, typed components and clear module boundaries.
6. Do not duplicate the entire application for each card occasion.
7. Do not invent testimonials, sales figures, or discounts.
8. Do not store secrets in frontend code.
9. Do not expose private drafts or uploaded photos publicly.
10. Do not publish a paid card until payment verification succeeds.
11. Do not use a fake live preview; use the actual experience renderer.
12. Do not use lorem ipsum or unexplained placeholder sections in customer-facing pages.
13. Include loading, empty, success, failure, and retry states.
14. Keep all pricing, templates, categories, and promotions configurable.
15. Keep the code maintainable and suitable for a real production team.
16. Do not claim that an integration or deployment is complete if it has not been tested.
17. Do not ask me to manually perform tasks that can be completed safely through the available builder tools.
18. If credentials or external approvals are required, finish the implementation around them, identify the exact missing configuration, and explain how to complete it.
19. Do not silently replace requested technology or functionality.
20. Maintain a clear README, environment-variable example, migration instructions, and deployment checklist.

## 23. DEFINITION OF DONE

The project is ready for a production-readiness review when:

- The homepage and all main navigation routes work.
- Users can browse real templates.
- The Sorry Card, Birthday Card, and Photo Puzzle have complete creation and recipient experiences.
- Personalization updates the actual preview.
- Drafts persist and can be restored securely.
- Prices and discounts are calculated correctly.
- Razorpay test payments can be verified end to end.
- Failed payments do not unlock cards.
- Verified payments unlock a unique, secure recipient URL.
- The recipient can open and replay the experience without an account.
- Private information is protected.
- Admins can manage templates and orders.
- Responsive layouts work across supported screen sizes.
- Core tests have been executed and failures addressed.
- SEO, accessibility, performance, and security have been tested.
- Deployment instructions and production configuration are documented.

## 24. FIRST ACTION

Before implementing the full product:

1. Analyze the attached screenshots.
2. Propose an original visual direction and design system.
3. Define the application architecture, routes, data model, and payment workflow.
4. Identify technical limitations of the chosen builder.
5. Create a prioritized implementation plan.
6. Begin building the actual application immediately after the plan.
7. Complete one end-to-end card creation and payment flow before expanding the template library.

At the end of every phase, summarize what is implemented, what has been tested, what remains incomplete, and any external credentials required.

**Final objective:** Build a polished, scalable digital gifting platform that combines emotional storytelling, interactive card experiences, flexible customization, secure payments, and instant link-based delivery in one cohesive product.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://heartmail-moment-maker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d8d81970-1cc0-44af-a353-115be65d8fd2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
