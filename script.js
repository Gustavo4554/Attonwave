const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector(".chatbot");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot header span");

let userMessage = "";
let mensagemPensando = null;

const API_KEY = "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"; 

const criarMensagem = (mensagem, className) => {
    const li = document.createElement("li");
    li.classList.add("chat", className);

    const logoImg = className === "incoming" 
        ? '<div class="bot-img"><img src="/img/icone-onwave.png" alt="On Wave"></div>' 
        : "";

    li.innerHTML = `${logoImg}<p>${mensagem}</p>`;
    return li;
};

// Aqu tem a funçao para chamar a api, obs: essa api não é tao atualizada (é de 2022)
const generateResponse = () => {
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "mistralai/devstral-small:free",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(`Erro na API: ${res.status} - ${text}`);
                });
            }
            return res.json();
        })
        .then(data => {
            if (mensagemPensando) {
                mensagemPensando.remove();
                mensagemPensando = null;
            }

            
            const botResponse = data.choices?.[0]?.message?.content || "Desculpe, não consegui entender.";
            chatbox.appendChild(criarMensagem(botResponse, "incoming"));
            chatbox.scrollTop = chatbox.scrollHeight;
        })
        .catch(erro => {
            console.error("Erro ao chamar API:", erro);
            if (mensagemPensando) {
                mensagemPensando.remove();
                mensagemPensando = null;
            }
            chatbox.appendChild(criarMensagem("Erro ao obter resposta: " + erro.message, "incoming"));
            chatbox.scrollTop = chatbox.scrollHeight;
        });
};

// Função para lidar com envio da mensagem
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

chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});

chatbotCloseBtn.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
});

sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});
