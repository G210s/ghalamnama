# Specimen Product Vision

## Vision

Specimen will become the most useful platform for discovering, evaluating, and using fonts across languages and writing systems.

The product will begin with its strongest advantage: an excellent Persian font experience. It will then expand into underserved Arabic-script languages and, over time, other global writing systems. The goal is not merely to collect the largest number of font files. It is to provide trustworthy multilingual font intelligence that helps designers, developers, publishers, and content creators choose fonts with confidence.

## Positioning

> The best multilingual font discovery and comparison platform.

Unlike a general font marketplace or download archive, Specimen will focus on:

- Verified language, script, and Unicode coverage
- High-quality previews using native sample content
- Mixed-script and right-to-left typography
- Clear licensing and source information
- Practical implementation tools for designers and developers
- Fast, indexable pages that answer specific font questions

## Target Audiences

- Designers choosing fonts for interfaces, brands, publications, and social media
- Developers implementing multilingual websites and applications
- Publishers and content creators evaluating readability and script support
- Font designers distributing and documenting their work
- Users searching for fonts that support a specific language or combination of languages

## Product Principles

1. **Language support must be verified.** Claims should be based on glyph coverage and shaping behavior, not only font descriptions.
2. **Native readers come first.** Each language needs authentic sample text, relevant categories, and review by native readers.
3. **Discovery should lead to action.** Every font page should help users preview, compare, obtain, and implement the font.
4. **Licensing must be explicit.** The product must distinguish preview rights from web, app, print, and commercial usage rights.
5. **Open sources are the foundation.** Initial growth should prioritize openly licensed fonts from trusted repositories and designer submissions.
6. **Quality matters more than catalog size.** A smaller, accurate catalog is more valuable than an unverified archive.

## Core Features

### Font Discovery

- Search and filter by language, script, style, weight, license, source, and variable-font support
- Curated categories for use cases such as UI, editorial, coding, branding, and social media
- Individual, indexable pages for every font family
- Related fonts, alternatives, and compatible multilingual pairings
- New releases, recently updated fonts, and curated collections

### Preview and Comparison

- Editable native sample text with font size, weight, line height, and spacing controls
- Side-by-side comparison of multiple font families
- Mixed RTL and LTR text previews
- Localized numerals, punctuation, diacritics, and shaping tests
- Variable-font axis playground
- Shareable preview and comparison URLs

### Persian Input Assistant

- Let visitors type Persian without installing or enabling an operating-system keyboard layout
- Provide phonetic transliteration that converts Latin input such as `salam` into `سلام`
- Provide direct Persian key mapping for users who know the Persian keyboard positions but have an English layout active
- Include an accessible on-screen Persian keyboard for mouse, touch, and assistive-technology users
- Offer clear controls to switch between English, transliteration, direct mapping, and on-screen keyboard modes
- Show candidate words when transliteration is ambiguous and support keyboard navigation for selecting them
- Preserve familiar editing behavior, including cursor movement, selection, backspace, undo, copy, and paste
- Keep conversion responsive and process input locally where possible so typed text is not transmitted unnecessarily
- Make the assistant available anywhere users enter specimen or comparison text, with an option to disable it

### Language and Coverage Intelligence

- Verified Unicode and glyph coverage reports
- Search by supported language or combination of languages
- Script-specific shaping and rendering checks
- Clear distinction between full and partial language support
- Recommendations for fallback fonts when one family cannot cover all required scripts
- Coverage questions answered directly, such as "Does this font support Kurdish?"

### Developer Tools

- Copy-ready `@font-face` and CSS snippets
- Integration examples for Tailwind CSS, Flutter, Android, iOS, and React Native
- Downloads by selected weights, styles, formats, and language subsets
- Webfont file-size and performance information
- CDN links where licensing and hosting permit them
- Public font metadata API after the data model is stable

### Licensing and Provenance

- License type and permitted uses displayed prominently
- Original source, designer, foundry, repository, and release information
- Version history and last-updated date
- Clear warnings for unknown, restricted, or unverified licenses
- Designer submission and metadata correction workflows

### Content and Community

- Practical multilingual typography guides
- Language-specific font recommendations and comparisons
- Showcases of real products using each font
- Favorites, collections, and recently viewed fonts
- Ratings for specific qualities such as readability, UI suitability, and print suitability
- Newsletter and RSS feeds for releases and editorial content

## International Expansion

Expansion should be incremental so that every supported language receives a credible experience.

1. Persian
2. Arabic-script languages, including Arabic, Urdu, Kurdish, and Pashto
3. Hebrew and other right-to-left scripts
4. Indic scripts
5. Southeast and East Asian scripts
6. Latin, Cyrillic, and Greek

Each new language launch should include:

- Native interface and metadata where appropriate
- Authentic specimen text
- Language-specific search pages and categories
- Verified font coverage
- Editorial review by native readers
- Search-engine metadata in the target language

## Search and Growth Strategy

The main organic-growth engine will be useful, indexable pages that answer high-intent questions. Examples include:

- Fonts supporting Persian and Latin
- Best Urdu fonts for websites
- Arabic variable fonts
- Fonts supporting Kurdish
- Alternatives to a specific font
- Comparisons between two popular fonts
- How to install or embed a font on a specific platform

SEO foundations should include clean URLs, server-rendered or statically generated content, structured data, canonical URLs, XML sitemaps, social preview images, and internal links between fonts, languages, categories, and guides.

## Delivery Roadmap

### Phase 1: Persian Foundation

- Create indexable font detail pages
- Improve Persian search, filtering, and previews
- Add phonetic transliteration, direct key mapping, and an on-screen Persian keyboard to preview inputs
- Add side-by-side comparison
- Add verified source and licensing fields
- Provide CSS and `@font-face` snippets
- Establish analytics, sitemap, and structured metadata

### Phase 2: Arabic-Script Platform

- Introduce script and language coverage data
- Add Arabic, Urdu, Kurdish, and Pashto specimens
- Support mixed Persian, Arabic, and Latin previews
- Publish language-specific landing pages and guides
- Add font pairing and fallback recommendations

### Phase 3: Multilingual Expansion

- Add further RTL and Indic scripts using the language launch checklist
- Introduce user collections and shareable comparison sets
- Add optimized subsets and broader platform integration snippets
- Accept verified designer submissions

### Phase 4: Global Font Intelligence

- Expand into additional writing systems based on search demand and available expertise
- Add automated coverage analysis with human quality review
- Launch the public metadata API
- Develop advanced recommendations and visual similarity tools

## Success Metrics

- Organic search impressions and non-branded clicks
- Number and percentage of fonts with verified language and license metadata
- Indexed font, language, comparison, and guide pages
- Preview-to-download or source-link conversion
- Comparison shares and developer snippet copies
- Returning visitors, favorites, and saved collections
- Backlinks from design and developer communities
- Search queries with no useful result, used to prioritize catalog expansion

## Deliberate Non-Goals

- Hosting every commercial or ambiguously licensed font
- Competing primarily on raw font count
- Automatically translating pages without native-language review
- Publishing generic, low-value articles solely to increase page count
- Building accounts or expensive AI features before core discovery demand is proven

## Near-Term Product Decision

The next product milestone should combine indexable Persian font pages, richer live previews, comparison tools, verified licensing, and developer snippets. This strengthens the existing product while creating the data model and user experience required for responsible multilingual expansion.
