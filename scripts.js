//Variáveis globais
let nomeUsuario = {name: ""};
let conexaoID;
let mensagensID;
let participantesID;
let configID;
let arrMensagens = [];
let arrParticipantes = [];
let nomeSelecionado = "Todos";
let visibilidadeSelecionada = "Público";

function abreMenu(){
    
    //espera 50ms para mostrar o background preto
    let fundoPreto = document.querySelector(".fundo-preto");
    setTimeout(function(){
        fundoPreto.classList.remove("escondido");
    }, 50);

    //abre o menu de contatos
    let menu = document.querySelector(".menu");
    menu.classList.add("menu-aberto");
}

function fecharMenu(){
    
    //fecha menu de contatos
    let menu = document.querySelector(".menu");
    menu.classList.remove("menu-aberto");
    
    //remove fundo preto
    let fundoPreto = document.querySelector(".fundo-preto");
    fundoPreto.classList.add("escondido");
   
}

function abreGif(){

    //salva nome digitado na variavel global
    let input = document.querySelector(".tela-entrada input");
    nomeUsuario.name = input.value;

    let divGif = document.querySelector(".gif");
    let telaEntrada = document.querySelector(".tela-entrada");
    divGif.classList.remove("escondido");
    telaEntrada.classList.add("escondido");

    setTimeout(entraChat, 2000);
}

function entraChat(){
    
    //requisicao para entrar no chat
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario);

    //trata erro e sucesso
    promise.catch(trataErroEntrada);
    promise.then(trataSucessoEntrada);
}

function trataErroEntrada(error){
    
    //mensagens diferentes para erros diferentes
    let primeiroP = document.querySelector(".tela-entrada p");
    let segundoP = document.querySelector(".tela-entrada p:nth-child(3)")
    
    //erro de nome em branco  /  erro de nome repetido
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

function trataSucessoEntrada(){
    
    //esconde tela de entrada e mostra tela principal do chat
    document.querySelector(".gif").classList.add("escondido");
    document.querySelector(".container").classList.remove("escondido");
    manterConexao();            //"avisar" que ainda está online
    carregaMensagens();         //carrega as mensagens logo quando entra
    carregarMensagens3s();      //ajusta timer de 3s para atualizar mensagens
    carregaParticipantes();     //carrega participantes logo quando entra
    carregaParticipantes10s();  //ajusta timer de 10s para atualizar participantes
    exibeConfigMensagem1s();
}

function manterConexao(){
    //avisa a cada 5 segundos que o usuario ainda está online
    conexaoID = setInterval(function (){
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario);
    }, 5000);
}

function carregarMensagens3s(){
    //atualiza mensagens a cada 3 segundos
    mensagensID = setInterval(carregaMensagens, 3000);
}

function carregaMensagens(){
    //carrega mensagens
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderizaMensagens);

}

function renderizaMensagens(response){
    arrMensagens = response.data;
    
    //zera mensagens e imprime novamente com as novas mensagens 
    document.querySelector(".conteudo").innerHTML = "";
    for(let i = 0; i < arrMensagens.length; i++){
        imprimeMensagem(arrMensagens[i]); 
        document.querySelector(".conteudo div:last-child").scrollIntoView();   
    }
}

function imprimeMensagem(mensagem){
    //layouts diferentes para cada tipo de mensagem

    let espacoMensagens = document.querySelector(".conteudo");
    
    if(mensagem.type === "status"){
        espacoMensagens.innerHTML += `<div class="message status"><span class="horario">(${mensagem.time})</span><span class="from">${mensagem.from}</span>${mensagem.text}</div>`
    }else if(mensagem.type === "message"){
        espacoMensagens.innerHTML += `<div class="message"><span class="horario">(${mensagem.time})</span><span class="from">${mensagem.from}</span>para<span class="to">${mensagem.to}:</span><span class="text">${mensagem.text}</span></div>`
    }else if(mensagem.type === "private_message"){
        espacoMensagens.innerHTML += `<div class="message private_message"><span class="horario">(${mensagem.time})</span><span class="from">${mensagem.from}</span>reservadamente para<span class="to">${mensagem.to}:</span><span class="text">${mensagem.text}</span></div>`
    }
}

function enviarMensagem(){
    //cria objeto mensagem que será enviado e faz a requisição para enviar

    let input = document.querySelector(".footer input");
    let mensagemDigitada = input.value;
    input.value = "";
    let tipo;

    if(visibilidadeSelecionada === "Público"){
        tipo = "message";
    }else{
        tipo = "private_message";
    }


    let mensagem = {
        from: nomeUsuario.name,
        to: nomeSelecionado,
        text: mensagemDigitada,
        type: tipo
    }

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem); 

    //trata sucesso e falha
    promise.catch(windowReload);
    promise.then(carregaMensagens);
}

function windowReload(){
    window.location.reload();
}

function selecionaVisibilidade(elemento){
    //seleciona visibilidade que o usuário deseja para a mensagem (pública ou privada)
    visibilidadeSelecionada = elemento.querySelector("p").innerHTML;
    if(elemento.classList.contains("selecionado")){
        return;
    }else{
        let selecionadoAntes = document.querySelector(".visibilidade").querySelector(".selecionado");

        selecionadoAntes.classList.remove("selecionado");
        elemento.classList.add("selecionado");

        selecionadoAntes.querySelector("img:last-child").classList.add("escondido");
        elemento.querySelector("img:last-child").classList.remove("escondido");
    }
}

function carregaParticipantes10s(){
    //atualiza participantes a cada 10 segundos
    participantesID = setInterval(carregaParticipantes, 10000);
}

function carregaParticipantes(){
    //faz requisição para saber os usuários online
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(renderizarParticipantes);
}

function renderizarParticipantes(response){
    //exibe usuários no menu lateral

    arrParticipantes = response.data;
    let contatos = document.querySelector(".contatos");
    let continuaOnline = false;

    for(let i = 0; i < arrParticipantes.length; i++){
        if(arrParticipantes[i].name === nomeSelecionado){
            continuaOnline = true;
        }
    }
    
    if(continuaOnline === false){
        nomeSelecionado = "Todos";
    }

    //primeiro ciclo (default)
    if(nomeSelecionado === "Todos"){
        contatos.innerHTML = `
        <div class="opcao selecionado" onclick="selecionaParticipante(this)">
            <img src="Imagens/icon-pessoas.png"/>
            <p>Todos</p>
            <img src="Imagens/check.png" class="">
    </div>`;
    }else{//ciclos seguintes (usuário mudou quem recebe a mensagem)
        contatos.innerHTML = `
        <div class="opcao" onclick="selecionaParticipante(this)">
            <img src="Imagens/icon-pessoas.png"/>
            <p>Todos</p>
            <img src="Imagens/check.png" class="escondido">
    </div>`;
    }

    for(let j = 0; j < arrParticipantes.length; j++){
        imprimeParticipante(arrParticipantes[j], nomeSelecionado);
    }
}

function imprimeParticipante(participante, nomeSelecionado){
    //layout para exibir contato na tela

    let espacoContatos = document.querySelector(".contatos");

    if(participante.name === nomeSelecionado){
        espacoContatos.innerHTML += `<div class="opcao selecionado" onclick="selecionaParticipante(this)">
    <img src="Imagens/ImagemContato.png"/>
    <p>${participante.name}</p>
    <img src="Imagens/check.png" class="">
</div>`   
    }else{
        espacoContatos.innerHTML += `<div class="opcao" onclick="selecionaParticipante(this)">
    <img src="Imagens/ImagemContato.png"/>
    <p>${participante.name}</p>
    <img src="Imagens/check.png" class="escondido">
</div>`   
    }


}

function selecionaParticipante(participanteClicado){
    //adiciona classe selecionado ao participante desejado e retira do selecionado anterior
    
    nomeSelecionado = participanteClicado.querySelector("p").innerHTML;


    let espacoContatos = document.querySelector(".contatos");
    let selecionadoAnterior = espacoContatos.querySelector(".selecionado")
    
    selecionadoAnterior.classList.remove("selecionado");
    participanteClicado.classList.add("selecionado");

    selecionadoAnterior.querySelector("img:last-child").classList.add("escondido");
    participanteClicado.querySelector("img:last-child").classList.remove("escondido");
}

function configMensagem(){

    let configMens = document.querySelector(".footer p");

    configMens.innerHTML = `Enviando para ${nomeSelecionado} (${visibilidadeSelecionada.toLowerCase()})`
}

function exibeConfigMensagem1s(){
    configID = setInterval(configMensagem, 500);
}

function capturaClique(){
    document.querySelector(".footer input").addEventListener('keydown', verificaEnter);
}

function verificaEnter(){
    let tecla = event.keyCode;
    
    if(tecla === 13){
        enviarMensagem();
    }
}

