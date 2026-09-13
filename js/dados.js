const nomeLocal = "reservas_hospeda";
// Mock de dados.
const exemplos = [
  {
    id: 1,
    nome: "Marina Costa",
    hospedes: 4,
    acomodacao: "Casa",
    destino: "Ubatuba, SP",
    checkin: "2026-12-18",
    checkout: "2026-12-23",
    diaria: 520,
    observacoes: "Casa perto da praia"
  },
  {
    id: 2,
    nome: "Rafael Lima",
    hospedes: 2,
    acomodacao: "Apartamento",
    destino: "Campos do Jordão, SP",
    checkin: "2026-07-10",
    checkout: "2026-07-13",
    diaria: 390,
    observacoes: ""
  }
];

// Busca as reservas salvas; se nao existir nada, cria reservas de exemplo.
export function pegarReservas() {
  let texto = localStorage.getItem(nomeLocal);

  if (texto === null) {
    salvarReservas(exemplos);
    return exemplos;
  } else {
    return JSON.parse(texto);
  }
}

// Salva a lista de reservas no localStorage.
export function salvarReservas(lista) {
  localStorage.setItem(nomeLocal, JSON.stringify(lista));
}
