export function calcularNoites(entrada, saida) {
  if (entrada === "" || saida === "") {
    return 0;
  }

  let dataEntrada = new Date(entrada + "T12:00:00");
  let dataSaida = new Date(saida + "T12:00:00");
  let diferenca = dataSaida - dataEntrada;
  let noites = diferenca / 86400000;

  return noites;
}

export function validar(dados) {
  let erros = {};
  let noites = calcularNoites(dados.checkin, dados.checkout);

  if (dados.nome.length < 3) {
    erros.nome = "Digite pelo menos 3 letras.";
  }

  if (dados.hospedes < 1 || dados.hospedes > 12) {
    erros.hospedes = "O número deve ficar entre 1 e 12.";
  }

  if (dados.acomodacao === "") {
    erros.acomodacao = "Selecione uma opção.";
  }

  if (dados.destino.length < 3) {
    erros.destino = "Informe um destino válido.";
  }

  if (dados.checkin === "") {
    erros.checkin = "Informe a data de entrada.";
  }

  if (dados.checkout === "") {
    erros.checkout = "Informe a data de saída.";
  } else if (noites <= 0) {
    erros.checkout = "A saída deve ser depois da entrada.";
  } else if (noites > 90) {
    erros.checkout = "O máximo é de 90 noites.";
  }

  if (dados.diaria < 50 || dados.diaria > 10000) {
    erros.diaria = "Use um valor entre 50 e 10000.";
  }

  return erros;
}
