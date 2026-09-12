function lerDados(chave, padrao) {
  try {
    let dados = JSON.parse(localStorage.getItem(chave));
    if (dados === null) {
      return padrao;
    }
    return dados;
  } catch {
    return padrao;
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
    const senha = document.querySelector("#senha").value.trim();
    const dados = lerDados("contas_airbn", []);

    let contas = [];
    if (Array.isArray(dados)) {
      contas = dados;
    }

    let conta = null;
    for (let i = 0; i < contas.length; i++) {
      if (contas[i].email === email) {
        conta = contas[i];
      }
    }

    mensagem.textContent = "";

    if (cadastro) {
      let nome = document.querySelector("#nome-conta").value.trim();
      let tipoEscolhido = document.querySelector('input[name="tipo-conta"]:checked');

      if (nome.length < 3) {
        mensagem.textContent = "Digite um nome com pelo menos 3 caracteres.";
        return;
      }

      if (tipoEscolhido === null) {
        mensagem.textContent = "Escolha se a conta e de anfitriao ou hospede.";
        return;
      }

      if (senha.length < 4) {
        mensagem.textContent = "Digite uma senha com pelo menos 4 caracteres.";
        return;
      }

      if (conta !== null) {
        mensagem.textContent = "Este e-mail ja esta cadastrado.";
        return;
      }

      conta = {
        nome: nome,
        email: email,
        senha: senha,
        tipo: tipoEscolhido.value
      };

      contas.push(conta);
      localStorage.setItem("contas_airbn", JSON.stringify(contas));
      window.location.href = "login.html";
    } else {
      if (conta === null) {
        mensagem.textContent = "E-mail nao encontrado.";
        return;
      }

      if (senha !== conta.senha) {
        mensagem.textContent = "Senha incorreta.";
        return;
      }

      window.location.href = "index.html";
    }
  });
}
