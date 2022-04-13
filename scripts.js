let nomeUsuario = {name: ""};
let intervalID;
let arrMensagens = [];

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

function entraChat(){

    let nome = document.querySelector(".tela-entrada input");
    nomeUsuario.name = nome.value;
    
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
    manterConexaoECarregar();
}

function manterConexaoECarregar(){
    intervalID = setInterval(auxManterConexaoECarregar, 2000);
}

function auxManterConexaoECarregar(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario);
    carregaMensagens();
}

function carregaMensagens(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderizaMensagens);

}

function renderizaMensagens(response){
    arrMensagens = response.data;
    for(let i = 0; i < arrMensagens.length; i++){
        imprimeMensagem(arrMensagens[i]);    
    }
}

function imprimeMensagem(mensagem){

    let espacoMensagens = document.querySelector(".conteudo");
    
    if(mensagem.type === "status"){
        espacoMensagens.innerHTML += `<div class="message status"><span class="horario">(${mensagem.time})</span><span class="from">${mensagem.from}</span>${mensagem.text}</div>`
    }else if(mensagem.type === "message"){
        espacoMensagens.innerHTML += `<div class="message"><span class="horario">(${mensagem.time})</span><span class="from">${mensagem.from}</span>para<span class="to">${mensagem.to}:</span><span class="text">${mensagem.text}</span></div>`
    }else if(mensagem.type === "private_message"){
        espacoMensagens.innerHTML += `<div class="message private_message"><span class="horario">(${mensagem.time})</span><span class="from">${mensagem.from}</span>reservadamente para<span class="to">${mensagem.to}:</span><span class="text">${mensagem.text}</span></div>`
    }

    document.querySelector(".conteudo div:last-child").scrollIntoView();
}

function enviarMensagem(){
    
    let mensagemDigitada = document.querySelector(".footer input").value;

    let mensagem = {
        from: nomeUsuario.name,
        to: "Todos",
        text: mensagemDigitada,
        type: "message"
    }

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem); 

    promise.then(carregaMensagens);
    promise.catch(windowReload);
}

function windowReload(){
    window.location.reload();
}