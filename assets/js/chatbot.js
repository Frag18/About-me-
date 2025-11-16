// Lightweight FAQ chatbot with optional voice input
(function(){
  const el={
    fab:document.getElementById('chatbot-toggle'),
    box:document.getElementById('chatbot'),
    close:document.getElementById('chatbot-close'),
    msgs:document.getElementById('chatbot-messages'),
    input:document.getElementById('chatbot-text'),
    send:document.getElementById('chatbot-send'),
    voice:document.getElementById('voice-btn'),
  };
  let profile=null; // will load profile.json
  fetch('assets/data/profile.json').then(r=>r.json()).then(d=>{profile=d;}).catch(()=>{});

  function addMessage(text,from='bot'){
    const div=document.createElement('div');
    div.className='message '+from;
    div.textContent=text;
    el.msgs.appendChild(div);
    el.msgs.scrollTop=el.msgs.scrollHeight;
  }
  function reply(text){
    addMessage(text,'bot');
    speak(text);
  }

  // voice input (Web Speech API)
  let recognizing=false; let recog=null;
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const synth=window.speechSynthesis;

  function speak(text){
    if(!synth) return;
    const utter=new SpeechSynthesisUtterance(text);
    utter.rate=1.0; utter.pitch=1.0; utter.lang='en-US';
    synth.cancel(); // stop any ongoing utterance
    try{ synth.speak(utter); }catch(e){ /* ignore */ }
  }

  if(SpeechRecognition){
    recog=new SpeechRecognition();
    recog.lang='en-US';
    recog.continuous=false;recog.interimResults=false;
    recog.onresult=(e)=>{
      const text=e.results[0][0].transcript; el.input.value=text; handleQuery(text);
    };
    recog.onend=()=>{recognizing=false; el.voice.textContent='🎙️';};
  }

  function toggleVoice(){
    if(!recog){return alert('Voice recognition is not supported in this browser.');}
    if(!recognizing){recog.start(); recognizing=true; el.voice.textContent='⏹️';}
    else{recog.stop();}
  }

  // --- Chatbot open/close and behavior ---
  function open(){
    if(!el.box) return;
    el.box.classList.add('open');
    setTimeout(()=>{ el.input?.focus(); }, 0);
  }
  function close(){
    if(!el.box) return;
    el.box.classList.remove('open');
  }
  function greet(){
    const name=profile?.name||'there';
    reply(`Hi ${name}! I can answer questions about my skills, projects, experience, education, and contact details. Try asking, "What are your key skills?" or "Tell me about your experience."`);
  }

  function handleQuery(q){
    const text=(q||'').trim();
    if(!text){return;}
    addMessage(text,'user');
    const T=text.toLowerCase();

    // Helper getters
    const skills=profile?.skills?.technical||[];
    const soft=profile?.skills?.soft||[];
    const exp=Array.isArray(profile?.experience)?profile.experience:[];
    const edu=Array.isArray(profile?.education)?profile.education:[];
    const contact=profile?.contact||{};
    const name=profile?.name||'';
    const title=profile?.title||'';
    const summary=profile?.summary||'';
    const projects=Array.isArray(profile?.projects)?profile.projects:[];

    // Greetings
    if(/^(hi|hello|hey)\b/.test(T)){
      return reply('Hello! Ask me about skills, projects, experience, education, or how to contact me.');
    }
    // Name/title/about
    if(T.includes('who are you')||T.includes('your name')||T.includes('name')){
      return reply(name && title ? `${name} — ${title}` : (name||title||'I\'m your portfolio assistant.'));
    }
    if(T.includes('about')||T.includes('summary')||T.includes('profile')){
      return reply(summary || 'I create end-to-end solutions across front-end, back-end, and data.');
    }
    // Skills
    if(T.includes('skill')||T.includes('stack')||T.includes('tech')){
      const softTxt=soft.length?` Soft skills: ${soft.slice(0,6).join(', ')}.`:'';
      return reply(skills.length?`Top skills: ${skills.slice(0,12).join(', ')}.${softTxt}`:'I\'ll update my skills soon.');
    }
    // Experience
    if(T.includes('experience')||T.includes('work')||T.includes('intern')){
      if(exp.length){
        const lines=exp.slice(0,4).map(e=>`${e.title} at ${e.company}${e.period?` (${e.period})`:''}`);
        return reply(`Here are some roles: ${lines.join('; ')}.`);
      }
      return reply('I\'ll update my experience shortly.');
    }
    // Projects
    if(T.includes('project')||T.includes('portfolio')){
      if(projects.length){
        const titles=projects.slice(0,5).map(p=>p.title).filter(Boolean);
        return reply(`Projects: ${titles.join(', ')}.`);
      }
      return reply('I\'ll add my projects soon.');
    }
    // Education
    if(T.includes('education')||T.includes('degree')||T.includes('study')){
      if(edu.length){
        const parts=edu.slice(0,3).map(e=>`${e.degree} — ${e.school}${e.period?` (${e.period})`:''}`);
        return reply(parts.join('; '));
      }
      return reply('Education details will be updated soon.');
    }
    // Contact
    if(T.includes('contact')||T.includes('email')||T.includes('linkedin')||T.includes('github')||T.includes('phone')){
      const bits=[];
      if(contact.email) bits.push(`Email: ${contact.email}`);
      if(contact.linkedin) bits.push(`LinkedIn: ${contact.linkedin}`);
      if(contact.github) bits.push(`GitHub: ${contact.github}`);
      if(contact.phone) bits.push(`Phone: ${contact.phone}`);
      return reply(bits.length?bits.join(' | '):'You can reach me via the contact section.');
    }

    // Default
    return reply('I\'m not sure yet. Try asking about my skills, projects, experience, education, or contact.');
  }

  // wire up
  if(el.fab){el.fab.addEventListener('click',()=>{open(); if(el.msgs.childElementCount===0)greet();});}
  if(el.close){el.close.addEventListener('click',close);}  
  if(el.send){el.send.addEventListener('click',()=>handleQuery(el.input.value));}
  if(el.input){el.input.addEventListener('keydown',e=>{if(e.key==='Enter'){handleQuery(el.input.value);}});}  
  if(el.voice){el.voice.addEventListener('click',toggleVoice);}  
})();