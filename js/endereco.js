// Exemplo: ?destino=Ubatuba&editar=1
export function lerParametro(nome) {
  let endereco = window.location.search.substring(1);
  let parametros = endereco.split("&");

  for (let parametro of parametros) {
    let separador = parametro.indexOf("=");
    let chave = parametro.substring(0, separador);
    let valor = parametro.substring(separador + 1);

    if (chave === nome) {
      // O formulario coloca + nos espacos e codifica os acentos na URL.
      valor = valor.replaceAll("+", " ");
      try {
        return decodeURIComponent(valor);
      } catch {
        return "";
      }
    }
  }
  return "";
}
