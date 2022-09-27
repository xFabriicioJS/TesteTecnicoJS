// ------------> ATRIBUIÇÕES DOS ELEMENTOS DOM às variáveis <--------------------
const btnEnviar = document.querySelector("#btnEnviar");
const nome = document.querySelector("#nomeCompleto");
const cpf = document.querySelector("#cpf");
const dataNascimento = document.querySelector("#dataNascimento");
const idade = document.querySelector("#idade");
const cep = document.querySelector("#cep");
const rua = document.querySelector("#logradouro");
const bairro = document.querySelector("#bairro");
const cidade = document.querySelector("#localidade");
const estado = document.querySelector("#uf");
const numero = document.querySelector("#numero");
const checkBoxTermos = document.querySelector("#invalidCheck3");


// Função principal para enviar os dados

const enviar = () => {
  //validação do Nome
  validaNome();
  //validacao do CPF
  if (TestaCPF(cpf.value)) {
    document.querySelector("#validacaoCPF").style.display = "none";
    document.querySelector("#modal-cpf").innerHTML = cpf.value;
  } else {
    document.querySelector("#validacaoCPF").style.display = "block";
    throw new Error("CPF inválido");
  }
  //validado a data de nascimento e autocompletando a idade
  validaDataDeNascimento();
  //validando a idade e exige que seja um número positivo e menor que 3 dígitos
  validaIdade();
  //valida o CEP e autocompleta o endereco
  validaCEP();
  //preeenchendo o modal com as informações restantes do input
  preencheModal();
  //valida se os termos foram aceitos
  validaTermos();

  //Caso dê tudo certo, será aberto o modal com os dados preenchidos.
  $("#exampleModal").modal("show");
};

//Recarrega a página ao fechar o modal
const onClose = () => {
  document.location.reload();
};

//<--------- FUNÇÕES QUE VALIDAM OS CAMPOS --------->

const validaDataDeNascimento = () => {
  if (!dataNascimento.value) {
    document.querySelector("#validacaoDataNascimento").style.display = "block";
    throw new Error("Data de nascimento não pode ser vazia");
  } else {
    document.querySelector("#validacaoDataNascimento").style.display = "none";
    document.querySelector("#modal-dataNascimento").innerHTML =
      dataNascimento.value;
  }
};

const calculaIdade = () => {
  let diaNascimento = new Date(dataNascimento.value);
  let hoje = new Date();

  let diferenca = Math.abs(hoje - diaNascimento);
  let dias = diferenca / (1000 * 3600 * 24).toFixed();

  let idade = Math.floor(dias / 365);

  console.log(idade);
  document.querySelector("#idade").value = idade;
};

const validaNome = () => {
  if (!nome.value || nome.value.length < 3) {
    document.querySelector("#validacaoNome").style.display = "block";
    throw new Error("Nome inválido");
  } else {
    document.querySelector("#validacaoNome").style.display = "none";
    document.querySelector("#modal-nomeCompleto").innerHTML = nome.value;
  }
};

const validaIdade = () => {
  if (!idade.value || idade.length > 3 || idade.value < 0) {
    document.querySelector("#validacaoIdade").style.display = "block";
    throw new Error("Idade inválida");
  } else {
    document.querySelector("#validacaoIdade").style.display = "none";
    document.querySelector("#modal-idade").innerHTML = idade.value;
  }
};

const validaCEP = () => {
  if (!cep.value || cep.value.length < 8) {
    document.querySelector("#validacaoCEP").style.display = "block";
    throw new Error("CEP inválido");
  } else {
    document.querySelector("#validacaoCEP").style.display = "none";
    document.querySelector("#modal-cep").innerHTML = cep.value;
  }
};

const validaTermos = () => {
  if (checkBoxTermos.checked) {
    document.querySelector("#validacaoTermos").style.display = "none";
  } else {
    document.querySelector("#validacaoTermos").style.display = "block";
    throw new Error("Termos não aceitos");
  }
};

//Função que valida o CPF, como recomendado pela própria Receita Federal
const TestaCPF = (strCPF) => {
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
};

// ------------> FUNCIONALIDADE REQUISIÇÃO CEP COM AUTOCOMPLETE <--------------------

const showData = (result) => {
  for (const campo in result) {
    if (document.querySelector("#" + campo)) {
      document.querySelector("#" + campo).value = result[campo];
    }
  }
};

cep.addEventListener("blur", (e) => {
  let consulta = cep.value.replace("-", "");

  //objeto para passar na requisicao
  const options = {
    method: "GET",
    mode: "cors",
    cache: "default",
  };

  //requisição para a API
  fetch(`https://viacep.com.br/ws/${consulta}/json/`, options)
    .then((response) => response.json().then((data) => showData(data)))
    .catch((e) => console.log(e));
});

// ------------>PREENCHENDO MODAL COM AS INFORMAÇÕES DO INPUT <--------------------
const preencheModal = () => {
  document.querySelector("#modal-rua").innerHTML = rua.value;
  document.querySelector("#modal-bairro").innerHTML = bairro.value;
  document.querySelector("#modal-localidade").innerHTML = cidade.value;
  document.querySelector("#modal-uf").innerHTML = estado.value;
  document.querySelector("#modal-numero").innerHTML = numero.value;
  document.querySelector("#modal-hobbies").innerHTML = tags
    .map((tag) => tag)
    .join(", ");

    //montando JSON para exibir no modal
    const jsonobject = {
      nome: nome.value,
      cpf: cpf.value,
      dataNascimento: dataNascimento.value,
      idade: idade.value,
      cep: cep.value,
      rua: rua.value,
      bairro: bairro.value,
      cidade: cidade.value,
      estado: estado.value,
      numero: numero.value,
      hobbies: tags,
    }
    document.querySelector("#modal-json").innerHTML = JSON.stringify(jsonobject);
};


  


// ------------> FUNCIONALIDADE DE ADICIONAR HOBBIES <--------------------
//pegando os elementos necessários para a funcionalidade dos hobbies
const ul = document.querySelector("ul"),
  input = document.querySelector(".hobbyInput"),
  //contabilizador
  tagNumb = document.querySelector(".details span");

let maxTags = 10,
  //iniciando o array com um exemplo de hobby
  tags = [];

//chamando as funções para criar os hobbies e contabilizá-los
countTags();
createTag();

function countTags() {
  input.focus();
  tagNumb.innerText = maxTags - tags.length;
}

//criando as tags dos hobbies
function createTag() {
  ul.querySelectorAll("li").forEach((li) => li.remove());
  tags
    .slice()
    .reverse()
    .forEach((tag) => {
      let liTag = `<li>${tag} <i class="bi bi-x" onclick="remove(this, '${tag}')"></i></li>`;
      ul.insertAdjacentHTML("afterbegin", liTag);
    });
  countTags();
}

function remove(element, tag) {
  let index = tags.indexOf(tag);
  tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
  element.parentElement.remove();
  countTags();
}

function addTag(e) {
  if (e.key == "Enter") {
    let tag = e.target.value.replace(/\s+/g, " ");
    if (tag.length > 1 && !tags.includes(tag)) {
      if (tags.length < 10) {
        tag.split(",").forEach((tag) => {
          tags.push(tag);
          createTag();
        });
      }
    }
    e.target.value = "";
  }
}

input.addEventListener("keyup", addTag);

const removeBtn = document.querySelector(".details button");
removeBtn.addEventListener("click", () => {
  tags.length = 0;
  ul.querySelectorAll("li").forEach((li) => li.remove());
  countTags();
});
