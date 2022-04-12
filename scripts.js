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