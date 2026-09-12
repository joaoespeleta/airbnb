export function dinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function dataNormal(data) {
  let partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

export function textoSeguro(texto) {
  return texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function proximoId(lista) {
  let maiorId = 0;

  for (let item of lista) {
    if (item.id > maiorId) {
      maiorId = item.id;
    }
  }

  return maiorId + 1;
}

export function pegarImoveis() {
  let texto = localStorage.getItem("imoveis_airbn");

  if (texto === null) {
    return [];
  }

  return JSON.parse(texto);
}

export function salvarImoveis(imoveis) {
  localStorage.setItem("imoveis_airbn", JSON.stringify(imoveis));
}
