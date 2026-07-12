// ============================================================
  // CONFIG — edite aqui quando a data e o local estiverem certos
  // ============================================================
  const WHATSAPP_NUMBER = "5511943672342"; // número que vai receber as confirmações

  function sendRSVP(){
    const name = document.getElementById('rsvp-name').value.trim();
    const guests = document.getElementById('rsvp-guests').value;
    const msg = document.getElementById('rsvp-msg').value.trim();
    const feedback = document.getElementById('rsvp-feedback');

    if(!name){
      feedback.textContent = "Preencha ao menos o seu nome para confirmar 🙂";
      feedback.classList.add('show');
      return;
    }

    let text = `Oi! Aqui é ${name} 🎉\nConfirmando presença no chá de casa nova de vocês!\nVamos ${guests} pessoa(s).`;
    if(msg){ text += `\n\nRecado: ${msg}`; }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    feedback.textContent = "Perfeito! Abrimos o WhatsApp com sua mensagem pronta — é só enviar. 💛";
    feedback.classList.add('show');
  }

  // reveal on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));