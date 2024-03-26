export function validarMatricula(matricula: string): boolean {
  const partes = matricula.split('-');
  const numero = partes[0];
  const digitoVerificador = parseInt(partes[1]);
  return calcularDigitoVerificador(numero) === digitoVerificador;
}

export function gerarProximaMatricula(ultimaMatricula?: string | null): string {
  let numero: number;
  let digito: number;

  if (ultimaMatricula) {
    [numero, digito] = ultimaMatricula.split('-').map((v) => parseInt(v));
    numero += 1;
  } else {
    numero = 1;
  }

  digito = calcularDigitoVerificador(numero.toString());
  return `${numero.toString().padStart(6, '0')}-${digito}`;
}

function calcularDigitoVerificador(matricula: string): number {
  let soma = 0;
  let peso = 2;

  for (let i = matricula.length - 1; i >= 0; i--) {
    soma += parseInt(matricula[i]) * peso++;
  }

  let resultado = 11 - (soma % 11);
  if (resultado >= 10) {
    resultado = 0;
  }

  return resultado;
}

console.log(gerarProximaMatricula(null)); // true
