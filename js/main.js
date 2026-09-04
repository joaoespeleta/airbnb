import { pegarReservas, salvarReservas } from "./dados.js";
import { calcularNoites, validar } from "./validacao.js";

let reservas = pegarReservas();

// Cada parte abaixo só é executada quando o elemento existe na página.
const formulario = document.querySelector("#form-reserva");
const lista = document.querySelector("#lista-reservas");
const formAnfitriao = document.querySelector("#form-anfitriao");

function dinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function dataNormal(data) {
  let partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function textoSeguro(texto) {
  return texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

if (formulario !== null) {
  prepararFormulario();

  formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    let dados = lerCampos();
    let erros = validar(dados);
    mostrarErros(erros);

    if (Object.keys(erros).length > 0) {
      mostrarMensagem("Existem campos que precisam ser corrigidos.", false);
    } else {
      let posicao = reservas.findIndex(function(item) {
        return item.id === dados.id;
      });

      if (posicao >= 0) {
        reservas[posicao] = dados;
        mostrarMensagem("Reserva atualizada com sucesso!", true);
      } else {
        reservas.push(dados);
        mostrarMensagem("Reserva cadastrada com sucesso!", true);
      }

      salvarReservas(reservas);
      formulario.reset();
      document.querySelector("#hospedes").value = 1;
      document.querySelector("#id-reserva").value = "";
      document.querySelector("#contador").textContent = "0";
      atualizarPrevisao();

      setTimeout(function() {
        window.location.href = "reservas.html";
      }, 900);
    }
  });

  document.querySelector("#observacoes").addEventListener("input", function() {
    document.querySelector("#contador").textContent = this.value.length;
  });

  document.querySelector("#checkin").addEventListener("change", atualizarPrevisao);
  document.querySelector("#checkout").addEventListener("change", atualizarPrevisao);
  document.querySelector("#diaria").addEventListener("input", atualizarPrevisao);
}

function lerCampos() {
  let id = Number(document.querySelector("#id-reserva").value);
  if (id === 0) id = Date.now();

  return {
    id: id,
    nome: document.querySelector("#nome").value.trim(),
    hospedes: Number(document.querySelector("#hospedes").value),
    acomodacao: document.querySelector("#acomodacao").value,
    destino: document.querySelector("#destino").value.trim(),
    checkin: document.querySelector("#checkin").value,
    checkout: document.querySelector("#checkout").value,
    diaria: Number(document.querySelector("#diaria").value),
    observacoes: document.querySelector("#observacoes").value.trim()
  };
}

function mostrarErros(erros) {
  let campos = ["nome", "hospedes", "acomodacao", "destino", "checkin", "checkout", "diaria"];

  for (let campo of campos) {
    let textoErro = document.querySelector("#erro-" + campo);
    let entrada = document.querySelector("#" + campo);

    if (erros[campo]) {
      textoErro.textContent = erros[campo];
      entrada.classList.add("invalido");
    } else {
      textoErro.textContent = "";
      entrada.classList.remove("invalido");
    }
  }
}

function mostrarMensagem(texto, sucesso) {
  let caixa = document.querySelector("#mensagem");
  caixa.textContent = texto;

  if (sucesso === true) {
    caixa.className = "mensagem sucesso";
  } else {
    caixa.className = "mensagem falha";
  }
}

function atualizarPrevisao() {
  let entrada = document.querySelector("#checkin").value;
  let saida = document.querySelector("#checkout").value;
  let diaria = Number(document.querySelector("#diaria").value);
  let noites = calcularNoites(entrada, saida);
  let lugar = document.querySelector("#valor-previsto");

  if (noites > 0 && diaria >= 50) {
    lugar.textContent = noites + " noites - " + dinheiro(noites * diaria);
  } else {
    lugar.textContent = "preencha as datas e a diária";
  }
}

function prepararFormulario() {
  let parametros = new URLSearchParams(window.location.search);
  let id = Number(parametros.get("editar"));

  if (id > 0) {
    let reserva = reservas.find(function(item) {
      return item.id === id;
    });

    if (reserva !== undefined) {
      document.querySelector("#titulo-formulario").textContent = "Editar reserva";
      document.querySelector("#salvar").textContent = "Atualizar reserva";
      document.querySelector("#id-reserva").value = reserva.id;
      document.querySelector("#nome").value = reserva.nome;
      document.querySelector("#hospedes").value = reserva.hospedes;
      document.querySelector("#acomodacao").value = reserva.acomodacao;
      document.querySelector("#destino").value = reserva.destino;
      document.querySelector("#checkin").value = reserva.checkin;
      document.querySelector("#checkout").value = reserva.checkout;
      document.querySelector("#diaria").value = reserva.diaria;
      document.querySelector("#observacoes").value = reserva.observacoes;
      document.querySelector("#contador").textContent = reserva.observacoes.length;
      atualizarPrevisao();
    }
  }
}

if (lista !== null) {
  let filtroAtual = "todas";
  mostrarReservas(filtroAtual);

  document.querySelector("#busca").addEventListener("input", function() {
    mostrarReservas(filtroAtual);
  });

  let botoesFiltro = document.querySelectorAll(".filtro");
  for (let botao of botoesFiltro) {
    botao.addEventListener("click", function() {
      document.querySelector(".filtro.ativo").classList.remove("ativo");
      this.classList.add("ativo");
      filtroAtual = this.dataset.filtro;
      mostrarReservas(filtroAtual);
    });
  }

  lista.addEventListener("click", function(evento) {
    let botao = evento.target.closest("button");
    if (botao === null) return;

    let id = Number(botao.dataset.id);
    if (botao.dataset.acao === "editar") {
      window.location.href = "reserva.html?editar=" + id;
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
      mostrarReservas(filtroAtual);
    }
  });

  document.querySelector("#baixar").addEventListener("click", baixarArquivo);
}

function mostrarReservas(filtro) {
  lista.innerHTML = "";
  let busca = document.querySelector("#busca").value.toLowerCase();
  let encontradas = 0;

  for (let reserva of reservas) {
    let status = pegarStatus(reserva);
    let temBusca = reserva.nome.toLowerCase().includes(busca) || reserva.destino.toLowerCase().includes(busca);
    let temFiltro = filtro === "todas" || filtro === status;

    if (temBusca && temFiltro) {
      lista.appendChild(criarCartao(reserva, status));
      encontradas++;
    }
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
}

function excluirReserva(id) {
  if (confirm("Tem certeza que deseja excluir esta reserva?")) {
    reservas = reservas.filter(function(item) {
      return item.id !== id;
    });
    salvarReservas(reservas);
    mostrarReservas("todas");
    console.log("Reserva excluída. Restaram", reservas.length, "registros.");
  }
}

function baixarArquivo() {
  let conteudo = JSON.stringify(reservas, null, 2);
  let arquivo = new Blob([conteudo], { type: "application/json" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "reservas-airbn.json";
  link.click();
}

if (formAnfitriao !== null) {
  formAnfitriao.addEventListener("submit", function(evento) {
    evento.preventDefault();
    let nome = document.querySelector("#nome-anfitriao").value.trim();
    let tipo = document.querySelector("#tipo-imovel").value;
    let mensagem = document.querySelector("#mensagem-anfitriao");

    if (nome.length < 3 || tipo === "") {
      mensagem.textContent = "Preencha seu nome e escolha o tipo do imóvel.";
      mensagem.style.color = "#b84343";
    } else {
      mensagem.textContent = "Obrigado, " + nome + "! Seu interesse foi registrado.";
      mensagem.style.color = "#356859";
      localStorage.setItem("perfil_airbn", "anfitriao");
      formAnfitriao.reset();
    }
  });
}
