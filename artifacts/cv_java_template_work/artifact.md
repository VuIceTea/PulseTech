# Template execution contract

## Reference

- Source: `D:\CV_Android_NguyenPhiVu.docx`
- SHA-256: `B7E093672BC27F12ABD94CD8C093CEED03FC5465F404ED419590F03DCD3F0F6B`
- Pages: 2
- Sections: 7
- Reference render: `D:\frontend\artifacts\cv_java_template_work\reference_render`
- Style evidence: `D:\frontend\artifacts\cv_java_template_work\template-style-evidence.json`

## Page system

- A4 portrait, 8.27 x 11.70 inches.
- Margins: left 0.50 in, right 0.45 in, top 1.00 in, bottom 1.00 in.
- Seven sections: one-column sections 1, 3, 5, and 7; two-column sections 2, 4, and 6.
- Section 1 starts on a new page; later sections use continuous breaks.
- No meaningful header or footer content. No different first-page or odd/even-page behavior.

## Typography and visual rules

- Plain black professional layout on white background.
- Name: centered, bold, 16 pt.
- Target role: centered, bold, 13 pt.
- Main section headings: uppercase, bold, 13 to 14 pt with a gray bottom border.
- Project title: bold, 12 pt.
- Body copy: source Normal style, approximately 11 pt, left aligned.
- Bullets: source List Paragraph style with hollow circle numbering inherited from numbering.xml.
- Hyperlinks: Word hyperlink blue with underline.
- No images, tables, text boxes, fields, comments, footnotes, or content controls.

## Content flow and slot map

1. Paragraph 0: candidate name, preserve.
2. Paragraph 1: target role, rewrite to Fresher Java Developer.
3. Paragraphs 2 to 3: career objective heading and summary; preserve heading, rewrite summary.
4. Paragraphs 4 to 5: education heading and school/degree/dates; preserve facts and structure.
5. Paragraphs 6 to 26: skills split across alternating one-column and two-column sections; rewrite each skill slot, preserve section breaks and bullet styling.
6. Paragraphs 27 to 35: personal project heading, project title, repository/demo links, and bullets; rewrite all project content for PulseTech. Additional project bullets may be cloned from existing List Paragraph elements before the Contact section.
7. Paragraphs 36 to 37: contact heading and contact details; preserve verified email, phone, GitHub, and LinkedIn while correcting GitHub spelling.

## Package preservation

- Preserve: theme, styles, numbering, font table, settings, web settings, section geometry, and existing hyperlink relationship mechanism.
- Editable: `word/document.xml` text, paragraph/run content in mapped slots, and hyperlink relationships required for updated repository URLs.
- No drawing, media, header, footer, field, comment, footnote, or content-control parts exist.

## Fidelity gates

- Retained reference must remain byte-for-byte unchanged at its recorded path and hash.
- Final document must remain A4 portrait and recognizably use the source heading, rule, column, bullet, and hyperlink system.
- Final pagination may remain two pages, but page 2 must be used intentionally rather than leaving a large empty area caused by undersized content.
- Inspect both pages at 100 percent for unexpected wrapping, orphaned headings, clipped bullets, broken columns, or a Contact section separated from its details.
