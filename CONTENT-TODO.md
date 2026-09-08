# Before launch

Things the site currently guesses or leaves blank. Each one is a real decision,
not a code task.

## 1. The association's legal name  (blocks everything)

Three different names appear in the records:

- **All Orissa Private Secondary Schools Management Association** — printed on the
  schoolwise abstract table headers
- **All Orissa Private Secondary Training Schools Management Association** — printed
  on the abstract cover page
- **All Orissa Pvt Sec Training School Management Association** — the handwritten note

The site currently uses the second. Whatever appears on the **registration
certificate** is the one that must be used, because this name goes on every page,
the page titles, and eventually on letterheads. Fix this first.

Where to change it: page `<title>` tags, the footer paragraph, and
`about.html`.

## 2. The fourth zone

The handwritten zone list jumps from 3 to 5. The site shows a placeholder node
labelled "Fourth zone" positioned near Rourkela on the map. Needs its real name,
and its map coordinates updated in `assets/js/odisha-map.js` (the `ZONES` array).

## 3. Missing school, Balasore zone

The Balasore abstract skips serial number 24 — it runs 23 (Radhakishore STS)
straight to 25 (Jagabandhu STS). One school is unaccounted for.

## 4. Bhubaneswar and Berhampur school lists

Not yet received. The zones exist on the site and show "List being compiled".

## 5. Zone naming

The records say "Central Zone"; you said this is Cuttack. The site shows
"Cuttack Zone" with a note. Confirm which name members actually use.

## 6. Unresolved figures from the handwritten notes

- `100 CT School = 45,000` — total collection, or per school?
- Baripada: 1990=200, 1991=300, 1992=400, 1993=500 — student intake or fees?
- Baripada: Rs 2,50,000 — what is this for?

None of these are on the site yet, because it isn't clear what they mean.

## 7. Association office address

`contact.html` shows "Address to be added".

## 8. Contact form endpoint

`contact.html` has `YOUR_FORM_ID` as a placeholder. Sign up at formspree.io
(free tier is enough) and paste the real ID.

## 9. Scanned court orders

`assets/docs/` is empty. Until PDFs are added, the legal records page shows
"Copy on request" instead of a download link. This is intentional and safe.

## 10. Logo

The header currently uses a typographic seal reading "1980". If the association
has an official emblem, drop it into `assets/img/` and swap it into the
`.brand__seal` element.

---

## Deliberately left off the site

The scanned pages you shared are a **Collection & Expenditure Statement** —
AG fees, High Court fees, B. Nayak payments, newspaper costs, per-school amounts
collected and refunded.

Only the school names, zones and districts were used. The financial columns are
internal association accounts and are not on the public site. Publishing what each
member school paid or owes would be a problem: it exposes individual schools'
financial position and invites disputes.

If members need to see these figures, put them behind a login later, or circulate
them the way you do now.
