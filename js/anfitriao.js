import { dinheiro, pegarImoveis, proximoId, salvarImoveis, textoSeguro } from "./util.js";

let imoveis = pegarImoveis();
const formAnfitriao = document.querySelector("#form-anfitriao");

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
      imovel.id = proximoId(imoveis);
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
    salvarImoveis(imoveis);
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
    salvarImoveis(imoveis);
    mostrarImoveis();
  }
}
