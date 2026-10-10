<<<<<<< HEAD
# Nightbloom Ink – tattoo studio website

Static site: HTML, CSS and JavaScript. No build step.

## Run it
Open the folder in VS Code and use the Live Server extension, or just open `index.html`.

## Push to GitHub
```
git init
git add .
git commit -m "Initial tattoo site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Set up (3 things)

1. **Receive booking emails** – create a free form at https://formspree.io, copy its ID, and replace
   `YOUR_FORM_ID` in the `action` attribute of the form in `index.html`.
   Every booking arrives in your inbox; replying goes straight to the client.
2. **Cash App** – open `js/config.js` and set `cashTag` and `depositAmount`.
3. **Dates and times** – in `js/config.js` set closed weekdays, blocked dates, time slots,
   and slots already taken (`bookedSlots`).

Also replace in `index.html`: studio name, address, email, phone, Instagram and Facebook links.

## Notes
- Cash App has no public checkout for personal sites, so the button opens a prefilled payment link
  (`cash.app/$tag/amount`). The client pays, ticks the box, and you match the payment in your Cash App
  before confirming by email.
- The 18+ check (entry gate + date of birth + checkbox) runs in the browser. Always check ID in person.
- Images live in `assets/images/`. Swap in your own work and keep the file names, or update `index.html`.
=======
# nightbloom.github.io
>>>>>>> 3d292c48a99599db5e2c398bcc2c051f35a90a8c
