import { lerParametro } from "./endereco.js";
import { pegarReservas, salvarReservas } from "./dados.js";
import { calcularNoites, validar } from "./validacao.js";
import { dinheiro, pegarImoveis, proximoId, textoSeguro } from "./util.js";

let reservas = pegarReservas();
const formulario = document.querySelector("#form-reserva");

prepararFormulario();
mostrarImoveisParaReserva();

formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();
  let dados = lerCampos();
  let erros = validar(dados);
  let temErro = mostrarErros(erros);

  if (temErro) {
    mostrarMensagem("Existem campos que precisam ser corrigidos.", false);
  } else {
    let posicao = -1;

    for (let i = 0; i < reservas.length; i++) {
      if (reservas[i].id === dados.id) {
        posicao = i;
      }
    }

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
    document.querySelector("#id-imovel-reserva").value = "";
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
document.querySelector("#busca-imovel").addEventListener("input", mostrarImoveisParaReserva);

document.querySelector("#lista-imoveis-reserva").addEventListener("click", function(evento) {
  let botao = evento.target.closest("button");
  if (botao === null) return;
  escolherImovel(Number(botao.dataset.id));
});

function lerCampos() {
  let id = Number(document.querySelector("#id-reserva").value);
  if (id === 0) id = proximoId(reservas);

  return {
    id: id,
    idImovel: Number(document.querySelector("#id-imovel-reserva").value),
    nome: document.querySelector("#nome").value.trim(),
    hospedes: Number(document.querySelector("#hospedes").value),
    maxHospedes: Number(document.querySelector("#hospedes").max),
    acomodacao: document.querySelector("#acomodacao").value,
    destino: document.querySelector("#destino").value.trim(),
    checkin: document.querySelector("#checkin").value,
    checkout: document.querySelector("#checkout").value,
    diaria: Number(document.querySelector("#diaria").value),
    observacoes: document.querySelector("#observacoes").value.trim()
  };
}

function mostrarErros(erros) {
  let temErro = false;
  let campos = ["imovel", "nome", "hospedes", "acomodacao", "destino", "checkin", "checkout", "diaria"];

  for (let campo of campos) {
    let textoErro = document.querySelector("#erro-" + campo);
    let entrada = document.querySelector("#" + campo);

    if (erros[campo]) {
      temErro = true;
      textoErro.textContent = erros[campo];
      if (entrada !== null) entrada.classList.add("invalido");
    } else {
      textoErro.textContent = "";
      if (entrada !== null) entrada.classList.remove("invalido");
    }
  }

  return temErro;
}

function mostrarMensagem(texto, sucesso) {
  let caixa = document.querySelector("#mensagem");
  caixa.textContent = texto;

  if (sucesso) {
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
    lugar.textContent = "escolha um imóvel e preencha as datas";
  }
}

function prepararFormulario() {
  let id = Number(lerParametro("editar"));

  if (id > 0) {
    for (let reserva of reservas) {
      if (reserva.id === id) {
        document.querySelector("#titulo-formulario").textContent = "Editar reserva";
        document.querySelector("#salvar").textContent = "Atualizar reserva";
        document.querySelector("#id-reserva").value = reserva.id;
        if (reserva.idImovel) {
          document.querySelector("#id-imovel-reserva").value = reserva.idImovel;
        }
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
}

function mostrarImoveisParaReserva() {
  let listaImoveis = document.querySelector("#lista-imoveis-reserva");
  let semImoveis = document.querySelector("#sem-imoveis-reserva");
  let busca = document.querySelector("#busca-imovel").value.toLowerCase();
  let imoveis = pegarImoveis();
  let encontrados = 0;

  listaImoveis.innerHTML = "";

  for (let imovel of imoveis) {
    let texto = (imovel.nome + " " + imovel.cidade + " " + imovel.tipo).toLowerCase();

    if (texto.includes(busca)) {
      let cartao = document.createElement("article");
      cartao.className = "cartao-reserva";
      cartao.innerHTML = `
        <h2>${textoSeguro(imovel.nome)}</h2>
        <p class="subtitulo">${textoSeguro(imovel.tipo)} em ${textoSeguro(imovel.cidade)}</p>
        <div class="dados-cartao">
          <div><span>Diária</span><b>${dinheiro(imovel.diaria)}</b></div>
          <div><span>Hóspedes</span><b>${imovel.hospedes}</b></div>
        </div>
        <p>${textoSeguro(imovel.descricao || "")}</p>
        <div class="rodape-cartao">
          <strong>${textoSeguro(imovel.tipo)}</strong>
          <button type="button" data-id="${imovel.id}">Escolher</button>
        </div>`;
      listaImoveis.appendChild(cartao);
      encontrados++;
    }
  }

  if (encontrados === 0) {
    semImoveis.style.display = "block";
  } else {
    semImoveis.style.display = "none";
  }
}

function escolherImovel(id) {
  let imoveis = pegarImoveis();

  for (let imovel of imoveis) {
    if (imovel.id === id) {
      document.querySelector("#id-imovel-reserva").value = imovel.id;
      document.querySelector("#acomodacao").value = imovel.tipo;
      document.querySelector("#destino").value = imovel.cidade;
      document.querySelector("#diaria").value = imovel.diaria;
      document.querySelector("#hospedes").max = imovel.hospedes;
      document.querySelector("#erro-imovel").textContent = "";
      mostrarMensagem("Imóvel escolhido: " + imovel.nome, true);
      atualizarPrevisao();
    }
  }
}
