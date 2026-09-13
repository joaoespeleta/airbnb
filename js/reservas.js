import { pegarReservas, salvarReservas } from "./dados.js";
import { calcularNoites } from "./validacao.js";
import { dataNormal, dinheiro, textoSeguro } from "./util.js";

let reservas = pegarReservas();
const lista = document.querySelector("#lista-reservas");

console.log("Reservas na listagem:", reservas.length);
mostrarReservas();

lista.addEventListener("click", function(evento) {
  let botao = evento.target.closest("button");
  if (botao === null) return;

  let id = Number(botao.dataset.id);

  if (botao.dataset.acao === "editar") {
    localStorage.setItem("editar_reserva_hospeda", id);
    window.location.href = "reserva.html";
  } else if (botao.dataset.acao === "excluir") {
    excluirReserva(id);
  }
});

document.querySelector("#limpar").addEventListener("click", function() {
  if (reservas.length === 0) {
    alert("Não existem reservas para apagar.");
  } else if (confirm("Deseja apagar todas as reservas?")) {
    reservas = [];
    salvarReservas(reservas);
    mostrarReservas();
  }
});

document.querySelector("#baixar").addEventListener("click", baixarArquivo);

function mostrarReservas() {
  lista.innerHTML = "";
  let encontradas = 0;

  for (let reserva of reservas) {
    let status = pegarStatus(reserva);
    lista.appendChild(criarCartao(reserva, status));
    encontradas++;
  }

  if (encontradas === 0) {
    document.querySelector("#sem-reservas").style.display = "block";
  } else {
    document.querySelector("#sem-reservas").style.display = "none";
  }

  atualizarResumo();
}

function criarCartao(reserva, status) {
  let noites = calcularNoites(reserva.checkin, reserva.checkout);
  let cartao = document.createElement("article");
  cartao.className = "cartao-reserva";
  let nomeStatus = status === "proximas" ? "Próxima" : "Finalizada";

  cartao.innerHTML = `
    <span class="status ${status === "finalizadas" ? "finalizada" : ""}">${nomeStatus}</span>
    <h2>${textoSeguro(reserva.destino)}</h2>
    <p class="subtitulo">${reserva.acomodacao} · ${textoSeguro(reserva.nome)}</p>
    <div class="dados-cartao">
      <div><span>Entrada</span><b>${dataNormal(reserva.checkin)}</b></div>
      <div><span>Saída</span><b>${dataNormal(reserva.checkout)}</b></div>
      <div><span>Duração</span><b>${noites} noites</b></div>
      <div><span>Hóspedes</span><b>${reserva.hospedes}</b></div>
    </div>
    <div class="rodape-cartao">
      <strong>${dinheiro(noites * reserva.diaria)}</strong>
      <div><button data-acao="editar" data-id="${reserva.id}">Editar</button> <button data-acao="excluir" data-id="${reserva.id}">Excluir</button></div>
    </div>`;

  return cartao;
}

function pegarStatus(reserva) {
  let hoje = new Date();
  let dataSaida = new Date(reserva.checkout + "T23:59:00");
  if (dataSaida < hoje) return "finalizadas";
  return "proximas";
}

function atualizarResumo() {
  let noites = 0;
  let valor = 0;

  for (let reserva of reservas) {
    let quantidade = calcularNoites(reserva.checkin, reserva.checkout);
    noites = noites + quantidade;
    valor = valor + quantidade * reserva.diaria;
  }

  document.querySelector("#qtd-reservas").textContent = reservas.length;
  document.querySelector("#total-noites").textContent = noites;
  document.querySelector("#valor-total").textContent = dinheiro(valor);
  console.log("Resumo das reservas:", reservas.length, "reservas,", noites, "noites,", dinheiro(valor));
}

function excluirReserva(id) {
  if (confirm("Tem certeza que deseja excluir esta reserva?")) {
    for (let i = 0; i < reservas.length; i++) {
      if (reservas[i].id === id) {
        console.log("Reserva excluída:", reservas[i]);
        reservas.splice(i, 1);
      }
    }
    salvarReservas(reservas);
    console.log("Total de reservas após exclusão:", reservas.length);
    mostrarReservas();
  }
}

function baixarArquivo() {
  let conteudo = JSON.stringify(reservas, null, 2);
  let arquivo = new Blob([conteudo], { type: "application/json" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "reservas-hospeda.json";
  link.click();
  console.log("Arquivo JSON gerado com", reservas.length, "reservas.");
}
