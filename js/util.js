// Formata valores em reais para mostrar na interface.
export function dinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Converte a data do formato do formulario para dia/mes/ano.
export function dataNormal(data) {
  let partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Evita que textos digitados pelo usuario virem HTML na pagina.
export function textoSeguro(texto) {
  return texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// Encontra o proximo identificador livre dentro de uma lista.
export function proximoId(lista) {
  let maiorId = 0;

  for (let item of lista) {
    if (item.id > maiorId) {
      maiorId = item.id;
    }
  }

  return maiorId + 1;
}

// Recupera os imoveis cadastrados no navegador.
export function pegarImoveis() {
  let texto = localStorage.getItem("imoveis_hospeda");

  if (texto === null) {
    return [];
  }

  return JSON.parse(texto);
}

// Salva os imoveis no navegador para manter os dados apos recarregar.
export function salvarImoveis(imoveis) {
  localStorage.setItem("imoveis_hospeda", JSON.stringify(imoveis));
}
