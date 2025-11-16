// Main interactions and enhancements
(function(){
  // Current year
  const yearEl=document.getElementById('year');
  if(yearEl){yearEl.textContent=new Date().getFullYear();}

  // Smooth scroll for nav
  document.querySelectorAll('.nav-links a, .cta a').forEach(a=>{
    a.addEventListener('click',e=>{
      if(a.hash){e.preventDefault();document.querySelector(a.hash)?.scrollIntoView({behavior:'smooth'});}
    });
  });

  // Intersection animations
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');}});
  },{threshold:.15});
  document.querySelectorAll('.section, .card').forEach(el=>{el.classList.add('fade-in');io.observe(el)});

  // Contact form helper
  const form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      const action=form.getAttribute('action')||'';
      if(action.includes('{your_form_id}')){
        alert('Please replace {your_form_id} in the form action with your Formspree ID to enable submissions.');
      }
    });
  }

  // Load profile data to populate sections (optional)
  fetch('assets/data/profile.json').then(r=>r.json()).then(data=>{
    // About
    const about=document.getElementById('about-summary');
    if(about&&data.summary){about.textContent=data.summary;}
    // Skills
    const techUl=document.getElementById('skills-technical');
    const softUl=document.getElementById('skills-soft');
    if(techUl&&Array.isArray(data.skills?.technical)){
      techUl.innerHTML=data.skills.technical.map(s=>`<li>${s}</li>`).join('');
    }
    if(softUl&&Array.isArray(data.skills?.soft)){
      softUl.innerHTML=data.skills.soft.map(s=>`<li>${s}</li>`).join('');
    }
    // Experience
    const expWrap=document.getElementById('experience-timeline');
    if(expWrap&&Array.isArray(data.experience)){
      expWrap.innerHTML=data.experience.map(item=>`
        <article class="card">
          <div class="card-header">
            <h3>${item.title} — ${item.company}</h3>
            <span>${item.period}</span>
          </div>
          <p>${item.summary}</p>
        </article>`).join('');
    }
    // Projects
    const projGrid=document.getElementById('projects-grid');
    if(projGrid&&Array.isArray(data.projects)){
      projGrid.innerHTML=data.projects.map(p=>`
        <article class="card project">
          <img src="${p.image||'assets/img/project-placeholder.svg'}" alt="Project preview" />
          <div class="card-body">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="tags">${(p.technologies||[]).map(t=>`<span>${t}</span>`).join('')}</div>
            <div class="actions">
              ${p.live?`<a class="btn ghost" href="${p.live}" target="_blank">Live</a>`:''}
              ${p.code?`<a class="btn ghost" href="${p.code}" target="_blank">Code</a>`:''}
            </div>
          </div>
        </article>`).join('');
    }
    // Education
    const edu=document.getElementById('education-list');
    if(edu&&Array.isArray(data.education)){
      edu.innerHTML=data.education.map(e=>`<li><strong>${e.degree}</strong> — ${e.school} (${e.period})</li>`).join('');
    }
    // Contact
    const contactList=document.querySelector('.contact-list');
    if(contactList&&data.contact){
      const {email,linkedin,github}=data.contact;
      contactList.innerHTML=`
        <li>Email: <a href="mailto:${email}">${email}</a></li>
        <li>LinkedIn: <a href="${linkedin}" target="_blank" rel="noopener">${linkedin.replace('https://','')}</a></li>
        <li>GitHub: <a href="${github}" target="_blank" rel="noopener">${github.replace('https://','')}</a></li>`;
    }
    // Brand, Hero, Footer
    const brand=document.querySelector('.brand');
    if(brand&&data.name){brand.textContent=data.name;}
    const headline=document.querySelector('.headline');
    if(headline&&data.title){headline.textContent=data.title;}
    const tagline=document.querySelector('.tagline');
    if(tagline&&data.summary){
      const short=data.summary.length>180?data.summary.slice(0,177)+'...':data.summary;
      tagline.textContent=short;
    }
    const yearEl=document.getElementById('year');
    if(yearEl){
      const parent=yearEl.parentElement;
      if(parent&&data.name){parent.innerHTML=`&copy; ${new Date().getFullYear()} ${data.name}. All rights reserved.`;}
    }
  }).catch(()=>{/* ignore */});
})();