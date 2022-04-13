let nomeUsuario = {name: ""};
let intervalID;

function entraChat(){

    let nome = document.querySelector(".tela-entrada input");
    nomeUsuario.name = nome.value;
    console.log(nomeUsuario)
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario);

    promise.catch(trataErroEntrada);
    promise.then(trataSucessoEntrada);
}

function trataErroEntrada(error){
    let primeiroP = document.querySelector(".tela-entrada p");
    let segundoP = document.querySelector(".tela-entrada p:nth-child(3)")
    
    if(nomeUsuario.name == ""){
        
        if(!segundoP.classList.contains("escondido")){
            segundoP.classList.add("escondido")
        }
        
        primeiroP.classList.remove("escondido");
    }else{
        
        if(!primeiroP.classList.contains("escondido")){
            primeiroP.classList.add("escondido")
        }
        
        segundoP.classList.remove("escondido");
    }
}

function trataSucessoEntrada(response){
    
    document.querySelector(".tela-entrada").classList.add("escondido");
    document.querySelector(".container").classList.remove("escondido");
    manterConexao();
    carregaMensagens();
}

function manterConexao(){
    intervalID = setInterval(function(){
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario);
    }, 3000);
}

function carregaMensagens(){

    
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