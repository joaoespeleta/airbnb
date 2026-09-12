import { lerParametro } from "./endereco.js";
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
          break;
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
  document.querySelector("#diaria").addEventListener("input", atualizarPrevisao);

  document.querySelector("#busca-imovel").addEventListener("input", mostrarImoveisParaReserva);

  document.querySelector("#lista-imoveis-reserva").addEventListener("click", function(evento) {
    let botao = evento.target.closest("button");
    if (botao === null) return;
    escolherImovel(Number(botao.dataset.id));
  });
}

function lerCampos() {
  let id = Number(document.querySelector("#id-reserva").value);
  if (id === 0) id = Date.now();

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
      if (entrada !== null) {
        entrada.classList.add("invalido");
      }
    } else {
      textoErro.textContent = "";
      if (entrada !== null) {
        entrada.classList.remove("invalido");
      }
    }
  }
  return temErro;
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
  let id = Number(lerParametro("editar"));

  if (id > 0) {
    let reserva = null;
    for (let i = 0; i < reservas.length; i++) {
      if (reservas[i].id === id) {
        reserva = reservas[i];
        break;
      }
    }

    if (reserva !== null) {
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

function pegarImoveis() {
  let texto = localStorage.getItem("imoveis_airbn");
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
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

let filtroAtual = "todas";

if (lista !== null) {
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
    for (let i = 0; i < reservas.length; i++) {
      if (reservas[i].id === id) {
        reservas.splice(i, 1);
        break;
      }
    }
    salvarReservas(reservas);
    mostrarReservas(filtroAtual);
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
  let imoveis = [];
  let textoImoveis = localStorage.getItem("imoveis_airbn");
  if (textoImoveis !== null) {
    imoveis = JSON.parse(textoImoveis);
  }

  mostrarImoveis();

  formAnfitriao.addEventListener("submit", function(evento) {
    evento.preventDefault();
    let id = Number(document.querySelector("#id-imovel").value);
    let nome = document.querySelector("#nome-imovel").value.trim();
    let cidade = document.querySelector("#cidade-imovel").value.trim();
    let tipo = document.querySelector("#tipo-imovel").value;
    let diaria = Number(document.querySelector("#diaria-imovel").value);
    let hospedes = Number(document.querySelector("#hospedes-imovel").value);
    let descricao = document.querySelector("#descricao-imovel").value.trim();
    let mensagem = document.querySelector("#mensagem-anfitriao");

    if (nome.length < 3 || cidade.length < 3 || tipo === "" || diaria < 50 || hospedes < 1) {
      mensagem.textContent = "Preencha todos os campos obrigatórios.";
      mensagem.style.color = "#b84343";
    } else {
      let imovel = {
        id: id,
        nome: nome,
        cidade: cidade,
        tipo: tipo,
        diaria: diaria,
        hospedes: hospedes,
        descricao: descricao
      };

      if (id === 0) {
        imovel.id = Date.now();
        imoveis.push(imovel);
        mensagem.textContent = "Imóvel cadastrado com sucesso.";
      } else {
        for (let i = 0; i < imoveis.length; i++) {
          if (imoveis[i].id === id) {
            imoveis[i] = imovel;
          }
        }
        mensagem.textContent = "Imóvel atualizado com sucesso.";
      }

      mensagem.style.color = "#356859";
      salvarImoveis();
      formAnfitriao.reset();
      document.querySelector("#id-imovel").value = "";
      document.querySelector("#hospedes-imovel").value = 1;
      document.querySelector("#titulo-imovel").textContent = "Cadastrar imóvel";
      document.querySelector("#salvar-imovel").textContent = "Salvar imóvel";
      mostrarImoveis();
    }
  });

  document.querySelector("#lista-imoveis").addEventListener("click", function(evento) {
    let botao = evento.target.closest("button");
    if (botao === null) return;

    let id = Number(botao.dataset.id);

    if (botao.dataset.acao === "editar") {
      editarImovel(id);
    }

    if (botao.dataset.acao === "excluir") {
      excluirImovel(id);
    }
  });

  function salvarImoveis() {
    localStorage.setItem("imoveis_airbn", JSON.stringify(imoveis));
  }

  function mostrarImoveis() {
    let listaImoveis = document.querySelector("#lista-imoveis");
    let semImoveis = document.querySelector("#sem-imoveis");
    let totalImoveis = document.querySelector("#total-imoveis");

    listaImoveis.innerHTML = "";
    totalImoveis.textContent = imoveis.length + " imóveis cadastrados";

    if (imoveis.length === 0) {
      semImoveis.style.display = "block";
    } else {
      semImoveis.style.display = "none";
    }

    for (let imovel of imoveis) {
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
          <div><button data-acao="editar" data-id="${imovel.id}">Editar</button> <button data-acao="excluir" data-id="${imovel.id}">Excluir</button></div>
        </div>`;
      listaImoveis.appendChild(cartao);
    }
  }

  function editarImovel(id) {
    for (let imovel of imoveis) {
      if (imovel.id === id) {
        document.querySelector("#id-imovel").value = imovel.id;
        document.querySelector("#nome-imovel").value = imovel.nome;
        document.querySelector("#cidade-imovel").value = imovel.cidade;
        document.querySelector("#tipo-imovel").value = imovel.tipo;
        document.querySelector("#diaria-imovel").value = imovel.diaria;
        document.querySelector("#hospedes-imovel").value = imovel.hospedes;
        document.querySelector("#descricao-imovel").value = imovel.descricao;
        document.querySelector("#titulo-imovel").textContent = "Editar imóvel";
        document.querySelector("#salvar-imovel").textContent = "Atualizar imóvel";
      }
    }
  }

  function excluirImovel(id) {
    if (confirm("Deseja excluir este imóvel?")) {
      for (let i = 0; i < imoveis.length; i++) {
        if (imoveis[i].id === id) {
          imoveis.splice(i, 1);
        }
      }
      salvarImoveis();
      mostrarImoveis();
    }
  }
}
