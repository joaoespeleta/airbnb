import { lerParametro } from "./endereco.js";

const destinos = [
  { cidade: "Ubatuba", estado: "São Paulo", sigla: "SP", descricao: "Casas e apartamentos para quem quer passar uns dias na praia." },
  { cidade: "Campos do Jordão", estado: "São Paulo", sigla: "SP", descricao: "Uma opção na serra para uma viagem de fim de semana." },
  { cidade: "São Paulo", estado: "São Paulo", sigla: "SP", descricao: "Apartamentos para ficar perto dos passeios da capital." },
  { cidade: "Rio de Janeiro", estado: "Rio de Janeiro", sigla: "RJ", descricao: "Opções para conhecer a cidade e aproveitar a praia." },
  { cidade: "Florianópolis", estado: "Santa Catarina", sigla: "SC", descricao: "Casas e apartamentos para uma temporada na ilha." },
  { cidade: "Gramado", estado: "Rio Grande do Sul", sigla: "RS", descricao: "Um destino para passear pela serra gaúcha." }
];

// Troca os acentos mais comuns para facilitar a busca por cidades.
function tirarAcentos(texto) {
  let acentos = "áàâãäéèêëíìîïóòôõöúùûüç";
  let letras =  "aaaaaeeeeiiiiooooouuuuc";
  let resultado = "";
  texto = texto.toLowerCase().trim();

  for (let letra of texto) {
    let posicao = acentos.indexOf(letra);
    if (posicao >= 0) {
      resultado = resultado + letras[posicao];
    } else {
      resultado = resultado + letra;
    }
  }
  return resultado;
}

let busca = lerParametro("destino").trim().slice(0, 70);
document.querySelector("#destino-busca").value = busca;
let palavras = tirarAcentos(busca).replaceAll(",", " ").split(" ");
let encontrados = [];

for (let destino of destinos) {
  let nome = tirarAcentos(destino.cidade + " " + destino.estado + " " + destino.sigla);
  let encontrou = true;
  for (let palavra of palavras) {
    if (!nome.includes(palavra)) {
      encontrou = false;
      break;
    }
  }
  if (encontrou) {
    encontrados.push(destino);
  }
}

if (busca === "") {
  document.querySelector("#resultado-busca").textContent = "Todos os destinos";
} else {
  document.querySelector("#resultado-busca").textContent = encontrados.length + ' destino(s) para "' + busca + '"';
}
document.querySelector("#destino-nao-encontrado").hidden = encontrados.length > 0;

for (let destino of encontrados) {
  let cartao = document.createElement("article");
  cartao.className = "cartao-reserva";
  let titulo = document.createElement("h2");
  titulo.textContent = destino.cidade + ", " + destino.sigla;
  let descricao = document.createElement("p");
  descricao.textContent = destino.descricao;
  let link = document.createElement("a");
  link.className = "botao botao-verde";
  link.textContent = "Reservar neste destino";
  link.href = "reserva.html?destino=" + encodeURIComponent(titulo.textContent);
  cartao.append(titulo, descricao, link);
  document.querySelector("#lista-destinos").appendChild(cartao);
}
