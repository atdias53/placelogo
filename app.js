
// Inicializar o canvas com Fabric.js
const canvas = new fabric.Canvas('tshirt-canvas', {
  width: 1200,
  height: 1200,
  backgroundColor: '#fff'
});

// Verifica plano
let isLifetimeUser = localStorage.getItem('lifetime') === 'true';
let mockupCount = parseInt(localStorage.getItem('mockupCount') || '0');

// Atualiza estado visual
const planStatus = document.getElementById('plan-status');
function updateStatus() {
  if (isLifetimeUser) {
    planStatus.innerText = "âœ” Lifetime User â€“ mockups ilimitados";
    planStatus.style.background = "#d1e7dd";
    planStatus.style.color = "#0f5132";
  } else {
    planStatus.innerText = `ðŸ”’ Free User â€“ ${5 - mockupCount} mockups restantes`;
  }
}
updateStatus();

// Upload de logo
document.getElementById('logo-upload').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      img.set({
        left: 300,
        top: 300,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: true,
        hasRotatingPoint: true,
        cornerStyle: 'circle',
        transparentCorners: false,
      });
      canvas.add(img).setActiveObject(img);
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Escolher mockup de t-shirt
document.querySelectorAll('.mockup-thumb').forEach((el) => {
  el.addEventListener('click', function () {
    const src = el.getAttribute('data-src');
    fabric.Image.fromURL(src, function (img) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
      });
    });
  });
});

// BotÃ£o de download
document.getElementById('download-btn').addEventListener('click', function () {
  if (!isLifetimeUser && mockupCount >= 5) {
    alert("Limite gratuito atingido. Atualize para plano Lifetime.");
    return;
  }

  if (!isLifetimeUser) {
    const watermark = new fabric.Text("PlaceLogo", {
      left: 950,
      top: 1150,
      fontSize: 22,
      fill: "rgba(0,0,0,0.3)",
      selectable: false
    });
    canvas.add(watermark);
    canvas.renderAll();
  }

  const link = document.createElement('a');
  link.href = canvas.toDataURL({
    format: 'png',
    multiplier: 1
  });
  link.download = 'mockup.png';
  link.click();

  if (!isLifetimeUser) {
    mockupCount++;
    localStorage.setItem('mockupCount', mockupCount);
    updateStatus();
  }
});
