// Dicionário de apoio caso haja falha de rede ou indisponibilidade temporária
const dicionarioFallback = {
  "pt-en": {
    "olá": "hello",
    "bom dia": "good morning",
    "boa tarde": "good afternoon",
    "boa noite": "good night",
    "obrigado": "thank you"
  },
  "en-pt": {
    "hello": "olá",
    "good morning": "bom dia",
    "good afternoon": "boa tarde",
    "good night": "boa noite",
    "thank you": "obrigado"
  }
};

const selectOrigem = document.getElementById("idioma-origem");
const selectDestino = document.getElementById("idioma-destino");
const campoEntrada = document.getElementById("texto-entrada");
const botaoTraduzir = document.getElementById("btn-traduzir");
const campoSaida = document.getElementById("texto-saida");

const botaoTrocar = document.getElementById("btn-trocar");

botaoTrocar.addEventListener("click", function () {
  // 1. Trocar os idiomas selecionados usando uma variável temporária
  const idiomaTemp = selectOrigem.value;
  selectOrigem.value = selectDestino.value;
  selectDestino.value = idiomaTemp;

  // 2. Trocar os textos apenas se já houver uma tradução real na saída
  const textoSaidaAtual = campoSaida.textContent.trim();
  const mensagensSistema = [
    "A tradução vai aparecer aqui.",
    "A traduzir...",
    "Por favor, escreva uma palavra ou frase primeiro.",
    "Não foi possível obter a tradução agora.",
    "Sem ligação à Internet ou serviço temporariamente indisponível."
  ];

  if (textoSaidaAtual !== "" && !mensagensSistema.includes(textoSaidaAtual)) {
    const textoEntradaAtual = campoEntrada.value;
    campoEntrada.value = textoSaidaAtual;
    campoSaida.textContent =
      textoEntradaAtual.trim() !== ""
        ? textoEntradaAtual
        : "A tradução vai aparecer aqui.";
  }
});


botaoTraduzir.addEventListener("click", async function () {
  const origem = selectOrigem.value;
  const destino = selectDestino.value;
  const textoLimpo = campoEntrada.value.trim();

  if (textoLimpo === "") {
    campoSaida.textContent = "Por favor, escreva uma palavra ou frase primeiro.";
    return;
  }

  if (origem === destino) {
    campoSaida.textContent = textoLimpo;
    return;
  }

  campoSaida.textContent = "A traduzir...";

  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(textoLimpo) +
    "&langpair=" +
    origem +
    "|" +
    destino;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados && dados.responseData && dados.responseData.translatedText) {
      campoSaida.textContent = dados.responseData.translatedText;
    } else {
      campoSaida.textContent = "Não foi possível obter a tradução agora.";
    }
  } catch (erro) {
    const direcao = origem + "-" + destino;
    const chaveMinuscula = textoLimpo.toLowerCase();
    const traducaoLocal =
      dicionarioFallback[direcao] && dicionarioFallback[direcao][chaveMinuscula];

    if (traducaoLocal) {
      campoSaida.textContent = traducaoLocal + " (modo local sem rede)";
    } else {
      campoSaida.textContent =
        "Sem ligação à Internet ou serviço temporariamente indisponível.";
    }
  }
});
