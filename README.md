# Professional Portfolio (Static Site)

A modern, responsive portfolio website built with HTML, CSS, and JavaScript (no frameworks). Includes sections for Home, About, Experience, Projects, Education, Contact, and a floating FAQ chatbot with optional voice input.

## Features
- Clean, modern UI with smooth animations
- Fully responsive (mobile, tablet, desktop)
- Fast-loading, static assets
- Chatbot answers FAQs about your profile, skills, projects, and more
- Optional voice input via Web Speech API (Chrome-compatible)
- Contact form using Formspree (no backend needed)
- Easy deployment on GitHub Pages

## Getting Started
1. Edit `assets/data/profile.json` with your real information (name, summary, skills, experience, projects, education, contact).
2. Replace placeholders in `index.html` if desired (headline, tagline).
3. Ensure your resume is at `resume/Resume.pdf` (already present), or update the link in the About section.
4. Configure the contact form:
   - Create a Formspree form and get your form ID: https://formspree.io/
   - In `index.html`, replace `https://formspree.io/f/{your_form_id}` with your actual ID.

## Local Preview
If you have Python installed, run a local server:
```bash
python -m http.server 5500
```
Then open: http://localhost:5500/

## Deploy to GitHub Pages
1. Create a new repository on GitHub (e.g., `your-portfolio`).
2. Add and commit all files:
```bash
git init
git add .
git commit -m "Initial portfolio"
```
3. Add the remote and push:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-portfolio>.git
git push -u origin main
```
4. Enable GitHub Pages:
   - Go to your repo Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` and folder `/ (root)`
   - Save, then wait a minute. Your site will be available at `https://<your-username>.github.io/<your-portfolio>/`.

## Customize Design
- Update colors, spacing, and typography in `assets/css/styles.css`.
- Replace SVG placeholders in `assets/img/` with your own assets if desired.

## Notes
- All images are SVG for performance and scalability.
- The chatbot uses a simple rule-based system and reads from `profile.json`. Extend rules in `assets/js/chatbot.js` as needed.
- No secrets are stored; avoid committing any private keys.