var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+
var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; // At least Safari 3+: "[object HTMLElementConstructor]"
var isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
var isIE8 = !-[1,]; // Internet Explorer 8 or below
var isEdge = !isIE && !!window.StyleMedia; // Edge 20+
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.csi); // Chrome 1+
var isBlink = (isChrome || isOpera) && !!window.CSS; // Blink engine detection

// Armaze a referência a todos os elementos visiveis de um determinado menu lateral.
var visibleMenuElements = "";
// Armazena qual elemento do menu está selecionado.
var elementSelected;
var h; // height
var posterContainer;

var c;

var scroll;
var height;
var quarter;
var pos;

var filename,
    fileContent,
    fileExtension,
    codeEl,
    codeContentToDownload;

var quizContainer;
var quizQuestionContainer;
var quizH4Counter;
var quizActiveQuestion;
var quizNextQuestion;
var quizH4;
var quizQuestionNumber;
var qn;
var answer;
var questionTotalPoints;
var quizResultScore;
var explain;

var position = $(window).scrollTop();
var currentTopBarPos = $(window).scrollTop();

// Conteúdo da pesquisa site.
var content = [
	{ category: 'Tutorial', title: 'Perl Syntax' },
	{ category: 'Tutorial', title: 'Perl Functions' },
	{ category: 'Tutorial', title: 'OOP in Perl: The Complete Guide' },
	{ category: 'Tutorial', title: 'Functional Programming in Perl' },
	{ category: 'Tutorial', title: 'Sub-routines in Perl' },
	{ category: 'Tutorial', title: 'Perl in a Nutshell' },
	{ category: 'Tutorial', title: 'Perl For Beginners' },
	{ category: 'Tutorial', title: 'Advanced Perl' },
	{ category: 'Tutorial', title: 'Perl: The Missing Guide For Beginners' },
	{ category: 'Tutorial', title: 'Poly in Perl' },
	{ category: 'Tutorial', title: 'Perl For Web Development' },
	{ category: 'Tutorial', title: 'How to use comment in Perl' },
	{ category: 'Reference', title: 'Perl Variables' },
	{ category: 'Book', title: 'How to create a CGI directory for Perl sites' },
	{ category: 'Tutorial', title: 'Perl and its value datas' }
];


// Translation english
var tr_en = {
	citation_copied  : "Citation Copied!",
	code_copied      : "Code Copied!",
	url_copied       : "Link Copied!",
	downloading_code : "Downloading Code..."
};

// Translation brazillian portuguese.
var tr_pt_br = {
	citation_copied  : "Citação Copiada!",
	code_copied      : "Código Copiado!",
	url_copied       : "Link Copiado!",
	downloading_code : "Baixando Código...",
    right_answer     : "Resposta Certa!",
    wrong_answer     : "Resposta Errada!"
};

// Para alterar o idioma das mensagens basta atribuir o objeto do idioma atual.
var lang = tr_pt_br;

// WINDOW EVENTS
// Quando a janela é redimensionada.
// Posso usar esse evento para ajustar o tamanho de imagens de links afiliados.
$( window ).resize(function() {
  // showHideMobileShareButtons();
});

$(window).scroll(function() {
    highlight();
    revealAd();

  	var scroll = $(window).scrollTop();

  	if (scroll > 0) {
    	$('#header').addClass("box-shadow");
  	} else {
    	$('#header').removeClass("box-shadow");
  	}

    // Rolando para baixa, esconde a barra superior
    if(scroll > position) {
    	$('#header').addClass('box-shadow');
        // Se a posição rolada pelo usuário for igual o topo anterior da barra mais 160 px
        // Isso evita que a barra superior suma assim que o usuário rolar para baixo.
        if (scroll > currentTopBarPos + 160) {
          // $('#back-to-top').hide();
        	$('#back-to-top').removeClass('back-to-top-down');
        	$('#header').addClass('nav-up');
        	// $('#top-dropdown').dropdown('hide');
        }
    } else { // Rolando para cima, mostra a barra superior
    	$('#header').removeClass('nav-up');

    	if (scroll < 100) {
        	// $('#back-to-top').hide();
        	$('#back-to-top').removeClass('back-to-top-down');
      	} else {
        	// $('#back-to-top').removeClass('back-to-top-down');
        	$('#back-to-top').addClass('back-to-top-down');
        	// $('#back-to-top').show();
      	}

    	currentTopBarPos = scroll;
    }
    position = scroll;
});

// Código de teclas como "'-+.*/
// keys = [192, 189, 187, 226, 188, 190, 191, 193, 219, 221, 220, 222, 194, 110, 111, 109, 106, 107];
$(window).keydown(function(e) {
  	// Reagir a combinações de teclas pode se tornar um inferno devido a compatibilidades e afins, esteja ciente disso
  	// Combinações de teclas usando CTRL é um péssima ideia pois alguns navegadores não permitem que o JavaScript cancele a ação padrão da tecla, a maioria dos atalhos dos navegadores começam com ctrl.
	inputFilter = $('.sidebar-menu.has-filter:visible').first().find('.menu-filter');
  	if (inputFilter) { // Tem uma caixa de filtro da barra lateral na tela (visivel)?
    	// O foco NÃO está dentro da caixinha?
    	if (!inputFilter.is(':focus')) {
      		// Foca na caixa e seleciona o conteúdo para ser substituido.
      		inputFilter.focus().select();
    	}
 	}

	// alt+shift+p --> abre a caixa de pesquisa.
	if (e.altKey && e.shiftKey && e.keyCode === 80) {
		$('#open-search')[0].click();
		return false
	}

	// Esc --> fecha a barra lateral ou o container de pesquisa.
	if (e.keyCode === 27) {
		if ($('.search-container:visible').length) {
			$('#close-search')[0].click();
			return false;
		} else if ($('.sidebar-container:visible').length) {
			$('.close-sidebar')[0].click();
			return false;
		}
	}

	// CTRL e seta para trás, volta para o menu principal.
	if (e.ctrlKey && e.keyCode === 37) {
        // Verifica se a menu principal está visivel, se estiver fecha a barra lateral.
        var isMainMenuVisible = $('#main-menu:visible').length;
        if (isMainMenuVisible) {
            closeSidebar();
            return false; // Evita que o opera volte para a página anterior.
        }

		// Caso o menu principal não esteja visivel, então fecha o atual e volta para o anterior.
		visibleSidebar = $('.sidebar-menu:visible').first();
        if (visibleSidebar.length) {
            // Clica na setinha de voltar do menu atual.
            visibleSidebar.find('.back-sidebar-menu')[0].click();
            return false; // Evita que o opera volte para a página anterior.
        }
	}


  	// 33 = pageup, 34 pagedown, 35 end, 36 home, 38 seta para cima, 40 seta para baixo.
  	// Opera de forma diferente somente na barra lateral.
  	if ([33, 34, 35, 36, 38, 40].indexOf(e.keyCode) !== -1) {
        // Tem uma barra lateral aberta?
        visibleSidebar = $('.sidebar-menu:visible').first();
        if (!visibleSidebar.length) {
          	// Não tem barra lateral aberta então as teclas se comportaram da maneira padrão.
			return true;
        }

    	e.preventDefault();

        // A lista de elementos visiveis foi resetada?
        if (visibleMenuElements === "") {
			// Pega os elementos da barra de menu visiveis.
			visibleMenuElements = visibleSidebar.find('.menu-item.navigable-item:visible')
        }

    	elementSelected = visibleSidebar.find('.menu-item.navigable-item.selected').first();

		// Tecla "end" pressionada.
		if (e.keyCode === 35) {
			elementSelected.removeClass('selected');
			// Seleciona o último elemento do menu.
			visibleMenuElements.last().addClass('selected').focus();
		} else if (e.keyCode === 36) { // Tecla "home" pressionada.
			elementSelected.removeClass('selected');
			// Seleciona o primeiro elemento do menu.
			visibleMenuElements.first().addClass('selected').focus();
		}

        // Seta para baixo
        if (e.keyCode === 40) {
        	var isSelected = false;
        	var breakOnNext = false;
        	var isLast = false;
        	var length = visibleMenuElements.length;

        	visibleMenuElements.each(function(index) {
            	elementSelected = $(this);

                if (breakOnNext) {
					return false; // Quebra o loop.
                }

                // O elemento atual tem a classe selected?
                if ($(this).hasClass('selected')) {
	            	elementSelected.removeClass('selected');
    	        	isSelected = true;
        	    	breakOnNext = true;

					if (index === (length - 1)) {
						isLast = true;
					}
            	}
        	});

			if (!isSelected || isLast) {
				elementSelected = visibleMenuElements.first();
			}

          	elementSelected.addClass('selected').focus();
        } else if (e.keyCode === 38) { // Seta para cima.
        	var isSelected  = false;
        	var breakOnNext = false;
        	var isFirst     = false;
        	var length      = visibleMenuElements.length;

        	visibleMenuElements.each(function(index) {
                // O elemento atual tem a classe selected?
                if ($(this).hasClass('selected')) {
                	$(this).removeClass('selected');
                	isSelected = true;

					if (index === 0) {
						isFirst = true;
					}

					return false
				}

            	elementSelected = $(this);
        	});

			if (!isSelected || isFirst) {
				elementSelected = visibleMenuElements.last();
			}

            elementSelected.addClass('selected').focus();
        }

        // Evita o comportamento padrão das teclas esquerda, direita, home, end, page up e page down.
        return false;
    }

	// Enter ativa o item que estiver posicionado sobre
    if (e.keyCode === 13) {
    	// Qualquer barra lateral, com caixa de filtro ou não.
    	visibleSidebar = $('.sidebar-menu:visible').first();
    	if (!visibleSidebar.length) {
    		return true; // Não tem barra lateral aberta? Manda enter para a página.
    	}

		// location.href = $(this).find('.menu-item.selected').attr('href');
		// [0] pega o elemento do próprio DOM e não um obj JQuery.
		visibleSidebar.find('.menu-item.navigable-item.selected')[0].click();
		return false;
	}
});


// EVENTOS DA BARRA LATERAL ESQUERDA.
// Setinha para voltar pressionada.
$(".back-sidebar-menu").click(function() {
	elementSelected = "";
	visibleMenuElements = "";

    // Esconde o menu atual
    $(this).closest('.sidebar-menu').css('display', 'none');

    var menuToGoBack = $(this).attr('data-menu-previous');

	// sideBarId = $(this).attr('data-menu');
	// Fecha o sub-menu
	// $('#' + sideBarId).css('display', 'none');

	// Mostra o menu principal
	$('#' + menuToGoBack).css('display', 'block');
	// Atualiza a coleção de elementos visiveis para o item atual.
	visibleMenuElements = $('#' + menuToGoBack).find('.menu-item.navigable-item:visible');
	// $('.menu-item').removeClass('selected');
});

// Um elemento do menu da barra lateral esquerda foi clicado.
$('.sub-menu').click(function() {
	sideBarId = $(this).attr('data-menu');
	// Mostra o menu relacionado com o item que foi clicado.
	$('#' + sideBarId).css('display', 'block');
	// Atualiza a coleção de elementos visiveis para o item atual.
	visibleMenuElements = $('#' + sideBarId).find('.menu-item.navigable-item:visible');
	// Foca na caixa de filtrar elementos
	$('#' + sideBarId + ' > .item > .ui.form > .field > .ui.calendar > .ui.input.left.icon > .menu-filter').focus().select();
	// Esconde o menu atual depois de abrir o posterior)
    $(this).closest('.sidebar-menu').css('display', 'none')
});

// Quando a sobreposição da barra lateral for clicada fecha ela.
$('#sidebar-dimmer').click(function() {
	closeSidebar();
});

// Clique do X da barra lateral esquerda.
$('.close-sidebar').click(function() {
	closeSidebar();
});

// Quando um elemento do menu da barra lateral esquerda é clicado, coloca a classe "selected" nele.
$('.menu-item.navigable-item').click(function(e) {
    $(this).closest('.sidebar-menu').find('.menu-item.navigable-item').removeClass('selected');
    $(this).addClass('selected');
});

// Quando o valor muda dentro da caixinha de filtro da barra lateral filtra os elementos do menu.
$('.menu-filter').on("input propertychange", function() {
	// Remove a classe selected somento dos elementos do menu atual onde a pesquisa foi feita.
	$(this).closest('.sidebar-menu').find('.menu-item').removeClass("selected");

	// Filtra os elementos da lista.
	filterValue = $(this).val()
		.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentuação ("acao" é o mesmo que "ação")
        .toLowerCase(); // Transforma em miniscula, a comparação é case sensitive.


	// Vou usar a classe "menu-item" para pegar todo o conteúdo de sub-menus
  	$(this).closest('.sidebar-menu').find('.menu-item').each(function() {
    	t = $(this).text()
    		.normalize("NFD")
    		.replace(/[\u0300-\u036f]/g, "")
    		.toLowerCase();

    	// Achou um elemento com esse texto.
    	if (t.search(filterValue) > -1) {
      		$(this).show();
    	} else {
      		$(this).hide();
    	}
  	});

	// Remove os sub-menus que estiverem vazios
	$(this).closest('.sidebar-menu').find('.menu-with-header').each(function() {
		l = $(this).find('.menu-item.navigable-item:visible').length;
		if (l) {
			$(this).show();
		} else {
			// console.log($(this));
      		$(this).hide();
    	}
  	});

	// Seleciona o primeiro elemento da lista
	elementSelected = $(this).closest('.sidebar-menu').find('.menu-item.navigable-item:visible').first();
	elementSelected.addClass('selected');
	// Atualiza a coleção de elementos visiveis para o item atual.
	visibleMenuElements = $(this).closest('.sidebar-menu').find('.menu-item.navigable-item:visible');
});

// Clique na sobreposição da pesquisa ou no botão de fechar, fecha o container da pesquisa.
$('#search-dimmer, #close-search').click(function() {
	closeSearch();
});

// Clique no botão com a lupa na barra superior abre a pesquisa.
$('#open-search').click(function() {
	// Fecha o container da pesquisa se estiver aberto, senão um sobrepoe o outro
	closeSidebar();
	openSearch();
});

$("#back-to-top").click(function() {
	$("html, body").animate({ scrollTop: 0 }, "slow", function() {
		$('#back-to-top').removeClass('back-to-top-down');
    // $("#back-to-top").hide();
	});

	return false;
});

// EVENTOS DO POSTER.
// Botão de mostrar mais do poster contido na parte inferior da página.
$('.show-more').click(function() {
    posterContainer = $(this).closest('.poster-container');
    h = posterContainer.find('.poster-img').height();
    var showLessBt = posterContainer.find('.show-less');

    posterContainer.height(h + 92);

    // Mostra o botão "mostrar menos" e esconder o botão mostrar mais
    $(this).hide();
    showLessBt.show();
});

// Botão "mostrar menos" do container do poster.
$('.show-less').click(function() {
    posterContainer = $(this).closest('.poster-container');

    $("html, body").animate(
        // Rola a página até o topo do título h2 do .poster-container
        { scrollTop: posterContainer.prev('h2').offset().top - 100 },
        "slow",
        function() {
            posterContainer.height(200);
        }
    );

    // Esconde o botão "mostrar menos"
    $(this).hide();
    // Mostra o botão "mostrar mais"
    posterContainer.find('.show-more').show();
});

// EVENTOS DA CAIXA DE CITAÇÃO DA PÁGINA.
// Copia o conteúdo da citação
$('.copy-citation').click(function() {
    clipboard.writeText($(this).closest('.citation').find('.tab.active').text().trim('\n'));
    $('body').toast({
        message: lang.citation_copied,
        showProgress: 'bottom',
        position: 'bottom center'
    });
});

// EVENTOS DA MENSAGEM SUPERIOR.
// Fecha o aviso superior de propaganda para curso.
$('.close-message').click(function() {
	$(this).closest('.message__container').hide();
});


// QUANDO O DOCUMENTO ESTIVER PRONTO.
$(document).ready(function() {
    // showHideMobileShareButtons();
    // $('').dropdown();

    bindEvents();
	formatDates();
    cleanURL();
    currentSidebarMenu();
});

// Mostra o menu lateral esquerdo atual dependendo da página.
function currentSidebarMenu() {
    const windowPathName = window.location.pathname
    var link;
    link = $(".sidebars a[href='"+ windowPathName +"']")
    if (link.length) {
        $(".sidebar-menu").hide();
        link.closest(".sidebar-menu").show();
        link.addClass("active selected");

        // Esse hack horroroso é para poder roalar o elemento do menu lateral esquerda para o view já que se o menu estiver com "display none" a função "scrollParentToChild" não funciona.
        $("#sidebar-dimmer").hide();
        $(".sidebar-container").attr("left", "-270px");
        $(".sidebars").attr("left", "-270px");
        $(".sidebar-container").show();

        // Funciona mas apenas se a barra lateral estiver visível
        var parentElement = link.closest(".ui.vertical.menu")[0]
        var childElement = link.get(0);
        scrollParentToChild(parentElement, childElement)

        // Volta o menu lateral esquerdo para o seu formato original depois do hack horroroso ali de cima.
        $(".sidebar-container").hide();
        $(".sidebar-container").attr("left", "270px");
        $(".sidebars").attr("left", "270px");
        $("#sidebar-dimmer").show();
    }

    // var activeRightSidebarLink = $(".right-sidebar-menu a.navigable-item.active");
    link = $(".right-sidebar-menu a[href*='"+ windowPathName +"']")
    if (link.length) {
        link.addClass("active selected");
        var parentElement = link.closest(".ui.vertical.menu")[0]
        var childElement = link.get(0);
        scrollParentToChild(parentElement, childElement)
    }
}

// https://stackoverflow.com/questions/45408920/plain-javascript-scrollintoview-inside-div
function scrollParentToChild(parent, child) {

  // Where is the parent on page
  var parentRect = parent.getBoundingClientRect();
  // What can you see?
  var parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth
  };

  // Where is the child
  var childRect = child.getBoundingClientRect();
  // Is the child viewable?
  var isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);

  // if you can't see the child try to scroll parent
  if (!isViewable) {
        // Should we scroll using top or bottom? Find the smaller ABS adjustment
        const scrollTop = childRect.top - parentRect.top;
        const scrollBot = childRect.bottom - parentRect.bottom;
        if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
            // we're near the top of the list
            parent.scrollTop += scrollTop;
        } else {
            // we're near the bottom of the list
            parent.scrollTop += scrollBot;
        }
  }
}

// Remove os parâmetros da URL (não remove quando a URL é a /search/)
function cleanURL() {
    // var newUrl = window.location.origin + window.location.pathname
    if (window.location.pathname.indexOf("/search/") == -1 && window.location.pathname.indexOf("/download/") == -1) {
        var newUrl = window.location.href.split("?")[0]
        window.history.replaceState({}, document.title, newUrl);
    }
}

function bindEvents() {
    // Inicializa os accordions da página. https://fomantic-ui.com/modules/accordion.html
    // $('.ui.accordion').accordion();

    $(".ui.accordion").accordion();

    $(".dropdown").dropdown({
        onChange: function (val) {
            $("#download-link").attr("href", val);
        }
    });

    $("#open-sidebar").click(function() {
        $('.ui.sidebar')
            .sidebar("setting", "transition", "overlay")
            .sidebar('toggle')
        ;
    });

    // Inicializa as tabs da página. https://fomantic-ui.com/modules/tab.html
    $('.menu .item').tab({
        silent: true
    });
    // Inicializa os dropdown da página. https://fomantic-ui.com/modules/dropdown.html
    // $('.ui.dropdown, #top-dropdown').dropdown();
    // Inicializa os tool tips da página. https://fomantic-ui.com/modules/popup.html#tooltip
    // Tool-tip, inline true para colocar tooltips nos elementos fixados.
    if (typeof $().popup !== "undefined") {
        $(".html-popup, .tooltip").popup({
            inline: true,
            hoverable: true,
            delay: {
              show: 600,
              hide: 600
            }
        });
    }

    // Inicializa os ratings da página. https://fomantic-ui.com/modules/rating.html
    // Ratings só estão aparecendo nas propagandas dos livros por enquanto.
    // $('.ui.rating').rating();

    // Ads sticky só devem ser usados com o ezoic e não com o adsense.
    // $('.ui.sticky').sticky({offset: 60});

    initializeCodeBlocks();
    highlight();
    bindExerciseEvents();
    initializeQuiz();
    bindAnchors();

    // A função Lazy existe nesse escopo?
    if (typeof $.Lazy !== "undefined") {
        loadImages();
        loadIframes();
        loadYTVideo();
    }

    if (typeof infiniteScrolling !== 'undefined')
        bindPageDivider();
    if (typeof window.Sharer !== 'undefined')
        window.Sharer.init();
}

// Add anchors on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function(event) {
    bindAnchors();
});

function bindAnchors() {
    if (typeof anchors !== 'undefined') {
        anchors.add("h2, h3");
    }

    // Copia o link da âncora para a memória.
    // No final do url antes do sinal # é necessário remover a barra última / caso contrário se a url tiver o formato /#ancora, o browser não pula para o local correto.
    var toast;
    $(".anchorjs-link").not('.parsed').click(function(e) {
        // e.preventDefault();
        var anchor = $(this).attr("href");
        // Âncora sem a barra trailing do final
        // var url = window.location.origin + window.location.pathname.replace(/\/+$/, '') + anchor
        // Deixando a última barra no link, dentro de uma aba nova funciona normalmente.
        var url = window.location.origin + window.location.pathname + anchor
        clipboard.writeText(url);

        $('#share-toast > .content > .share-buttons a').each(function() {
            $(this).attr("data-url", url.trim());
        });

        if (typeof toast !== "undefined") {
            toast.toast("close");
        }
        toast = $('#share-toast').toast({
            position: 'bottom center',
            displayTime: 0,
            closeIcon: true
        });

        if (typeof window.Sharer !== 'undefined')
            window.Sharer.init();

    }).addClass('parsed');
}

////////////////////////////////////////////////////////////////
//// FUNCTIONS
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
//// COPY AND DOWNLOAD CODE
////////////////////////////////////////////////////////////////
function downloadCode(filename, content, extension="txt") {
	var textToWrite = '\ufeff' + content.replace(/\n/g, "\r\n");
	var textFileAsBlob = new Blob([textToWrite], {type:'text/csv'});

	if (!filename) {
		// Local da página (somente a última parte) + data + -script.pl
		filename = location.pathname.match(/([^\/]+)(?=\.\w+$)/)[0] + "-" + Date.now() + "-script"
	}

	var downloadLink = document.createElement("a");
	downloadLink.download = filename + '.' + extension;
	downloadLink.innerHTML = "Download File";

	// http://stackoverflow.com/a/9851769
	if (isIE || isEdge) {
		navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs);
	}

	if (isChrome || isBlink) {
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		downloadLink.click();
	}

	if (isFirefox) {
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}
}

function initializeQuiz() {
    // EVENTOS DO QUIZ
    $('a.quiz-restart-button.parse-me').click(function() {
        // Pegar o container com a classe quiz-container mais próximo --> acima.
        quizContainer = $(this).closest('.quiz-container');
        quizContainer.find('.quiz-question-container')
                     .removeClass('answered')
                     .removeClass('quiz-active-question')
                     .first()
                     .addClass('quiz-active-question');
        quizContainer.find('.quiz-result').hide();
        // Pontuação
        quizContainer.find('.quiz-result > p > .quiz-correct-answers').text('0');

        quizH4Counter = quizContainer.find('.quiz-question-counter');

        // Contador de perguntas.
        quizH4Counter.find('span.quiz-question-number').text('1')
        quizH4Counter.show();
    }).removeClass('parse-me');


    $('a.quiz-next-question-button.parse-me').click(function(e) {
        // Pegar o container com a classe quiz-container mais próximo --> acima.
        quizContainer = $(this).closest('.quiz-container');
        quizContainer.find('.quiz-next').hide();

        // Achar a primeira div com a classe "quiz-active-question".
        quizActiveQuestion = quizContainer.find('.quiz-active-question');
        quizNextQuestion = quizActiveQuestion.next('.quiz-question-container');
        quizH4 = quizContainer.find('.quiz-question-counter');
        quizQuestionNumber = quizH4.find('span.quiz-question-number');

        // Existe uma próxima questão?
        quizActiveQuestion.removeClass('quiz-active-question');
        if (quizNextQuestion.length) {
            qn = parseInt(quizQuestionNumber.text());
            quizQuestionNumber.text(qn + 1);

            quizNextQuestion.addClass('quiz-active-question');
        } else {
            quizH4.hide();
            quizContainer.find('.quiz-result').show();
        }
        quizActiveQuestion.find('.quiz-answer').removeClass('correct').removeClass('incorrect');
    }).removeClass('parse-me');

    $('a.quiz-answer.parse-me').click(function(e) {
        e.preventDefault();
        answer = $(this);

        quizQuestionContainer = answer.closest('.quiz-question-container');
        // A questão já foi respondida.
        if (quizQuestionContainer.hasClass('answered')) {
          return false;
        }

        quizContainer = answer.closest('.quiz-container');
        // Pegar o total de pontos que a questão vale.
        questionTotalPoints = answer.attr('data-points');

        quizResultScore = quizContainer.find('.quiz-result > p > .quiz-correct-answers');
        // Pegar o total de pontos desse quiz
        // Somar o total de pontos com o total de pontos da questão
        // Atualizar o score.
        quizResultScore.text(parseInt(quizResultScore.text()) + parseInt(questionTotalPoints));


        // Colocar a classe de correto ou incorreto na questão.
        answer.addClass(answer.attr('data-class'));

        explain = answer.attr('data-text');
        // Pegar o data-text explicando a resposta
        // Setar o p de resposta com o data-text captura anteriormente.
        quizContainer.find('.quiz-next > .quiz-explain-answer').text(explain);
        // Mostra o container do next.
        quizContainer.find('.quiz-next').show();
        // Desabilita as respostas para que o usuário não possa ficar clicando.
        quizQuestionContainer.addClass('answered');
    }).removeClass('parse-me');
}

// Destaca parte do conteúdo da página com uma animação, como se estivesse usando uma caneta marcadora amarela (ou a cor que você escolher).
function highlight() {
    scroll = $(window).scrollTop();
    height = $(window).height();
    quarter = (height / 2) / 2;

    $(".highlight").each(function(){
        pos = $(this).offset().top;
        if (scroll + height >= pos + quarter) {
            // Coloca o bg para destacar o texto.
            $(this).addClass("highlighted");
        }
    });
}

// Revela o container do ad com uma animação no estilo do G1.com.
function revealAd() {
    scroll = $(window).scrollTop();
    height = $(window).height();
    // O ad é revelado quando ele atinge um quarto da parte de baixo da tela.
    var half = height / 2;
    quarter = (height / 2) / 2;

    $('.ad-reveal-container').each(function(){
        pos = $(this).offset().top;
        h = $(this).find('.ad-reveal').height();
        if (scroll+height >= pos + half) {
            $(this).height(h);
        }
    });
}

// Carrega imagens e pictures de forma dinâmica para não sobrecarregar a página.
function loadImages() {
    $('.lazy-img').Lazy({
		// imageBase: '/assets/img/',
		effect: 'fadeIn',
		effectTime: 1000,
		// called after an element was successfully handled
		afterLoad: function(element) {
			// Remove a animação do loader da imagem
			// element.height(element.closest('.img-lazy-container').find('.image-placeholder').height());

			element.removeClass('unloaded');
		}
	});

    // Carrega os thumbnails que aparecem usando o scroll da página
    $(".lazy-thumbnail").Lazy({
        effect: 'fadeIn',
        effectTime: 1000
    });

    // alterna e liga o evento de scroll da div "lightgallery" para carregar as imagens.
    $("#lightgallery").scroll(function() {
        // console.log("div scrolled");
        $(".lazy-thumbnail").Lazy({
            scrollDirection: 'both',
            appendScroll: '#lightgallery',
            effect: 'fadeIn',
            effectTime: 1000
        });

        // $(this).unbind();
    });
}

function loadIframes() {
    $("iframe.output").Lazy({
        afterLoad: function(element) {
            // Ajusta a altura do iframe para 100% relativo ao conteúdo interno.
            element = element.get(0);
            element.style.height = 0;
            element.style.height = element.contentWindow.document.body.scrollHeight + 'px';
        }
    });
}

// Carrega de forma dinâmica vídeos do youtube.
function loadYTVideo() {
    $('iframe.lazy-yt.unloaded').lazy({
        afterLoad: function(element) {
            // Evita que eu coloque elementos que já foram carregados novamente na instância.
            element.removeClass('unloaded');
        }
    });
}

// Mostra os botões de compartilhamento referentes ao celular como whatsapp e telegram.
function showHideMobileShareButtons() {
	$('.mobile-share').addClass('display-none');
	if ($(window).width() < 768) {
		$('.mobile-share').removeClass('display-none');
	}
}

// Fecha o menu lateral esquerdo.
function closeSidebar() {
	$(".sidebar-container").css('display', 'none');
	// $("body").css("overflow", "visible");
}

// Abre a sobreposição com a caixinha do pesquisar.
function openSearch() {
	// $("body").css("overflow", "hidden");
	$(".search-container").css('display', 'block');
    // $('#search-input').focus().select();
	$(".search-container input[name*='search']").focus().select();
}

// Fecha a sobreposição da caixinha do pesquisar.
function closeSearch() {
	$(".search-container").css('display', 'none');
	// $("body").css("overflow", "visible");
}

// Formata os blocos de código da página, usando somente a tag pre, se usar "code" buga os códigos de exercicios, tem alguma coisa com o JQuery que não se comporta muito bem com a tag "code".
function initializeCodeBlocks() {
    // Destaca a sintaxe de cada bloco de código
    document.querySelectorAll('pre > code.parse-me').forEach((block) => {
        hljs.highlightElement(block);
        block.classList.remove("parse-me");
    });

    // EVENTOS DO CONTAINER DE CÓDIGO.
    // Botão de copiar o código do container.
    $('.copy-code.parse-me').click(function() {
        // clipboard.writeText($(this).closest('pre').find('code').text());
        clipboard.writeText($(this).closest('.code-block').find('code').text());
        $('body').toast({
            title: "Sucesso",
            message: lang.code_copied,
            showProgress: 'bottom',
            position: 'bottom center',
            class: 'success'
        });
        // c = $(this).closest('pre').find('code')
    }).removeClass('parse-me');

    // Botão de download do código do container.
    $('.download-code.parse-me').click(function() {
        codeEl        = $(this).closest('.code-block').find('code');
        codeContentToDownload = $(this).closest('.code-block').find('.code-to-download');
        filename      = codeEl.attr('data-filename') || "";
        fileExtension = codeEl.attr('data-fileExtension') || "txt";
        // fileContent   = codeEl.text();
        fileContent   = codeContentToDownload.text();
        downloadCode(filename, fileContent, fileExtension);
        $('body').toast({
            title: "Sucesso",
            message: lang.downloading_code,
            showProgress: 'bottom',
            position: 'bottom center',
            class: "success"
        });
    }).removeClass('parse-me');
}

// Retorna exatamente a largura de um texto em pixels.
// Usado para gerar a caixinha de substituição de código nos exercícios no tamanho exato do texto de resposta.
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

// Anexa os métodos das caixas de exercícios.
function bindExerciseEvents() {
	// Caixinhas de resposta dos exercícios.
	$(".inline-input.parse-me").each(function(index) {
		// Configura a largura da caixinha de acordo com o tamanho do texto da resposta.
		s = getTextWidth($(this).attr("data-answer"), "16px monospace");
		$(this).css("width", s).removeClass("parse-me");
	}).on("keyup", function() {
		// Remove a classe de erro quando digitado dentro da caixinha
		$(this).removeClass("wrong");
	});

	// Mostra as respostas corretas do exercício.
	$('.show-answer.parse-me').click(function() {
		elPre = $(this).closest('.exercise').find('pre');
		elPre.find('.right-answer').css('display', 'inline-block');
		elPre.find('.inline-input').css('display', 'none');
  	}).removeClass("parse-me");


	// Reseta as caixinhas do exercício para o usuário refazê-lo.
	$('.redo.parse-me').click(function() {
		elPre = $(this).closest('.exercise').find('pre');
		elPre.find('.right-answer').css('display', 'none');

        elPre.find('.inline-input')
         	 .val('')
         	 .removeClass('wrong')
         	 .css('display', 'inline-block')
         	 .first()
         	 .focus();
  	}).removeClass("parse-me");

  	// Limpa o conteúdo das caixas do exercício e coloca o foco no primeiro input.
  	$(".clear-text.parse-me").click(function() {
    	$(this).closest(".exercise")
      		   .find('pre')
      		   .find('.inline-input')
      	       .val("")
      	       .first()
      	       .focus();
	}).removeClass("parse-me");

	// Botão de corrigir pressionado
	// - Quando o usuário acertar colocar a resposta no lugar em verde, substituir o text box pelo span com a resposta, quando o usuário errar colocar a caixanha em vermelho e explicar em baixo o porque do erro.
    var msg = "";
	$(".check-answers.parse-me").click(function() {
  		$(this).closest('.exercise')
  			.find('pre')
  			.children('.inline-input')
  			.each(function(index) {
                if ($(this).val().trim() === "") {
                    msg = "A caixinha está em branco!";
                } else {
                    msg = $(this).val();
                }
    	       	// Diferente? Resposta errada.
    			if ($(this).val() != $(this).attr("data-answer")) {
      				$(this).removeClass("wrong");
      				$(this).addClass("wrong");
      				$('body').toast({
                        title: lang.wrong_answer,
                        message: msg,
                        showProgress: 'bottom',
                        position: 'bottom center',
                        class: 'error'
                    });
    			} else {
      				$(this).css("display", "none");
      				$(this).prev(".right-answer").css("display", "inline-block");
                    $('body').toast({
                        title: lang.right_answer,
                        message: msg,
                        showProgress: 'bottom',
                        position: 'bottom center',
                        class: 'success'
                    });
    			}
        // s = getTextWidth($(this).attr("data-answer"), "14px monospace");
        // $(this).css("width", s);
		  	});
	}).removeClass("parse-me");
}

function bindPageDivider() {
    var waypoints = $('.page-divider').waypoint({
      handler: function(direction) {
        var previousURL = this.element.getAttribute("data-previous-url");
        var previousTitle = this.element.getAttribute("data-previous-title");
        var nextURL = this.element.getAttribute("data-next-url");
        var nextTitle = this.element.getAttribute("data-next-title");

        if (direction === 'up') {
            window.history.pushState({page: 1}, "null", previousURL);
            $(document).prop('title', previousTitle);
        } else {
            window.history.pushState({page: 1}, "null", nextURL);
            $(document).prop('title', nextTitle);
        }
      },
      offset: '50%'
    });
}

// Coloca a data atual nas abas de citações.
function formatDates() {
	const now = new Date(Date.now());
	var day = now.getDate();

	var options = { month: 'short'};
	var month = new Intl.DateTimeFormat('pt-BR', options).format(now);
	var year = now.getFullYear();

	$(".day-number").html(day);
	$(".year-number").html(year);
	$(".month-abbr").html(month);
}
