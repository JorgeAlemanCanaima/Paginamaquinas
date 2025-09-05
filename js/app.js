// app.js
const generateBtn = document.getElementById("generate-config");
const aiThinking = document.getElementById("ai-thinking");
const aiResults = document.getElementById("ai-results");
const welcomeMessage = document.getElementById("welcome-message");
const componentsList = document.getElementById("components-list");
const totalPrice = document.getElementById("total-price");
const recommendationsList = document.getElementById("recommendations-list");

generateBtn.addEventListener("click", async () => {
  const budget = document.getElementById("budget").value;
  const usage = document.getElementById("usage").value;
  const brand = document.getElementById("brand").value;

  const features = [];
  if(document.getElementById("rgb").checked) features.push("RGB y Estética");
  if(document.getElementById("silent").checked) features.push("PC Silenciosa");
  if(document.getElementById("compact").checked) features.push("Formato Compacto");
  if(document.getElementById("upgradeable").checked) features.push("Fácil Actualización");

  if(!budget || !usage){
    alert("Por favor, selecciona presupuesto y uso principal.");
    return;
  }

  welcomeMessage.style.display = "none";
  aiResults.style.display = "none";
  aiThinking.style.display = "block";

  try {
    const response = await fetch("/api/generate-pc-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget, usage, brand, features })
    });

    const data = await response.json();

    aiThinking.style.display = "none";

    if(data.success){
      const config = data.data;

      componentsList.innerHTML = "";
      for(const [key, value] of Object.entries(config.components)){
        const item = document.createElement("div");
        item.className = "component-item";
        item.innerHTML = `<strong>${key.toUpperCase()}:</strong> ${value.name} - $${value.price}`;
        componentsList.appendChild(item);
      }

      totalPrice.textContent = `$${config.totalPrice}`;

      recommendationsList.innerHTML = "";
      config.recommendations.forEach(rec => {
        const li = document.createElement("li");
        li.textContent = rec;
        recommendationsList.appendChild(li);
      });

      aiResults.style.display = "block";
    } else {
      alert("Error al generar configuración: " + data.error);
      welcomeMessage.style.display = "block";
    }

  } catch(err){
    console.error(err);
    alert("Ocurrió un error, revisa la consola.");
    aiThinking.style.display = "none";
    welcomeMessage.style.display = "block";
  }
});
