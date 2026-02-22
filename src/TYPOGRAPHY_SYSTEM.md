# Premium Typography System

## Overview
This document outlines the premium, structured typography system implemented across the entire VR Robotics platform.

## Font Stack

### Headings (Primary)
- **Primary**: Space Grotesk
- **Fallback 1**: Montserrat
- **Fallback 2**: Poppins
- **System**: sans-serif

### Body Text (Primary)
- **Primary**: Inter
- **Fallback**: Lato
- **System**: sans-serif

## Font Sizes & Hierarchy

### H1 (Page Titles)
- **Size**: 48px (3rem) on mobile → 64px (4rem) on desktop
- **Line Height**: 3.6 (mobile) → 4.8 (desktop)
- **Font Weight**: 800 (Bold)
- **Letter Spacing**: -0.035em
- **Usage**: Main page headings, hero titles

### H2 (Section Headings)
- **Size**: 32px (2rem)
- **Line Height**: 2.4
- **Font Weight**: 700 (Bold)
- **Letter Spacing**: -0.03em
- **Usage**: Major section titles, subsection headers

### H3 (Subsection Headings)
- **Size**: 24px (1.5rem)
- **Line Height**: 2
- **Font Weight**: 600 (Semibold)
- **Letter Spacing**: -0.015em
- **Usage**: Card titles, feature headings

### Body Text
- **Size**: 18px (1.125rem)
- **Line Height**: 1.6
- **Font Weight**: 400 (Regular)
- **Letter Spacing**: 0em
- **Usage**: Paragraphs, descriptions, general content

### Small Text
- **Size**: 14px (0.875rem)
- **Line Height**: 1.3
- **Font Weight**: 400
- **Letter Spacing**: 0.025em
- **Usage**: Labels, captions, metadata

### Extra Small Text
- **Size**: 12px (0.75rem)
- **Line Height**: 1.2
- **Font Weight**: 400
- **Letter Spacing**: 0.05em
- **Usage**: Timestamps, badges, footnotes

## Implementation

### CSS Classes
All components use Tailwind CSS classes for typography:

```tsx
// Headings
<h1 className="font-heading text-8xl">Main Title</h1>
<h2 className="font-heading text-6xl">Section Title</h2>
<h3 className="font-heading text-3xl">Subsection</h3>

// Body Text
<p className="font-paragraph text-base">Body text content</p>
<span className="font-paragraph text-sm">Small text</span>
```

### Tailwind Configuration
The typography system is configured in `tailwind.config.mjs`:

```javascript
fontFamily: {
  heading: "Space Grotesk, Montserrat, Poppins, sans-serif",
  paragraph: "Inter, Lato, sans-serif"
}
```

### Global Styles
Base typography rules are defined in `src/styles/global.css`:

- H1-H6 elements automatically use heading font stack
- Body, p, span elements automatically use body font stack
- Proper line heights and letter spacing applied globally
- Responsive sizing for H1 elements

## Premium Design Features

### Letter Spacing
- Headings use negative letter spacing (-0.015em to -0.035em) for premium, tight appearance
- Body text uses normal letter spacing (0em) for readability
- Small text uses increased letter spacing (0.025em-0.05em) for clarity

### Line Height
- Headings: Tight line heights (1-2.4) for visual impact
- Body text: Generous line heights (1.6) for readability
- Small text: Compact line heights (1.2-1.3) for space efficiency

### Font Weights
- H1: 800 (Extra Bold) - Maximum impact
- H2: 700 (Bold) - Strong hierarchy
- H3: 600 (Semibold) - Clear distinction
- Body: 400 (Regular) - Optimal readability

## Responsive Behavior

### Mobile (< 768px)
- H1: 48px (3rem)
- H2: 32px (2rem)
- H3: 24px (1.5rem)
- Body: 18px (1.125rem)

### Desktop (≥ 768px)
- H1: 64px (4rem) - Scales up for larger screens
- H2: 32px (2rem) - Maintains size
- H3: 24px (1.5rem) - Maintains size
- Body: 18px (1.125rem) - Maintains size

## Color Integration

Typography colors are applied through Tailwind color utilities:

```tsx
// Primary text
<h1 className="text-primary">Title</h1>

// Secondary text
<p className="text-secondary">Subtitle</p>

// Foreground (default)
<p className="text-foreground">Body text</p>

// Muted text
<span className="text-foreground/70">Muted text</span>
```

## Best Practices

### Do's ✅
- Use `font-heading` for all headings (h1-h6)
- Use `font-paragraph` for all body text
- Maintain consistent font sizes across similar elements
- Use proper heading hierarchy (H1 → H2 → H3)
- Apply letter spacing for premium appearance
- Use generous line heights for readability

### Don'ts ❌
- Don't mix font families within a section
- Don't use body font for headings
- Don't use heading font for body text
- Don't override line heights without reason
- Don't use inconsistent font weights
- Don't apply text shadows (violates premium design)

## Migration Guide

If updating existing components:

1. Replace `font-heading` class references (already using new stack)
2. Replace `font-paragraph` class references (already using new stack)
3. Update any hardcoded font-family declarations
4. Test responsive sizing on mobile and desktop
5. Verify color contrast with new fonts

## Testing Checklist

- [ ] H1 displays at 48px on mobile, 64px on desktop
- [ ] H2 displays at 32px consistently
- [ ] H3 displays at 24px consistently
- [ ] Body text displays at 18px
- [ ] All fonts load correctly (check network tab)
- [ ] Letter spacing appears tight on headings
- [ ] Line heights are appropriate for readability
- [ ] Color contrast meets WCAG AA standards
- [ ] Fonts render consistently across browsers
- [ ] Responsive behavior works on all breakpoints

## Font Loading Performance

All fonts are loaded from Google Fonts via Wix's font cache:
- Minimal performance impact
- Automatic fallback to system fonts
- Optimized WOFF2 format
- Proper unicode-range declarations

## Support

For typography questions or issues:
1. Check this documentation
2. Review `tailwind.config.mjs` for size definitions
3. Check `src/styles/global.css` for base styles
4. Verify component uses `font-heading` or `font-paragraph` classes
