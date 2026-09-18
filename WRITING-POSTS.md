# Writing a blog post

A post is one Markdown file. Add it, commit it, and Cloudflare rebuilds the site
in about thirty seconds. Nothing else to do.

## From github.com, no software needed

1. Go to the repo, open `src/content/posts`.
2. **Add file** then **Create new file**.
3. Name it after the URL you want, ending in `.md`. `stock-counts-that-do-not-lie.md`
   becomes `coravant.co.uk/blog/stock-counts-that-do-not-lie`.
4. Paste the template below, write the post, then **Commit changes** to `main`.

Use lower case, hyphens between words, no spaces and no dates in the filename.
Once a post is published its filename is its URL forever, so renaming it breaks
any link anyone has shared.

## The template

```markdown
---
title: Stock counts that do not lie
summary: One or two sentences. This is what shows on the blog index and in Google results, so make it earn the click.
date: 2026-09-18
tag: Operations
---

Open with the problem, in the reader's words. No preamble and no "in today's
fast-paced business environment".

## A heading every few paragraphs

People scan before they read. Headings are what they scan.

- Bullet lists are fine
- Keep them short

Close with what the reader should do next.
```

## The frontmatter

Everything between the two `---` lines. Getting one wrong fails the build with a
message naming the file, so a broken post never reaches the live site.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Sentence case. It becomes the page `<h1>` and the browser tab. |
| `summary` | yes | 100 to 160 characters reads best in search results. |
| `date` | yes | `YYYY-MM-DD`. Controls the ordering on the index. |
| `tag` | no | One word, e.g. ERP, Integration, AI, Operations. Defaults to Insight. |
| `updated` | no | `YYYY-MM-DD`. Tells Google the post was revised. |
| `author` | no | Defaults to Coravant. |
| `draft` | no | `true` keeps it out of the build entirely. Use it to work in public. |

## Writing notes

The audience is a business owner or operations manager, not a developer. If a
sentence needs someone to know what ABAP, OData or a REST API is, rewrite it.

Specifics beat adjectives every time. "Cut the month-end close from nine days to
two" does more work than "dramatically improved efficiency".

## Checking it before it goes live

```bash
npm run dev
```

Then open <http://localhost:4321/blog>. The page updates as you save.

## Images

Put the file in `public/blog/`, then reference it from the post:

```markdown
![A goods-in scanner in use](/blog/goods-in-scanner.jpg)
```

Always write the alt text in the square brackets. It is what a screen reader
announces, and what shows if the image fails to load.
