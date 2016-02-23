
var qs = null;
var flag_toogle_parlamentares = true;

function SetCookie(cookieName,cookieValue,nDays) {
	var today = new Date();
	var expire = new Date();
	if (nDays==null || nDays==0) nDays=1;
	expire.setTime(today.getTime() + 3600000*24*nDays);
	document.cookie = cookieName+"="+escape(cookieValue)
	+ ";expires="+expire.toGMTString();
}

function ReadCookie(cookieName) {
	var theCookie=" "+document.cookie;
	var ind=theCookie.indexOf(" "+cookieName+"=");
	if (ind==-1) ind=theCookie.indexOf(";"+cookieName+"=");
	if (ind==-1 || cookieName=="") return "";
	var ind1=theCookie.indexOf(";",ind+1);
	if (ind1==-1) ind1=theCookie.length;
	return unescape(theCookie.substring(ind+cookieName.length+2,ind1));
}

function colorThemeSapl(container) {
	$('.context-bg-color').addClass(container);
}

function contextBgColor(href) {
    if (href.indexOf('mtnm=mt') != -1)
		colorThemeSapl('container-materia');
	else if (href.indexOf('mtnm=nm') != -1) {
		if (href.indexOf('nm_tip_norma=27') != -1)
			colorThemeSapl('container-autografo');
		else
			colorThemeSapl('container-norma');
	}
	else if (href.indexOf('mtnm=dof') != -1)
		colorThemeSapl('container-diario-oficial');
	else if (href.indexOf('/sessao_plenaria/') != -1) {
		colorThemeSapl('container-sessao');
		$('.navbar.main a[href*=sessao_plenaria]').addClass('active');
	}
}




$(document).ready(function() {
    var firstItSidebar = true;
    var navtop = $('.navtop');
    var navprincipal = $('.nav.principal');
    var sidebar = $('#sidebar');
    var rodape = $('#rodape');
    var maincontainer = $('#main-container');
    maincontainer.css('min-height', window.innerHeight - navtop.height() - rodape.height());

	var activeSideBar = ReadCookie("activeSideBar")
	if (activeSideBar == null || activeSideBar == "") {
		activeSideBar = 2;
		sidebar.addClass('active-first');
        maincontainer.addClass('active-first');
	}

    window.onresize = function() {
        maincontainer.css('min-height', window.innerHeight - 56);
    };

    $( window ).scroll(function() {
        if (window.pageYOffset <= 400)
            $( "#sidebar" ).removeClass("fixed");
        else if ( ! $( "#sidebar" ).hasClass("fixed") )
            $( "#sidebar" ).addClass("fixed");
    });


    if (activeSideBar == 1) {
        sidebar.addClass('active-first')
        maincontainer.addClass('active-first')
    }

    $('.navbar-form .search').focusin(function() {
        navprincipal.addClass("focus-in-search");
        $('.navbar-form .form-filters').css('left',sidebar.width());
        $('.navbar-form .form-filters').addClass("active");

    }).focusout(function() {
        navprincipal.removeClass("focus-in-search");
        $('.navbar-form .form-filters').removeClass("active");
    });


    $('[data-toggle=sidebar]').click(function() {
        if (firstItSidebar && activeSideBar >= 1) {
            if (sidebar.hasClass('active-first')) {
                firstItSidebar = false;
                console.log(sidebar.css('left'));
                if (sidebar.css('left') == '-250px') {
                    sidebar.removeClass('active-first');
                    maincontainer.removeClass('active-first');
                    sidebar.toggleClass('active');
                    maincontainer.toggleClass('active');
                }
                else {
                    sidebar.removeClass('active-first');
                    maincontainer.removeClass('active-first');
                }
            }
        } else {
            sidebar.toggleClass('active');
            maincontainer.toggleClass('active');
        }

        if (sidebar.hasClass('active'))
            SetCookie("activeSideBar", 1, 30)
        else
            SetCookie("activeSideBar", 0, 30)

    });

	var href = location.href;

    contextBgColor(href);


    if ($('.dev').length > 0) {
        initSearch();
    }
});

function initSearch() {
    qs = $('#qs');
	var link = "http://sapl.camarajatai.go.gov.br/sapl/qs"
	var formData = {}
	var autoscroll= false;

    function colocaAjax(pos) {
    	jQuery(".ajax-"+pos).css('display', 'block');
    }

    function tiraAjax() {
    	jQuery(".ajax-Top").css('display', 'none');
    	jQuery(".ajax-Bottom").css('display', 'none');
    }

    function openLink(container, recursive) {
		formData['c'] = container;
		formData['random'] = Math.random();

		console.log(formData);
        jQuery.get(link, formData, function(data, event, event1) {


			if (autoscroll) {
				$( "#qs-1").append( data );
				autoscroll = false;
			}
			else {
				$( "#qs"+container ).html( data );
			}

			if (!recursive) {
				tiraAjax();
				return;
			}

			if (container == -1) {
				delete formData['q'];
			}

			if (-3 < container && container < 0)
				openLink(container - 1, recursive);
			else
				openLink(container -1, false);

			if (container == -2) {

				$('.toggle-parlamentares').hover(function() {
					if (flag_toogle_parlamentares) {
						setTimeout(function() {
							flag_toogle_parlamentares = false;
							$('.container-parlamentares').addClass('active');
							tiraAjax();
						}, 100);
						$(document).click(function() {
							$('.container-parlamentares').removeClass('active');
							flag_toogle_parlamentares = true;
						});
					}
			    });
			}


        }).fail(function() {
			tiraAjax();
		});
    }

    function qSearch(value) {
        colocaAjax("Top");

		formData = {
			'q' : $('#qs').val(),
		};

        openLink(-1, true)
    }


    qs.keyup(function(event) {
        if (!event.ctrlKey && event.keyCode == 13) {
			window.history.pushState(formData, "sapl", 'http://sapl.camarajatai.go.gov.br/sapl/qs?q='+$('#qs').val());
			$('html, body').animate({
            	scrollTop: 0
            }, 0);
			jQuery( "#qs-p" ).val(1)
            qSearch(qs.value)
        }
    });
	$('html, body').animate({
		scrollTop: 0
	}, 0);
	qSearch(qs.value)

	$( document ).scroll(function() {
		if ( !autoscroll && (document.documentElement.clientHeight+$( document ).scrollTop())*1.1 > $( document ).height()) {
			var page =  parseInt("0"+$( "#qs-p" )[0].value) + 1;

			if (page <= parseInt($( ".linkPageLast").attr('data'))) {
		    	autoscroll = true
			    colocaAjax("Bottom");
				jQuery( "#qs-p" ).val(page);
				openLink(page, false)
			}
		}
	});
}
