function lerDados(armazenamento, chave, padrao) {
  try {
    let dados = JSON.parse(armazenamento.getItem(chave));
    if (dados === null) {
      return padrao;
    }
    return dados;
  } catch {
    return padrao;
  }
}

const navegacao = document.querySelector("header nav");
const sessao = lerDados(sessionStorage, "sessao_airbn", null);
if (navegacao) {
  if (sessao && typeof sessao.nome === "string") {
    const nome = document.createElement("span");
    nome.className = "nome-conta";
    nome.textContent = "Olá, " + sessao.nome;
    const sair = document.createElement("button");
    sair.type = "button";
    sair.className = "sair-conta";
    sair.textContent = "Sair";
    sair.addEventListener("click", function() {
      sessionStorage.removeItem("sessao_airbn");
      window.location.href = "index.html";
    });
    navegacao.append(nome, sair);
  } else {
    let paginas = ["login.html", "cadastro.html"];
    let textos = ["Entrar", "Cadastre-se"];
    for (let i = 0; i < paginas.length; i++) {
      let pagina = paginas[i];
      let texto = textos[i];
      const link = document.createElement("a");
      link.href = pagina;
      link.textContent = texto;
      if (window.location.pathname.endsWith("/" + pagina)) {
        link.className = "selecionado";
        link.setAttribute("aria-current", "page");
      }
      navegacao.appendChild(link);
    }
  }
}

const cadastro = document.querySelector("#form-cadastro");
const login = document.querySelector("#form-login");
let formulario = cadastro;
if (formulario === null) {
  formulario = login;
}
if (formulario) {
  formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const mensagem = document.querySelector("#mensagem-conta");
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const dados = lerDados(localStorage, "contas_airbn", []);
    let contas = [];
    if (Array.isArray(dados)) {
      contas = dados;
    }
    let conta = null;
    for (let i = 0; i < contas.length; i++) {
      if (contas[i] && contas[i].email === email) {
        conta = contas[i];
        break;
      }
    }
    mensagem.textContent = "";
    if (cadastro) {
      const nome = document.querySelector("#nome-conta").value.trim();
      if (nome.length < 3) {
        mensagem.textContent = "Digite um nome com pelo menos 3 caracteres.";
        return;
      }
      if (conta) {
        mensagem.textContent = "Este e-mail já está cadastrado. Use o link Entrar abaixo.";
        return;
      }
      conta = { nome: nome, email: email };
      contas.push(conta);
    } else if (!conta) {
      mensagem.textContent = "Não encontramos esse e-mail. Faça seu cadastro primeiro.";
      return;
    }
    try {
      if (cadastro) localStorage.setItem("contas_airbn", JSON.stringify(contas));
      sessionStorage.setItem("sessao_airbn", JSON.stringify(conta));
      window.location.href = "index.html";
    } catch {
      mensagem.textContent = "Não foi possível salvar o acesso. Verifique se o armazenamento do navegador está habilitado.";
    }
  });
}
