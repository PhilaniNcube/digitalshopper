# Design System Document: High-Tech Precision Editorial

This design system is engineered to transform a standard e-commerce experience into a premium, high-tech digital showroom. We move beyond the "grid of boxes" to create a space that feels like a high-end laboratory: precise, immersive, and sophisticated.

## 1. Creative North Star: "The Kinetic Laboratory"
The "Kinetic Laboratory" aesthetic balances technical rigor with fluid movement. It avoids the cluttered, "discount" feel of traditional e-commerce by utilizing extreme white space, intentional asymmetry, and tonal depth. 

**The Goal:** Every interaction should feel like operating a precision instrument. We break the template look by using high-contrast typography scales—pairing the geometric authority of `spaceGrotesk` with the functional clarity of `inter`.

---

## 2. Colors & Atmospheric Depth
Our palette is a study in shadows and light. We utilize deep slates (`#10141a`) as our void, punctuated by the high-frequency energy of `primary` cyan (`#00daf3`).

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning. 
Structure must be defined through background shifts. A `surface-container-low` section sitting on a `surface` background creates a natural, sophisticated boundary that feels architectural rather than "drawn."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the tier system to define importance:
*   **Base Layer:** `surface` (#10141a) for the overall page background.
*   **Secondary Content:** `surface-container-low` (#181c22) for large content sections.
*   **Interactive Cards:** `surface-container` (#1c2026) for product cards and modular units.
*   **Prominence/Elevated:** `surface-container-highest` (#31353c) for flyouts or active modal states.

### The "Glass & Gradient" Rule
To escape the "flat" look, use Glassmorphism for floating UI elements (like sticky headers or quick-buy bars). Use `surface_bright` at 60% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs, apply a linear gradient from `primary` (#00daf3) to `primary_container` (#009fb2) at a 135-degree angle. This adds a "lithium-ion" glow that flat hex codes cannot replicate.

---

## 3. Typography: Technical Authority
We use a dual-font strategy to balance brand personality with technical readability.

*   **Display & Headline (`spaceGrotesk`):** Used for product names and high-level marketing claims. Its geometric construction mirrors computer hardware design.
    *   *Usage:* `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create an editorial "impact" look.
*   **Body & Labels (`inter`):** Used for specs, descriptions, and functional UI.
    *   *Usage:* `body-md` (0.875rem) is our workhorse. For technical specification tables, use `label-sm` (0.6875rem) in all-caps with increased letter-spacing (0.05em) to mimic blueprint annotations.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "fuzzy" for a high-tech system. We use "Ambient Lift."

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#0a0e14) card on a `surface-container-low` (#181c22) section to create a "recessed" look, perfect for technical spec modules.
*   **Ambient Shadows:** For floating elements (Modals/Dropdowns), use a shadow with a 40px blur, 0% spread, and 8% opacity. The shadow color must be based on `on_surface` (#dfe2eb) to simulate light reflecting off high-tech surfaces.
*   **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline_variant` token at **15% opacity**. This creates a "glint" on the edge rather than a hard line.

---

## 5. Components

### Buttons & Interaction
*   **Primary:** Gradient (Primary to Primary-Container), `rounded-md` (0.375rem). Text should be `on_primary` (#00363d) in `label-md` bold.
*   **Secondary:** Ghost-style. No background. `outline-variant` at 20% opacity. On hover, transition to `surface-container-high`.
*   **Micro-interaction:** On hover, buttons should have a slight "inner glow" using a 1px inset box-shadow of the `primary` color at 30% opacity.

### Product Grids & Cards
*   **Forbid Divider Lines:** Separate products using `spacing-8` (2rem) and subtle background shifts (`surface-container-low`).
*   **The "Spec-Hover" State:** On hover, the card should transition from `surface-container` to `surface-bright`. A "Quick Specs" overlay using `body-sm` should fade in, presenting data with zero-friction.

### Specification Tables
*   **Layout:** Remove all vertical and horizontal lines. 
*   **Style:** Use alternating background tones. Row A: `surface-container-low`; Row B: `surface-container-lowest`. 
*   **Typography:** Key labels in `on_surface_variant` (muted); values in `on_surface` (bright/bold).

### Status Indicators (Inventory/Tech Status)
*   **In Stock:** `primary` (#00daf3) dot with a soft outer glow.
*   **Low Stock:** `secondary` (#bdc2ff) for a "cooling" blue-violet warning.
*   **Critical/Error:** `error` (#ffb4ab) used sparingly to avoid breaking the tech-aesthetic.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a large product image partially overlapping two background containers of different tones to create depth.
*   **Embrace the Dark:** Keep the `surface-dim` and `background` tones dominant to let the `primary` accents "pop" like LEDs in a dark server room.
*   **Tighten the Gaps:** Use the `spacing-px` and `spacing-0.5` for internal component details to imply high-precision assembly.

### Don't:
*   **Don’t use 100% Black:** Pure `#000000` feels "dead." Always use our `surface` (#10141a) which has a hint of slate blue.
*   **Don’t use Default Shadows:** Standard "Drop Shadows" make the UI look like a 2010 blog template. Use Tonal Layering.
*   **Don't use Dividers:** If you feel the need to add a line, try adding `16px` of padding instead. Let the content breathe.