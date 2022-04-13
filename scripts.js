let nomeUsuario;

function entraChat(){

    let nome = document.querySelector(".tela-entrada input");
    nomeUsuario = nome.value;
    
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nomeUsuario});

    promise.catch(trataErroEntrada);
    promise.then(trataSucessoEntrada);
}

function trataErroEntrada(error){

    if(error.response.status === 400){
        document.querySelector(".tela-entrada p").classList.remove("escondido");
    }
}

function trataSucessoEntrada(response){
    
    document.querySelector(".tela-entrada").classList.add("escondido");
    document.querySelector(".container").classList.remove("escondido");
    carregaMensagens();
    manterConexao();
}

function carregaMensagens(){
}

function manterConexao(){
}



function abreMenu(){
    let fundoPreto = document.querySelector(".fundo-preto");
    fundoPreto.classList.remove("escondido");

    let menu = document.querySelector(".menu");
    menu.classList.add("menu-aberto");
}

function fecharMenu(){
    let menu = document.querySelector(".menu");
    menu.classList.remove("menu-aberto");
    
    let fundoPreto = document.querySelector(".fundo-preto");
    setTimeout(function(){
        fundoPreto.classList.add("escondido");
    }, 100);
}