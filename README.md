# aopstsma.in

Website for the **All Orissa Private Secondary Training Schools Management Association**.

Plain HTML, CSS and JavaScript. No build step, no npm install, no framework.
Open `index.html` in a browser and it works.

---

## Running it locally

Double-clicking `index.html` mostly works, but the school directory reads a query
string, so serve it over HTTP instead:

```bash
cd aopstsma-website
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

If you have Node instead of Python:

```bash
npx serve .
```

---

## Opening in Antigravity

1. Open Antigravity.
2. **File → Open Folder** and pick the `aopstsma-website` folder.
3. Use the built-in terminal to run the `python3 -m http.server 8000` command above.
4. Ask the agent for changes in plain language, for example
   *"add a photo of the president to about.html"*.

Nothing needs to be installed first. There is no `package.json` on purpose &mdash;
that keeps this site editable by anyone, years from now, without a toolchain.

---

## Putting it on GitHub and going live

```bash
cd aopstsma-website
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aopstsma-website.git
git push -u origin main
```

Then pick one host:

**Netlify** (easiest, free, handles the domain well)
1. netlify.com → Add new site → Import from GitHub → pick the repo.
2. Build command: leave blank. Publish directory: `.`
3. Domain settings → Add custom domain → `aopstsma.in`.
4. At your domain registrar, point the nameservers to the ones Netlify shows,
   or add the A / CNAME records it gives you.

**GitHub Pages** (also free)
Repo → Settings → Pages → Source: `main`, folder `/ (root)`.
Add a file named `CNAME` containing `aopstsma.in`, then point an A record at
GitHub's IPs.

HTTPS is issued automatically by both once the DNS resolves.

---

## Where everything lives

```
index.html            Home, with the 3D Odisha map
about.html            History and office bearers
zones.html            The six zones
schools.html          Searchable member directory
achievements.html     Court orders and departmental letters
services.html         Renewal, DIR deposit, legal assistance
contact.html          Phone, email, enquiry form

assets/css/main.css       All styling, tokens at the top
assets/js/site.js         Nav, filters, reveals
assets/js/odisha-map.js   The hero map
assets/data/schools.js    School list, zones, document list
assets/docs/              Put scanned PDFs here
assets/img/               Photos and logo
```

---

## Everyday edits

**Add a school** &mdash; open `assets/data/schools.js`, add a line to `SCHOOLS`:

```js
{ name: 'Example STS', zone: 'cuttack', district: 'Jajpur' },
```

Valid `zone` values: `balasore`, `cuttack`, `bhubaneswar`, `zone-four`,
`sambalpur`, `berhampur`.

**Publish a court order** &mdash; drop the PDF into `assets/docs/`, then set its
filename in the matching `DOCUMENTS` entry:

```js
{ ref: '10372', year: '2008', title: '...', note: '...', file: 'wp-10372-2008.pdf' },
```

The row turns into a working download on its own.

**Change a colour** &mdash; the palette is defined once at the top of
`assets/css/main.css` under `:root`. Change it there and it updates everywhere.

**Make the contact form work** &mdash; sign up at formspree.io, create a form,
and replace `YOUR_FORM_ID` in `contact.html` with the ID they give you. Until then
the form looks right but does not send.

---

## About the hero map

The home page draws Odisha as a field of points using Three.js, loaded from a CDN.
Hovering a zone name lights up that region.

It degrades sensibly: fewer points on phones, no assembly animation when the
visitor has "reduce motion" turned on, and if WebGL is unavailable the page still
reads correctly &mdash; the headline and buttons sit above the canvas, not inside it.

---

## Still to confirm

See `CONTENT-TODO.md`. The site is live-ready but several details are placeholders
and should be settled before launch.
