// Mock de dados.
const destinos = [
  {
    cidade: "Ubatuba",
    estado: "São Paulo",
    sigla: "SP",
    descricao: "Casas e apartamentos para quem quer passar uns dias na praia."
  },
  {
    cidade: "Campos do Jordão",
    estado: "São Paulo",
    sigla: "SP",
    descricao: "Uma opção na serra para uma viagem de fim de semana."
  },
  {
    cidade: "São Paulo",
    estado: "São Paulo",
    sigla: "SP",
    descricao: "Apartamentos para ficar perto dos passeios da capital."
  },
  {
    cidade: "Rio de Janeiro",
    estado: "Rio de Janeiro",
    sigla: "RJ",
    descricao: "Opções para conhecer a cidade e aproveitar a praia."
  },
  {
    cidade: "Florianópolis",
    estado: "Santa Catarina",
    sigla: "SC",
    descricao: "Casas e apartamentos para uma temporada na ilha."
  },
  {
    cidade: "Gramado",
    estado: "Rio Grande do Sul",
    sigla: "RS",
    descricao: "Um destino para passear pela serra gaúcha."
  }
];

console.log("Destinos carregados:", destinos.length);

// Cria os cartoes de destinos disponiveis e adiciona todos na pagina.
for (let destino of destinos) {
  let cartao = document.createElement("article");
  cartao.className = "cartao-reserva";

  let titulo = document.createElement("h2");
  titulo.textContent = destino.cidade + ", " + destino.sigla;

  let textoEstado = document.createElement("p");
  textoEstado.className = "subtitulo";
  textoEstado.textContent = destino.estado;

  let descricao = document.createElement("p");
  descricao.textContent = destino.descricao;

  let link = document.createElement("a");
  link.className = "botao botao-verde";
  link.href = "reserva.html";
  link.textContent = "Buscar neste destino";

  cartao.append(titulo, textoEstado, descricao, link);
  document.querySelector("#lista-destinos").appendChild(cartao);
}

console.log("Lista de destinos exibida na tela.");
