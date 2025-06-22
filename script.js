// Seleção de elementos
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector(".chatbot");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot header span");

// Variáveis de controle
let userMessage = "";
let mensagemPensando = null;

// Chave da API, obs: se o chat nao responder, tente gerar uma nova chave
const API_KEY = "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";

// Criar mensagem
const criarMensagem = (mensagem, className) => {
  const li = document.createElement("li");
  li.classList.add("chat", className);

  const logoImg = className === "incoming"
    ? '<div class="bot-img"><img src="img/icone-onwave.png" alt="On Wave"></div>'
    : "";

  li.innerHTML = `${logoImg}<p>${mensagem}</p>`;
  return li;
};

// Gerar resposta da API
const generateResponse = () => {
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistralai/devstral-small:free",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (mensagemPensando) {
        mensagemPensando.remove();
        mensagemPensando = null;
      }

      const botResponse = data.choices?.[0]?.message?.content || "Desculpe, não consegui entender.";
      chatbox.appendChild(criarMensagem(botResponse, "incoming"));
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch((erro) => {
      if (mensagemPensando) {
        mensagemPensando.remove();
        mensagemPensando = null;
      }
      chatbox.appendChild(criarMensagem("Erro ao responder: " + erro.message, "incoming"));
      chatbox.scrollTop = chatbox.scrollHeight;
    });
};

// Lidar com envio da mensagem
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(criarMensagem(userMessage, "outgoing"));
  chatInput.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  mensagemPensando = criarMensagem("Pensando...", "incoming");
  chatbox.appendChild(mensagemPensando);
  chatbox.scrollTop = chatbox.scrollHeight;

  setTimeout(generateResponse, 600);
};

// Eventos
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

chatbotCloseBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});

sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

