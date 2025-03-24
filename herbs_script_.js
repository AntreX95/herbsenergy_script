(function() {
  function loadSnippets(n) { return tb.ajax.loadSnippets(n).then(function(n) { for(let t in n) n[t] = n[t].prop("outerHTML"); return n }) } var oneTime = tb.dom.oneTime, trimHtml = tb.dom.trimHtml, debounce = tb.common.debounce, hookAjaxDone = tb.hooks.hookAfterAjaxDone, slugify = tb.common.slugify; function ajaxGetSafe(n) { return tb.ajax.loadFragment(n, !0) } function hookBeforeShoptetFn(n, t) { document.addEventListener(n, function() { var e = shoptet.scripts.arguments[n]; t.apply(null, e) }) } function legacyLoadSnippets(n, t) { tb.ajax.loadSnippets(n).then(function(n) { return waitForModules().then(function() { return n }) }).then(function(n) { t.apply(null, n.map(function(n) { return [n] })) }) } function mobileSlick(n, t) { if((n = $(n)).length) { var e = null; $(window).resize(o), o() } function o() { var o = 767 > $(window).width(); o !== e && (o ? n.slick(t) : e && n.slick("destroy"), e = o) } } function tabletSlick(n, t) { if((n = $(n)).length) { var e = null; $(window).resize(o), o() } function o() { var o = 1024 > $(window).width(); o !== e && (o ? n.slick(t) : e && n.slick("destroy"), e = o) } } ajaxGetSafe = tb.ajax.loadFragment; var ajax = tb.ajax; function loadAndOpenModal(n, t, e) { return e = (e = e || "lg").slice(0, 1).toUpperCase() + e.slice(1).toLowerCase(), ajaxGetSafe(n).then(function(n) { var o = n.find(t); o.length && shoptet.modal.open({ html: shoptet.content.colorboxHeader + o.html() + shoptet.content.colorboxFooter, width: shoptet.modal.config["width" + e], className: shoptet.modal.config["class" + e], onComplete: function() { $(".colorbox-html-content img").unveil(), $("body").removeClass(shoptet.config.bodyClasses), $(".overlay").length > 0 && $(".overlay").detach(), setTimeout(function() { shoptet.modal.shoptetResize() }, 1) } }) }) } var hooks = function(n) { function t(t, e) { var o, i, a = "string" == typeof t ? (o = n, (i = t).split(".").reduce(function(n, t) { return void 0 === n ? n : n[t] }, o)) : t; if("function" != typeof a) throw Error(t + " is not a function"); function r() { return e(a, arguments, this) } return "string" == typeof t && function n(t, e, o) { for(var i, a = e.split("."); i = a.shift();)a.length ? t = t[i] : t[i] = o }(n, t, r), r } return $.fn.randomize = function(n) { return (n ? this.find(n) : this).parent().each(function() { $(this).children(n).sort(function() { return Math.random() - .5 }).detach().appendTo(this) }), this }, { hookFn: t, hookBeforeShoptetFn: function n(t, e) { document.addEventListener(t, function() { var n = shoptet.scripts.arguments[t]; e.apply(null, n) }) }, hookAfterShoptetFn: function n(t, e) { var o = shoptet.scripts.customCallbacks[t]; o || (o = function n() {}), shoptet.scripts.customCallbacks[t] = function(n) { o(n), e(n) } }, hookAfterAjaxDone: function n(e, o) { t("$.ajax", function(n, i, a) { var r = i[0], s = n.apply(a, i); return r.url === e && (s.done = t(s.done, function(n, t, e) { return (t = [].slice.call(t)).push(o), n.apply(e, t) })), s }) }, hookShoptetImmediate: function n(t, e, o) { for(let i of(o ? o instanceof $ && (o = o[0]) : o = document, "string" == typeof t && (t = [t]), t)) o.addEventListener("Shoptet" + i, e); e() } } }(window), pendingModules = 0, afterModulesReady = [], Module = { snippets: {}, init: function() { var n = this; ++pendingModules, loadSnippets(this.snippets).then(function(t) { if(n.snippets = t, n.snippetsLoaded && n.snippetsLoaded(), n._bindShoptetEvents(), !--pendingModules) { var e = afterModulesReady; for(let o of(afterModulesReady = [], e)) o() } }), n.bindEvents && n.bindEvents(), n.documentReady && $(document).ready(this.documentReady.bind(this, this.snippets)) }, _bindShoptetEvents: function() { for(var n of shoptet.scripts.availableDOMLoadEvents) { var t = n.replace(/^ShoptetDOM(.)/, function(n, t) { return t.toLowerCase() }); this[t] && ($(document).on(n, this[t].bind(this, this.snippets)), this[t](this.snippets)) } } }; function waitForModules() { return new Promise(function(n) { if(!pendingModules) return n(); afterModulesReady.push(n) }) }

  // ======================== LAYOUT ========================

  var Layout = Object.create(Module);
  Layout.snippets = {
    //emptySearch: "empty-search.html?v=0.1",
    //emptyCartInner: "empty-cart-inner.html?v=0.1",
  };

  Layout.documentReady = function() {
    //hookAjaxDone("/action/ProductSearch/ajaxSearch/", this.searchLoaded.bind(this));
    //this.searchLoaded();
    //this.initSearch();
    this.initModalLinks();
    this.initLoginWidget();
  };

  Layout.initRefBlockNew = function() {
    var $inner = $(".heureka-block-new .heureka-inner"),
      $rate = $(".heureka-block-new .number, .heureka-block-new h4"),
      $starsLabel = $(".heureka-block-new .stars-block a span"),
      $rateNumber = $(".heureka-block-new .stars-block h4")

    if(!$inner.length)
      return;

    tb.ajax.loadDocument("/hodnoceni-obchodu/").then(function($page) {
      var $block = $page.find(".content-inner #ratingWrapper"),
        $ratein = $page.find(".content-inner #ratingWrapper .rate-average"),
        $rateLabelin = $page.find(".content-inner #ratingWrapper .rate-average"),
        $starsLabelin = $page.find(".content-inner #ratingWrapper .stars-label").text().trim().split(' ')[0],
        $votes = $page.find(".content-inner>.votes-wrap:not(.admin-response)>.vote-wrap");

      $votes.slice(3).remove();

      $starsLabel.prepend($starsLabelin);
      $rate.append($ratein);
      $inner.append($votes);


      $(".vote-wrap").each(function(index, element) {
        $(this).find(">.vote-header").insertAfter($(this).find(">.vote-content"));
        $(this).find(".stars").insertBefore($(this).find(">.vote-content"));
      });


      var $average = $(".heureka-block-new .stars-block h4 .rate-average");
      if($average.length) {
        var averageNum = parseFloat($average.text().trim().replace(/,/, "."));
        $average.text(Math.round(averageNum / 5 * 100));
      }

      $inner.trigger('DynamicContentLoaded')
    });
  };

  Layout.initRefBlockX = function() {
    var $inner = $(".heureka-block .heureka__inner"),
      $rate = $(".heureka-block .heureka__top .heureka__number"),
      $starsLabel = $(".heureka-block .heureka__title a span"),
      $stars = $(".heureka-block .heureka__top .heureka__stars");


    if(!$inner.length)
      return;

    tb.ajax.loadDocument("/hodnoceni-obchodu/").then(function($page) {
      var $block = $page.find(".content-inner #ratingWrapper"),
        $ratein = $page.find(".content-inner #ratingWrapper .rate-average"),
        $starsLabelin = $page.find(".content-inner #ratingWrapper .stars-label"),
        $starsin = $page.find(".content-inner .rate-average-inner .stars"),
        $wrapper = $page.find(".content-inner>.votes-wrap:not(.admin-response)>.vote-wrap");

      /*$wrapper.children().filter(function() {
        return $(this).find(".stars .star-on").length < 4;
      }).remove();*/
      $wrapper.slice(8).remove();

      $starsLabel.prepend($starsLabelin);
      $rate.append($ratein);
      $stars.append($starsin);
      $inner.append($wrapper);

      var $average = $(".heureka-block .heureka__number");
      if($average.length) {
        var averageNum = parseFloat($average.text().trim().replace(/,/, "."));
        $average.text(Math.round(averageNum / 5 * 100));
      }

      $(".heureka-block .heureka__inner:not(.admin-response)>.vote-wrap").each(function(index, element) {
        $(this).find(">.vote-header").insertAfter($(this).find(">.vote-content"));
        $(this).find(".stars").insertBefore($(this).find(">.vote-content"));
        $(this).find(">.vote-header").wrapAll("<div class='stars-row'></div>");
      });

      $inner.trigger('DynamicContentLoaded')
    });
  };

  Layout.initRefBlock = function() {
    var $inner = $("body.in-index .heureka-here");
    if(!$inner.length)
      return;
    tb.ajax.loadDocument("/recenze/").then(function($page) {
      var $wrapper = $page.find(".heureka__inner");
      $inner.append($wrapper);

      $inner.trigger('DynamicContentLoaded');

    });
  };

  Layout.initRefBlockDetail = function() {
    var $inner = $("body.type-detail .rating-tab__top>div");
    if(!$inner.length)
      return;
    tb.ajax.loadDocument("/recenze/").then(function($page) {
      var $wrapper = $page.find(".heureka__number");
      $inner.append($wrapper);

      $inner.trigger('DynamicContentLoaded');

    });
  };

  Layout.initBlogBlock = function() {
    var $inner = $(".blog-block .inner");
    if(!$inner.length)
      return;
    tb.ajax.loadDocument("/cache/magazin/").then(function($page) {
      var $wrapper = $page.find(".news-wrapper");
      $wrapper.children().slice(3).remove();
      $inner.append($wrapper);

      $("#newsWrapper .news-item").each(function() {
        $(this).find("a.title").clone().insertAfter($(this).find(".text")).html("Celý článek").addClass("arrow");
        //$(this).find("time").appendTo($(this).find(".image")).addClass("ready");
      });

      $wrapper.find("img").unveil();

      var current = window.location.pathname;
      $("body.in-magazin #newsWrapper .news-item .text a").each(function() {
        var link = $(this).attr("href");
        if(current == link) {
          $(this).parent().parent().remove();
        }
      });
      $inner.trigger('DynamicContentLoaded');
    });
  };

  Layout.initModalLinks = function() {
    $("body").on("click", "a.ajax-modal", function(e) {
      e.preventDefault();

      var selector = $(this).attr("data-selector") || "#content",
        size = $(this).attr("data-size");
      loadAndOpenModal($(this).attr("href"), selector, size);
    });
  };

  Layout.initLoginWidget = function() {
    hooks.hookAfterShoptetFn("shoptet.global.showPopupWindow", function(args) {
      var target = args[0], show = args[1];
      if(!show)
        return;

      if($(".login-widget").is(":visible"))
        $(".login-widget [name=email]").focus();
    });
    $("body").on("click", function(e) {
      if($("body").is(".login-window-visible") && !$(e.target).closest(".login-widget").length)
        shoptet.global.hideContentWindows();
    });
  };

  // ======================== CART ========================

  var Cart = Object.create(Module);
  Cart.snippets = {
    //emptyCart: "empty-cart.html?v=0.2"
  };

  Cart.documentReady = function() {};

  Cart.storeOrderInfo = function() {
    if(!window.sessionStorage)
      return;

    sessionStorage.setItem("orderSummary", $(".order-summary-inner").html());
  };

  Cart.displayOrderInfo = function() {
    if(!window.sessionStorage)
      return;
    var html = sessionStorage.getItem("orderSummary");
    if(!html)
      return;
    var $summary = $(html),
      $table = $(".recapitulation-table");

    // if sessionStorage contains invalid data, don't show deceiving information
    $summary.find(".recapitulation-single").each(function() {
      var $t = $(this),
        label = $t.find("> span").text().trim(),
        price = $t.find("> strong > span").html(),
        value = $t.find("> strong").children().remove().end().html();

      if(value.indexOf("Slevový kupon") !== -1) {
        var $r = $('<tr class="discount-row"><td class="cart-p-image"></td>');
        $r.append($('<td class="p-name">').append(value.trim()));
        $r.append('<td class="p-quantity p-cell"/>');
        $r.append($('<td class="p-price p-cell"/>').append(price));
        $(".cart-table tbody").append($r);
        return;
      }

      var $tr;
      switch(label) {
        case "Způsob dopravy":
          $tr = $table.find("th:contains(doprava)").parent();
          break;
        case "Platba":
          $tr = $table.find("th:contains(platba)").parent();
          break;
      }
      if(!$tr || !$tr.length)
        return;

      $tr.find("th").html($tr.find("th").html().trim() + ": " + $tr.find("td").html());
      $tr.find("td").html(price);
    });
  };

  Cart.cartContentLoaded = function(snippets) {
    $(".cart-inner .discount-coupon label").hide();
    $(".cart-inner .applied-coupon").insertBefore(".cart-summary");

    $(".cart-row .delivery-time").insertAfter(".extra.delivery");
    $("body.id--9 .sidebar-in-cart").appendTo(".extras-wrapper");
    $("body.id--9 .sidebar-in-cart .btn").text("Pokračovat v objednávce");

    $('<span class="show-tooltip acronym" title="" data-testid="cartItemDiscount" data-original-title="Při objednání do 10:00 odesíláme ještě ten samý den"><span class="tooltip-icon"></span></span>').prependTo(".delivery-time");

    $(".cart-header").insertBefore(".cart-inner");

    $(".cart-table tr.related").remove();

    $("body.in-kosik .cart-table").find(".p-discount").closest("table").addClass("with-disc");
    $("<tr class='top'><td colspan='2'>Položka košíku</td><td>Dostupnost</td><td>Množství</td><td>Cena za kus</td><td>Součet</td></tr>").prependTo("body.in-kosik .cart-table:not(.with-disc) tbody");
    $("<tr class='top'><td colspan='2'>Položka košíku</td><td>Dostupnost</td><td>Množství</td><td>Cena za kus</td><td>Sleva</td><td>Součet</td></tr>").prependTo("body.in-kosik .cart-table.with-disc tbody");
    $("ol.cart-header li.step-3").html("<a href='/objednavka/krok-2/'><span>Informace</span></a>");
    $('<div class="form-group"><input type="checkbox" name="coupontoggler" id="coupontoggler" value="1"><label for="coupontoggler" class="whole-width">Mám slevový kód</label></div>').prependTo(".discount-coupon");
    $("#coupontoggler").click(function() {
      $(".discount-coupon form").toggleClass("active");
    });

    if($(".cart-inner .applied-coupon").length) {
      $("#coupontoggler").prop("checked", true);
    }

    $("#checkoutSidebar .cart-items .cart-item").each(function() {
      $(this).find(".cart-item-amount, .cart-item-price").wrapAll("<div class='cart-item-price-amount' />");
    });

    $("#checkoutContent .stay-in-touch .form-group:last-of-type").appendTo("#checkoutContent .co-contact-information");

    $(".cart-content .radio-wrapper .payment-info .question-tooltip").each(function() {
      var $speclink = $(this),
        spec = $speclink.attr("data-original-title") || $speclink.attr("title");
      $(this).parent().html(spec);
    });

    $("body.in-krok-1 .next-step .next-step-forward").text("Pokračovat v objednávce");

    var $box = $(".co-box.co-payment-method");
    if($box.find(".recapitulation-table").length === 1) {
      $box.find(".recapitulation-table").eq(0).addClass("totals-table");
    } else if($box.find(".recapitulation-table").length === 2) {
      $box.find(".recapitulation-table").eq(0).addClass("totals-table");
      $box.find(".recapitulation-table").eq(1).addClass("payment-table");
    }

    $("#checkoutContent .co-contact-information").find(".form-group label[for=login]").parent().addClass("login-form-group");
    $(".login-form-group").prependTo(".col-md-8 .cart-content");

    $(".login-form-group label").html("Máte u nás účet? Přihlaste se a nemustíte vyplňovat své údaje. <span id='login-here'></span>").removeClass("btn btn-secondary");
    $(".login-form-group a").removeClass("btn btn-secondary").text("Přihlásit se").appendTo("#login-here");


    $("body.in-kosik .cart-inner.cart-empty").closest("body").addClass("empty-cart-page");

    $("body.in-krok-2 .co-contact-information .form-group:last-of-type").appendTo(".stay-in-touch");
    $("body.in-krok-2 .form-group label[for='phone']").prependTo(".phone-combined-input");

    $("<div class='consents-last'>Beru na vědomí, že zaplacenou objednávku <b>již není možné dodatečně upravovat či měnit.</b></div>").prependTo("body.in-krok-2 .next-step");

    $(".cart-table .availability-amount").html(function(i, v) {
      return v.replace(/[\(\)]/g, "");
    });

    $("body.in-kosik .price-wrapper").appendTo(".cart-summary .extras-wrapper .extras-col:nth-of-type(2)");

    $(".extras-col .free-gift").insertAfter(".cart-table");
    $(".free-gift-trigger").appendTo(".free-gifts-wrapper");
    $(".free-gift-trigger").removeClass("btn-secondary btn");
    $("<div class='free-gift-label__before'><b>Dárek ZDARMA</b> k objednávce</div>").insertBefore(".free-gift-name");

    $("#orderFormButton").text("POKRAČOVAT").appendTo(".order-summary-inner");

    $("body.in-krok-2 .stay-in-touch .form-group:nth-of-type(2) label[for='set-registration']").text("Chci se registrovat v e-shopu a získat slevu 5%");
    $("body.in-krok-2 .stay-in-touch .form-group:nth-of-type(2)").appendTo(".login-form-group");

    $("body.in-kosik .cart-row>div.col-md-4, .cart-summary").addClass("ready");
    $("body.in-krok-2 .consents-first, body.in-krok-2 .consents-last, body.in-krok-2 #submit-order").appendTo(".order-summary .order-summary-inner");
    $("#submit-order").text("Objednat s povinností platby");

    if($("body.in-krok-2").length)
      this.storeOrderInfo();

    if($("body.in-dekujeme").length)
      this.displayOrderInfo();

    tb.hooks.signalDomLoad();
  };

  // ======================== CATALOG ========================

  function filterAvailabilityAmount(amount) {
    amount = amount.trim().replace(/[\(\)]/g, "");
    /*if(amount !== "" && amount.indexOf("ks") === -1)
      amount += " ks";*/
    return amount;
  }

  var Catalog = Object.create(Module);
  Catalog.snippets = {};

  Catalog.documentReady = function() {
    this.hideAdvancedOrderMessage();
  };

  Catalog.contentLoaded = function(snippets) {
    this.initProductBlocks(snippets);
    //this.initFilters(snippets);
    this.initAdvancedOrder(snippets);
  };

  Catalog.initProductBlocks = function(snippets) {
    $(".products-block .product").each(function() {
      if(oneTime(this))
        Catalog.initProductBlock($(this), snippets);
    });
  };

  Catalog.initProductBlock = function($t, snippets) {};

  Catalog.initAdvancedOrder = function(snippets) {
    var $modal = $(".advanced-order");
    if(!$modal.length || !tb.dom.oneTime($modal, "initAdvancedOrder"))
      return;

    if($modal.find(".advanced-order-suggestion").length)
      $modal.addClass("--has");
    $("<div onclick='shoptet.modal.close();' class='extra btn btn-secondary btn-back'>Zpět do obchodu</div>").prependTo(".advanced-order .extras-wrap");
    $(".advanced-order .extras-wrap").append(tb.$h(".extra.step", $(".advancedOrder__buttons").detach().find(".btn-conversion")));
    $(".advanced-order .extras-wrap .extra.step .btn").html("Přejít do košíku").addClass("btn-next");
    $(".advanced-order > .h1:not(.advanced-order-suggestion)").html("Vloženo do košíku");
    $(".advanced-order > .h1:not(.advanced-order-suggestion), .advanced-order > .h2").wrapAll("<div class='adv-wrap'></div>");
    $(".advanced-order > .advanced-order-suggestion, .advanced-order > #products").wrapAll("<div class='adv-wrap-bottom'></div>");
    $(".adv-wrap-bottom .advanced-order-suggestion").text("S tímto produktem naši zákaznicí také kupují");
    $modal.closest("#cboxContent").addClass("cbox-transparent").css("background", "transparent");

    $(document).one("cbox_closed", function() {
      $("#cboxContent").removeClass("cbox-transparent").css("background", "");
    });
  };

  Catalog.hideAdvancedOrderMessage = function() {
    var lastGetAdvancedOrder = 0;
    hooks.hookBeforeShoptetFn("shoptet.cart.getAdvancedOrder", function() {
      lastGetAdvancedOrder = Date.now();
    });

    hooks.hookFn("window.showMessage", function(showMessage, args, context) {
      if(args[1] === "success" && Date.now() - lastGetAdvancedOrder <= 500)
        return;
      showMessage.apply(context, args);
    });
  };

  Catalog.visibleFilters = {};
  Catalog.filterUnveiled = false;
  Catalog.initFilters = function() {
    function getFilterSections() {
      return $(".filter-section");
    }
    function toggleFilterSection($t, visible) {
      $t.toggleClass("active", !!visible);
      Catalog.visibleFilters[$t.index()] = !!visible;
      $t.find("form, .param-filter-top")[visible ? "show" : "hide"]();
    }

    function toggleFilters(visible) {
      $("#filters, .filters-wrapper").toggleClass("--opened", !!visible);
      Catalog.filterUnveiled = visible;
    }

    if(tb.dom.oneTime("body", "initFilters")) {
      // bind events
      $("body").on("click", ".filter-section", function(e) {
        var $t = $(this),
          $target = $(e.target);

        var filterIndex = $t.index();

        if(!$t.is(".active")) {
          if($(window).width() > 767) { // allow multiple open filters on mobile
            getFilterSections().each(function() {
              toggleFilterSection($(this), false);
            });
          }
          toggleFilterSection($t, true);
        } else if($target.closest("h4").length) {
          toggleFilterSection($t, false);
        }
      });

      $("body").on("click", function(e) {
        if($(e.target).closest(".filter-section").length)
          return;
        getFilterSections().each(function() {
          toggleFilterSection($(this), false);
        });
      });

      $("body").on("click", ".filters-unveil-button-wrapper a", function() {
        toggleFilters(!Catalog.filterUnveiled);
      });
    }

    // restore active filters after ajax
    getFilterSections().each(function() {
      var $t = $(this);
      if(Catalog.visibleFilters[$t.index()])
        toggleFilterSection($t, true);
    });
    toggleFilters(Catalog.filterUnveiled);

    // add mobile select for sorting
    var $fieldset = $("#category-header > form fieldset");
    if(oneTime($fieldset, "initFilters")) {
      var $select = $('<select class="mobile-sort"/>');
      $fieldset.find("input[type=radio]").each(function() {
        var $t = $(this);
        $select.append(
          $("<option/>").prop("value", $t.prop("value"))
            .prop("selected", $t.is(":checked"))
            .text($t.next("label").text().trim()));
      });
      $select.on("change", function(e) {
        e.preventDefault();
        var value = $(this).val();
        $fieldset.find("input[type=radio][value=\"" + value + "\"]").prop("checked", true).trigger("click");
      });
      $fieldset.after($select);
    }

    const unveilButtonText = "Filtrovat produkty";
    $(".filters-unveil-button-wrapper .unveil-button").text(unveilButtonText).attr("data-text", unveilButtonText);
  };

  // ================================================

  const Banners = (function($h, $t) {
    const config = {
      selectorMap: {
        hpCatsBig: ".he-hp-cats.--big",
        hpSignpost: ".he-hp-signpost",
        wroteAbout: ".wrote-about",
        story: ".he-story",
        effects: ".effects",
        usps: ".usps",
      },
      builtinMap: {},
      detachFooter: false,
    };

    const banners = {};

    function loadBanners() {
      if(Object.keys(banners).length)
        return banners;

      const $footer = $("#footer .custom-footer");
      if(config.detachFooter)
        $footer.detach();
      for(let [key, selector] of Object.entries(config.selectorMap)) {
        const $content = banners[key] = $footer.find(selector).closest("[data-ec-promo-id]");
        $content.closest(".banner").parent().detach();
      }
      for(let [key, source] of Object.entries(config.builtinMap))
        banners[key] = $footer.find(".custom-footer__" + source).detach();

      return banners;
    }

    function get(key, clone = true) {
      const $el = banners[key];
      return clone ? $el.clone() : $el;
    }

    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        loadBanners();
      },
    });

    return { config, init, get, };
  })(tb.$h, tb.$t);

  const Detail = (function($h, $t, Banners) {
    const config = {
      ratingsPerPageDesktop: 12,
      ratingsPerPageMobile: 6,
    };


    function initNewRefsItems($items) {
      Promise.resolve().then(() => {
        tb.ui.responsiveSlick(479, $items, {
          infinite: false,
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
          arrows: true,
          rows: 0,
          slideWidthRounding: 3,
        });
      });
    }

    function initNewRefsTop($refs) {
      $refs.find(".new-refs__item").wrapAll($h(".new-refs__items"));
      const $items = $refs.find(".new-refs__items");
      initNewRefsItems($items);
    }

    function replaceElementWith($el, $newEl) {
      $el.replaceWith($newEl);
      return $newEl;
    }

    const Pagination = ({
      page = 0,
      numPages,
      getPageUrl = () => "#",
      setPage,
    }) => {
      const PageLink = (p, children) => $h("a", { href: getPageUrl(p) }, children).on("click", e => {
        if(setPage) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setPage(p);
        }
      });

      const getPageLabel = p => String(p + 1);
      const lastPage = numPages - 1;

      return $h(".pagination-wrapper", [
        $h(".pagination", [
          page > 0 ? PageLink(0, getPageLabel(0)) : null,
          page > 0 ? PageLink(page - 1, [
            $h("span.sr-only", "Předchozí strana"),
          ]).addClass("prev pagination-link") : null,
          $h("strong.current", getPageLabel(page)),
          page < lastPage ? PageLink(page + 1, [
            $h("span.sr-only", "Další strana"),
          ]).addClass("next pagination-link") : null,
          page < lastPage ? PageLink(lastPage, getPageLabel(lastPage)) : null,
        ]),
      ]);
    };

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function initRatingPagination() {
      const $votesWrap = $("#ratingTab .votes-wrap").first();
      if(!$votesWrap.length)
        return;
      const $votes = $votesWrap.children(".vote-wrap");
      const perPage = $(window).width() <= 767 ? config.ratingsPerPageMobile : config.ratingsPerPageDesktop;

      let page = 0;
      const numPages = Math.ceil($votes.length / perPage);

      let $pagination;
      function renderPagination() {
        return Pagination({
          page,
          numPages,
          setPage(p) {
            page = p;
            $pagination = replaceElementWith($pagination, renderPagination());

            $votesWrap.css("opacity", 0);
            setTimeout(() => {
              $votesWrap.html($votes.slice(page * perPage, (page + 1) * perPage));
              $votesWrap.css("opacity", 1);
              scrollToEl($votesWrap);
            }, 350);
          }
        });
      }

      if(numPages > 1) {
        $votesWrap.html($votes.slice(0, perPage));
        $("#ratingTab").append($pagination = renderPagination());
      }

      // if($("#ratingTab .votes-wrap .vote-wrap").length > 12)
      //   $("<span class='center'><div class='btn btn-secondary btn-load-more'>Zobrazit všechna hodnocení</div></span>").appendTo("#ratingTab");

      // $(".btn-load-more").click(function() {
      //   $("#ratingTab .votes-wrap").addClass("--show");
      //   $(this).hide();
      // });
    }

    function initDetail($detail) {
      const $infoWrapper = $detail.find(".p-info-wrapper");
      const $imageWrapper = $detail.find(".p-image-wrapper");

      $detail.find(".p-detail-info>div.flags").prependTo($imageWrapper);
      $infoWrapper.find(".availability-amount").html(function(i, v) {
        return v.replace("(", "").replace(")", "")
      });
      $infoWrapper.find(".chevron-after.chevron-down-after").text("Více informací").appendTo($detail.find(".p-short-description"));

      if(!$infoWrapper.find(".price-save .parameter-dependent").length)
        $("<span>sleva</span>").prependTo($infoWrapper.find(".p-final-price-wrapper .price-save"));

      if(!$detail.find(".flags-default").length)
        $("<div class='flags flags-default flags-inline'></div>").prependTo($imageWrapper);
      $detail.find(".p-image .flag-discount").appendTo($imageWrapper.find(".flags-default"));

      $detail.find(".flag.flag-kniha-do-mailu-zdarma").appendTo($imageWrapper);

      $detail.find(".flag.flag-testovano-v-laboratori").attr("data-href", "/o-nas/testovano-v-nezavisle-laboratori/").appendTo($imageWrapper);
      $(".flag.flag-testovano-v-laboratori").click(function() {
        window.location.href = $(this).data("href");
      });

      $detail.find(".p-info-wrapper .how-to-use").insertAfter($infoWrapper.find(".p-short-description"));
      const $newRefs = $detail.find(".p-info-wrapper .new-refs.--top").appendTo($imageWrapper);
      initNewRefsTop($newRefs);

      const $appendixWrapper = tb.$h(".appendix-wrapper", [
        $detail.find(".p-detail-inner-header .product-appendix")
      ]).insertAfter($detail.find(".p-detail-inner-header h1"));

      const $wrappedInfo = $infoWrapper.find(".p-final-price-wrapper, .availability-value, .detail-parameters, .add-to-cart").wrapAll(tb.$h(".wrapped-info")).parent();

      if(!$detail.find(".add-to-cart").length)
        $wrappedInfo.append($h(".add-to-cart"));

      $detail.find(".other-product-links").prependTo($wrappedInfo);
      $detail.find(".p-final-price-wrapper").prependTo($detail.find(".add-to-cart"));
      $infoWrapper.find(".add-to-cart .add-to-cart-button").text("Vložit do košíku");
      $wrappedInfo.find(".delivery-time-label").text("Objednávku doručíme nejpozději do");

      $wrappedInfo.find(".delivery-time-label, .delivery-time, .shipping-options").parent().addClass("deliver-row-wrapped").insertAfter($wrappedInfo.find(".availability-value"));
      $detail.find(".deliver-row-wrapped, .availability-value").insertBefore($detail.find(".add-to-cart"));

      $("<div class='extra-discount'><b>Extra sleva 5 %</b> pro zaregistrované uživatele. <a href='/login/'>Přihlásit se.</a> Nemáte účet? <a href='/registrace/'>Registrujte se</a></div>").appendTo($wrappedInfo);
      $("<div class='badge-row'><b>Garance vrácení peněz (30 dní).</b> Pokud vám produkt nebude z nějakého důvodu vyhovovat, můžete nám ho vrátit. <a href='/garance-vraceni-penez/'>Více informací</a></div>").appendTo($wrappedInfo);

      const $detailParameters = $detail.find(".extended-description .detail-parameters");
      $detailParameters.find("th:contains('Dávkování')").parent().addClass("add-row --capsules").appendTo($appendixWrapper);
      $detailParameters.find("th:contains('Počet šálků')").parent().addClass("add-row --coffe").appendTo($appendixWrapper);
      $detailParameters.find("th:contains('Vybrané hodnocení')").parent().addClass("add-row --rating").appendTo($detail.find(".p-detail-info"));
      $detailParameters.find("th:contains('Heureka hodnocení')").next().addClass("--heureka__rating").insertAfter($detail.find(".p-detail-info"));
      $detailParameters.find("th:contains('Dodatečný název')").parent().addClass("product-appendix").prependTo($appendixWrapper);

      $detail.find(".--heureka__rating").wrapAll(tb.$h(".heureka__individual"));

      if($detail.find(".flag-set-certifikaci--1").length)
        $("<div class='cert__div'><img src='/user/documents/img/badges-1.png' alt='Certifikace' /></div>").insertAfter($detail.find(".wrapped-info"));

      const $moreInfo = $detailParameters.find("th:contains('Doplňující informace')").parent().hide();
      const moreInfoHtml = $moreInfo.find("td").text();
      if(moreInfoHtml)
        $imageWrapper.append(tb.$h(".more-info-link", [moreInfoHtml]));

      $detailParameters.find("th:contains('Doplňující informace')").parent().addClass("add-row --more-info").prependTo($appendixWrapper);

      $detail.find("#ratingWrapper .link-like.rating-icon").addClass("btn btn-secondary");
      $detail.find("#ratingWrapper .add-comment.rate-form-trigger").insertAfter($detail.find("#ratingTab .rate-wrap .col-sm-6:not(.rate-average-wrap)"));

      const $ratingRow = $detail.find(".product-top>.col-xs-12:first-of-type").addClass("rating-row");

      const $otherProductLinkItems = $detail.find(".other-product-links__items").children();
      const $otherProductHelper = $otherProductLinkItems.filter(".--helper");
      tb.hooks.hookAfterWindowResize(width => {
        if(width >= 1285) {
          $detail.find(".p-detail-inner-header").prependTo($infoWrapper);
          $ratingRow.insertAfter($detail.find(".p-detail-inner-header"));
        } else {
          $detail.find(".p-detail-inner-header").insertBefore($imageWrapper);
          $ratingRow.insertAfter($detail.find(".p-detail-inner-header h1"));
        }

        if($otherProductHelper.length) {
          $otherProductHelper.removeClass("--stretch");
          const helperTop = $otherProductHelper.offset().top;
          let isAlone = true;
          tb.dom.$each($otherProductLinkItems, $item => {
            if(!$item.is($otherProductHelper) && Math.abs($item.offset().top - helperTop) <= 1) {
              isAlone = false;
              return false;
            }
          });
          $otherProductHelper.toggleClass("--stretch", isAlone);
        }
      });

      initRatingPagination();

      $(".p-detail-inner .flag.flag-discount").html(function(i, v) {
        return v.replace("–", "");
      });

      if($("body.mobile").length)
        $detail.find(".extra-discount").insertBefore($detail.find(".p-info-wrapper .p-final-price-wrapper"));

      $detail.find(".vote-wrap").each(function() {
        $(this).find(".stars").prependTo($(this));
      });
      //$detail.find(".vote-wrap").first().find(".vote-content").clone().insertAfter($detail.find(".stars-wrapper"));

      $detail.find("[data-iframe-src]").each(function() {
        var $t = $(this);
        $t.attr("src", $t.data("iframe-src"));
        $t.removeAttr("data-iframe-src");
        $t.on("load", function() {
          $t.prev(".loader").remove()
        });
      });

      $detail.find("[name=productId][value=43]").closest(".p-detail-inner").addClass("spec-product");

      $("<div class='gift__heading'><span>Dárek ZDARMA</span></div>").prependTo($detail.find(".p-gift-name:not(.--ash)"));
      $("<div class='gift__heading'><span>Dárek ZDARMA</span> při objednávce <b>alespoň 2 balení</b></div>").prependTo($detail.find(".p-gift-name.--ash"));

      /*$('<div class="p-gifts-wrapper">\
        <div class="p-gifts-heading"></div>\
        <div class="p-gift">\
        <a href="/horcik/" class="p-gift-image">\
        <img src="/user/documents/upload/horcik-zdarma.jpg" alt="Horčík">\
        </a>\
        <div class="p-gift-name"><div class="gift__heading"><span>Dárek ZDARMA</span></div>\
        <a href="/horcik/">+ Hořčík s vysokou vstřebatelností <span class="nowrap">v hodnotě 480 Kč</span>\
                    </a>\
                </div>\
            </div>\
      </div>').prependTo($detail.find(".spec-product .p-info-wrapper"));*/
      //$("<div class='gift__heading'><span>Dárek ZDARMA</span> při objednání <strong>alespoň 2 balení</strong></div>").prependTo($detail.find(".p-gift-name"));

      $(".basic-description>h3").first().text("Popis produktu");
      $(".product-top").after($h(".usps__wrap", [
        Banners.get("usps").contents()
      ]));

      initDescription();
    }

    const HeurekaBlock = () => {
      // tb.ajax.loadDocument("/hodnoceni-obchodu/").then($page => {
      //   const $block = $page.find(".content-inner #ratingWrapper"),
      //     $ratein = $page.find(".content-inner #ratingWrapper .rate-average"),
      //     $rateLabelin = $page.find(".content-inner #ratingWrapper .rate-average"),
      //     $starsLabelin = $page.find(".content-inner #ratingWrapper .stars-label").text().trim().split(' ')[0],
      //     $wrapper = $page.find(".content-inner>.votes-wrap:not(.admin-response)>.vote-wrap");
      // });

      return $h(".heureka-block-new", [
        $h("h2", "Naše hodnocení na Heurece"),
        $h(".info-block", [
          $h(".number"),
          $h(".stars-block", [
            $h("h4.info-block__rating"),
            $h(".info-block__description", [
              $h("span", "Zákazníků nás doporučuje"),
              " ",
              $h("a", { href: "/hodnoceni-obchodu/", target: "_blank" }, "Přečíst recenze"),
            ]),
          ]),
          $h("a.heureka-block-new__btn", { href: "/hodnoceni-obchodu/" }, "Zobrazit všechna hodnocení"),
        ]),
        $h("h2", "Další hodnocení zákazníků"),
        $h(".heureka-inner"),
        $h(".heureka-block-new__buttons", [
          $h("a.heureka-block-new__btn.--mobile", { href: "/hodnoceni-obchodu/" }, "Zobrazit všechna hodnocení"),
        ]),
      ]);
    };

    function initDescription() {
      const $description = $("#description");
      if(!$description.length)
        return;

      // .hed-new-refs
      tb.dom.$each($description.find(".hed-new-refs"), $newRefs => {
        if($(window).width() <= 767)
          $newRefs.find(".hed-rating-wrapper").html($("#ratingWrapper"));

        // tb.dom.$each($newRefs.find(".hed-video-review iframe"), $iframe => {
        //   const iframe = $iframe[0];
        //   iframe.style.aspectRatio = `${(iframe.width / iframe.height).toFixed(3)} / 1`;
        // });

        $newRefs.find(".hed-video-reviews__items").slick({
          lazyLoad: "anticipated",
          infinite: false,
          slidesToShow: 5,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
          rows: 0,
          slideWidthRounding: 3,
          variableWidth: true,
          responsive: [
            {
              breakpoint: 1265,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 479,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        });

        tb.hooks.hookAfterWindowResize(() => {
          tb.dom.$each($newRefs.find(".hed-video-review iframe"), $iframe => {
            const iframe = $iframe[0];
            $iframe.width($iframe.height() / iframe.height * iframe.width);
          });
        });

        const $newRefsItems = $newRefs.find(".new-refs__items");
        if(!$newRefsItems.children(".new-refs__item").length)
          $newRefsItems.html($(".new-refs.--top .new-refs__items").clone().contents());
        initNewRefsItems($newRefsItems);

        let id = $newRefs.attr("id");
        if(!id)
          $newRefs.attr("id", id = tb.helpers.uniqueId("newRefs"));
        $(`#p-detail-tabs a[href="#ratingTab"]`).attr("href", "#" + id);
      });

      // .hed-heureka-block, .hed-additional-rating-block
      tb.dom.$each($description.find(".hed-heureka-block,.hed-additional-rating-block"), $additionalRatingBlock => {
        $additionalRatingBlock.addClass("hed-additional-rating-block");
        const $ratingTab = $("#ratingTab");
        if($ratingTab.length) {
          const $descriptionAfterRating = $h("#descriptionAfterRating", [
            $h(".basic-description", [
              $additionalRatingBlock.nextAll(),
            ]),
          ]);
          $ratingTab.after($descriptionAfterRating);
        }
      });
    }

    const init = tb.dom.createModuleInitializer({
      dependencies: [
        Banners,
      ],
      earlyInit() {
        $("body").on("click", ".other-product-link.--helper", function(e) {
          e.preventDefault();
          const $helperContent = $(this).closest(".p-detail").find(".other-product-helper");
          shoptet.modal.open({
            html: $helperContent.clone(true).wrapAll(shoptet.content.colorboxHeader + shoptet.content.colorboxFooter),
            className: shoptet.modal.config.classMd,
            width: shoptet.modal.config.widthMd,
            onComplete: function() {
              shoptet.modal.shoptetResize();
              $("#colorbox img").on("load", function() {
                shoptet.modal.shoptetResize()
              });
            }
          });
        });

        $("body").on("click", ".hed-studies__show-more", function(e) {
          e.preventDefault();
          $(this).closest(".hed-studies").addClass("--expanded");
        });

        /*$("body").on("click", ".hed-more-link", function(e) {
          const $linkWrap = $(this).closest(".hed-more-link-wrap");
          const $content = $linkWrap.next(".hed-more-content");
          if(!$content.length)
            return;
          e.preventDefault();
          $content.addClass("--visible");
          $linkWrap.remove();
        });*/
      },
      earlyRender() {
        tb.dom.$eachOneTime(".p-detail", initDetail, "Detail");
      }
    });

    return { init };
  })(tb.$h, tb.$t, Banners);

  const DetailVideos = (function() {

    function extractVideoId(url) {
      const m = String(url).match(/(?:youtube\.[a-z]+\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]+)/i);
      return m && m[1];
    }

    function initThumbnails() {
      if($(".p-thumbnails-wrapper").length)
        return;

      $('<div class="p-thumbnails-wrapper"><div class="p-thumbnails p-thumbnails-horizontal"><div class="p-thumbnails-inner" style="left: 0px;"><div></div><a href="#" class="thumbnail-prev"></a><a href="#" class="thumbnail-next"></a></div></div>').insertAfter(".p-image");

      const $mainImage = $(".p-main-image");
      const $thumbs = $(".p-thumbnails-inner > div");
      $thumbs.append(
        tb.$h("a.p-thumbnail", { href: $mainImage.attr("href") }, [
          tb.$h("img", { width: 100, height: 100, src: $mainImage.find("img").attr("src") })
        ]),
        tb.$h("a.cbox-gal.cboxElement", { "data-gallery": "lightbox[gallery]", href: $mainImage.attr("href") })
      );
    }

    function addYoutubeVideo(id) {
      const imgUrl = "https://img.youtube.com/vi/" + id + "/mqdefault.jpg";
      const iframeUrl = "https://youtube.com/embed/" + id;

      const $thumbs = $(".p-thumbnails-inner > div");
      let $link, $linkCbox, $thumb, $img;
      $thumbs.append(
        $link = tb.$h("a.p-thumbnail.p-thumbnail-video", { href: "#", "data-video-id": id }, [
          $img = tb.$h("img", { width: 100, height: 100, src: imgUrl })
        ]),
        $linkCbox = tb.$h("a.cbox-gal.cboxElement", { "data-gallery": "lightbox[gallery]", href: iframeUrl })
      );
      $linkCbox.colorbox({ rel: 'lightbox[gallery]', iframe: true, innerWidth: '90%', innerHeight: '80%' });

      $img.on("load", updateVideoHeight);

      const $iframe = $('<iframe width="560" height="315" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
      $iframe.addClass("p-main-video").attr("src", iframeUrl).data("$img", $img).hide();

      $(".p-main-image").after($iframe);

      $link.on("click", function(e) {
        e.preventDefault();
        $(".p-main-image").addClass("hidden");
        $iframe.show();
      });
      $("body").on("click", ".p-thumbnail:not(.p-thumbnail-video)", function(e) {
        $iframe.hide();
        $(".p-main-image").removeClass("hidden");
      })
    }

    function updateVideoHeight() {
      const $iframe = $("iframe.p-main-video");
      if(!$iframe.length)
        return;
      const $img = $iframe.data("$img");
      if(!$img.prop("complete"))
        return;

      const newHeight = $img.prop("naturalHeight") / $img.prop("naturalWidth") * $iframe.width();
      $iframe.css("height", newHeight);
    }

    function init() {
      if(!$("body.type-detail").length)
        return false;

      $(".detail-parameters tr").each(function() {
        const $tr = $(this);
        const value = $tr.find("td").text().trim();

        const id = extractVideoId(value);
        if(id) {
          $tr.hide();
          initThumbnails();
          addYoutubeVideo(id);
        }
      });

      $(window).on("resize", tb.common.debounce(updateVideoHeight, 250));
    }

    return { init };
  })();

  const DetailBinarySurcharges = (function() {
    function initSurchargeRow($tr) {
      const $th = $tr.children("th");
      const $td = $tr.children("td");

      const $select = $tr.find("select");
      const $inactiveOption = $select.find("option").first();
      const $activeOption = $select.find("option:not([data-choose])").last();

      if(!$inactiveOption.length || !$activeOption.length)
        return;

      const text = $th.text().trim();
      const id = "cbSurcharge" + $select.data("parameterId");
      const price = $activeOption.data("surchargeFinalPrice");

      $th.empty();

      $th.attr("colspan", 2);
      $select.hide().appendTo($th);
      $tr.find("td").remove();

      var $cb;
      $th.append(
        $cb = tb.$h("input", { type: "checkbox", id }),
        tb.$h("label", { for: id }, text)
      );

      $tr.find(".question-tooltip").appendTo($th);
      $th.append(tb.$h("span.surcharge-price", "+ " + price.ShoptetFormatAsCurrency()));

      $cb.on("change", function() {
        if($(this).is(":checked"))
          $activeOption.prop("selected", true);
        else
          $inactiveOption.prop("selected", true);
        tb.dom.signalNativeChange($select);
      });

      if($activeOption.is(":selected"))
        $cb.prop("checked", true);
    }

    const init = tb.dom.createModuleInitializer({
      earlyRender() {
        $(".p-detail tr.surcharge-list").each(function() {
          if(tb.dom.oneTime(this, "DetailBinarySurcharges"))
            initSurchargeRow($(this))
        });
      }
    });

    return { init };
  })();

  const DetailClickableParameters = (function($h, DetailHooks) {
    const config = {
      deselectOnDblClick: false,
      patchSurcharges: false,
      isVariantInStock: v => v.availabilityName.match(/skladem|do 14 dní/i),
      getDefaultImageUrl: code => tb.ajax.appendCacheBuster(`${tb.config.cdnPath}/user/documents/upload/variants/${code.replace(/\//g, "-")}.jpg`),

      fallbackLang: "cs",
      trans: {
        cs: {
          descriptionParameterName: "Popis varianty",
          imageParameterName: "Obrázek varianty",
          flagsParameterName: "Příznaky varianty",
        }
      }
    };

    function getNecessaryVariantData($detail) {
      let necessaryVariantDataObj = $detail.data("necessaryVariantData");
      if(necessaryVariantDataObj)
        return Object.values(necessaryVariantDataObj);
      return tb.sh.getNecessaryVariantData();
    }

    function patchVariantList($t) {
      const $select = $t.find("select");
      if(!$select.length)
        return;
      $select.hide();

      const $detail = $t.closest(".p-detail");
      const variantsArr = getNecessaryVariantData($detail);
      const variantsInStock = variantsArr.filter(config.isVariantInStock);
      const descriptiveParameters = tb.sh.getDescriptiveParameters($detail, true);
      const $detailFlags = $detail.find("form.pr-action").first().find(".flags.flags-default");

      const selectParameterId = $select.data("parameterId");
      const $container = $h(".parameter-values").insertAfter($select);
      tb.dom.$each($select.children("option:not([data-choose])"), $option => {
        const valueId = tb.common.parseNumber($option.attr("value"));
        const variant = variantsArr.find(v => v.tb_parameterValuesObj[selectParameterId] === valueId);

        const descriptionParam = variant && descriptiveParameters[t.descriptionParameterName + " " + variant.code];
        descriptionParam?.$tr.hide();
        const imageUrlParam = variant && descriptiveParameters[t.imageParameterName + " " + variant.code];
        imageUrlParam?.$tr.hide();
        const flagNamesParam = variant && descriptiveParameters[t.flagsParameterName + " " + variant.code];
        flagNamesParam?.$tr.hide();

        const descriptionHtml = descriptionParam?.value;
        let imageUrl = imageUrlParam?.value;
        if(imageUrl === "")
          imageUrl = config.getDefaultImageUrl(variant.code);
        const flagNamesStr = flagNamesParam?.value || "";
        const flagNames = (flagNamesStr !== "" ? flagNamesStr.split(";") : []).filter(s => s.trim());
        const $variantFlags = tb.dom.$filter($detailFlags.children(".flag"), $f => flagNames.includes($f.text().trim())).clone();

        tb.$h("label.parameter-value-custom", [
          imageUrl ? $h(".parameter-value-custom__image").css("background-image", `url("${imageUrl}")`) : null,
          $variantFlags.length ? $h(".parameter-value-custom__flags.flags.flags-default.flags-inline", $variantFlags) : null,
          $h("span.parameter-value-custom__title", $option.text()),
          descriptionHtml ? $h("span.parameter-value-custom__description", [descriptionHtml]) : null,
        ])
          .data({ $option })
          .toggleClass("has-image", Boolean(imageUrl))
          .toggleClass("has-flags", Boolean($variantFlags.length))
          .appendTo($container);
      });

      function updateSelectedItem() {
        $container.children("label").each(function() {
          const $t = $(this), $option = $t.data("$option");
          $t.toggleClass("selected", $option.is(":selected"));
        });
      }

      function updateInStock() {
        const selectedParameterValues = tb.sh.getSelectedParameterValues();

        $container.children("label").each(function() {
          const $t = $(this), $option = $t.data("$option");
          const valueId = tb.common.parseNumber($option.attr("value"));

          selectedParameterValues[selectParameterId] = valueId;
          const matcher = tb.common.matcher(selectedParameterValues);

          const someAvailable = variantsArr.some(v => matcher(v.tb_parameterValuesObj));
          const someInStock = variantsInStock.some(v => matcher(v.tb_parameterValuesObj));
          $t.toggleClass("available", someAvailable).toggleClass("unavailable", !someAvailable);
          $t.toggleClass("in-stock", someInStock).toggleClass("out-of-stock", !someInStock);
        });
      }

      $container.on("click", "label", function(e) {
        e.preventDefault();

        const $t = $(this);
        const $option = $t.data("$option");
        const $defaultOption = $select.find("option[data-choose]");

        if(config.deselectOnDblClick && $defaultOption.length && $option.is(":selected"))
          $defaultOption.prop("selected", true);
        else
          $option.prop("selected", true);
        tb.dom.signalNativeChange($select);
      });

      tb.m.DetailHooks.hookAfterVariantChange(updateSelectedItem);
      tb.m.DetailHooks.hookAfterVariantChange(updateInStock);
    }

    let t;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        t = tb.helpers.getStrings(config);
        // if(!$("body.type-detail").length)
        //     return false;
      },
      earlyRender() {
        $(".detail-parameters .variant-list").each(function() {
          if(tb.dom.oneTime(this, "DetailClickableParameters"))
            patchVariantList($(this));
        });
      }
    });

    return { config, init };

  })(tb.$h, tb.m.DetailHooks);

  const DetailSelectFirstVariant = (function() {
    const config = {
      isVariantInStock: v => v.availabilityName.match(/skladem|do 14 dní/i),
    };

    function getNecessaryVariantData($detail) {
      let necessaryVariantDataObj = $detail.data("necessaryVariantData");
      if(necessaryVariantDataObj)
        return Object.values(necessaryVariantDataObj);
      return tb.sh.getNecessaryVariantData();
    }

    function handleDetail($detail) {
      const necessaryVariantData = getNecessaryVariantData($detail);
      if(!necessaryVariantData)
        return;
      let newVariant = Object.values(necessaryVariantData).find(config.isVariantInStock);
      if(!newVariant)
        newVariant = Object.values(necessaryVariantData)[0];
      if(!newVariant)
        return;
      const parameterValues = newVariant.tb_parameterValuesObj;
      tb.dom.$each($detail.find("select.hidden-split-parameter,select.split-parameter"), $t => {
        if($t.prop("selectedIndex") > 0)
          return;
        const value = parameterValues[$t.data("parameterId")];
        if(value) {
          $t.val(value);
          tb.dom.signalNativeChange($t);
        }
      });
    }

    const init = tb.dom.createModuleInitializer({
      earlyRender() {
        tb.dom.$each(".p-detail", $detail => tb.dom.oneTime($detail, "SelectFirstVariantInStock") && handleDetail($detail));
      }
    });

    return { config, init };
  })();

  const DetailTabTweaks = (function($h) {
    const config = {
      refreshSlick: false,
      splitTitleCount: true,
      showRelatedProductsTab: true,
      forceScroll: true,
      scrollToTabContent: true,
      hideTabs: [
        "#productDiscussion"
      ],
      trans: {
        cs: {
          relatedProductsTabTitle: count => `Související produkty (${count})`,
          nameMap: {
            "#description": "Popis produktu",
            "#productVideos": "Video",
            "#ratingTab": "Hodnocení produktu",
            "#relatedProducts": "Alternativy",
            "#relatedFiles": "Soubory"
          }
        }
      }
    };

    function getTabContent($toggle) {
      if(!$toggle.is("[data-toggle=tab]"))
        return $();
      return $($toggle.attr("href"));
    }

    function processTabLink($toggle) {
      if(!tb.dom.oneTime($toggle, "DetailTabTweaks"))
        return;
      const href = $toggle.attr("href");
      if(config.hideTabs.includes(href))
        $toggle.closest("li").remove();

      const newName = t.nameMap[href];
      $toggle.html((i, oldHtml) => {
        oldHtml = oldHtml.trim();
        let m;
        if((m = oldHtml.match(/^(.+) \(([0-9]+)\)$/)))
          return `<span class="shp-tab-link__label">${newName || m[1]}</span><span class="shp-tab-link__count"> (<span class="shp-tab-link__count-value">${m[2]}</span>)</span>`;
        else
          return `<span class="shp-tab-link__label">${newName || oldHtml}</span>`;
      });

      if(config.forceScroll)
        $toggle.attr("data-force-scroll", "true");
    }

    function renderTab(target, text) {
      if(target instanceof $)
        target = "#" + target.prop("id");
      return $h("li.shp-tab", [
        $h("a.shp-tab-link", { href: target, role: "tab", "data-toggle": "tab" }, text)
      ]);
    }

    let t;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        t = tb.helpers.getStrings(config);

        if(!$("body.type-detail").length)
          return false;

        $("#p-detail-tabs").on("shown.bs.tab", function(e) {
          const $toggle = $(e.target);
          const $tabContent = getTabContent($toggle);
          if(!$tabContent.length)
            return;

          if(config.refreshSlick)
            $tabContent.find(".slick-slider").slick("refresh");
        });

        $("body").on("click", "a[data-toggle=tab]", function(e) {
          const $toggle = $(this);
          const $tabContent = getTabContent($toggle);
          if(!$tabContent.closest(".p-detail-tabs-wrapper").length)
            return;
          if(config.scrollToTabContent && ($toggle.attr("data-force-scroll") || !detectResolution(shoptet.config.breakpoints.sm)))
            scrollToEl($tabContent);
        });

        if(config.scrollToTabContent) {
          tb.hooks.hookFn("scrollToEl", function(scrollToEl, args, context) {
            const [$el] = args;
            if($el.is(".p-detail-tabs-wrapper"))
              return false;
            return scrollToEl.apply(context, args);
          });
        }

        const relatedProductsCount = $(".products-related .product").length;
        if(config.showRelatedProductsTab && relatedProductsCount) {
          const $relatedProducts = $h(".tab-pane.fade#relatedProducts", [
            $(".products-related-header, .products-related.products-additional")
          ]).appendTo("#tab-content");
          $("#p-detail-tabs").append(renderTab($relatedProducts, t.relatedProductsTabTitle(relatedProductsCount)));
        }
      },
      earlyRender() {
        $("#p-detail-tabs a").each(tb.common.iteratee$(processTabLink));
      }
    });

    return { init };
  })(tb.$h);

  const CategoryActiveFilters = (function($h) {
    function removeAllFilters() {
      $("#clear-filters a").trigger("click");
    }

    function renderActiveFilters() {
      var $activeFilterList = $h(".active-filters__list");

      $("#filters .filter-section").each(function() {
        var $values = $(this).find("input[type=checkbox]:checked");
        if(!$values.length)
          return;

        var data = $values.first().data();

        var $h4 = $(this).find("h4");
        $activeFilterList.append(
          $h(".active-filters__parameter", {
            "data-filter-id": data.filterId,
            "data-filter-code": data.filterCode,
          }, [
            $h4.length ? $h("strong.active-filters__parameter-name", $h4.text().trim()) : $(),
            $h(".active-filters__parameter-values", $values.map(function() {
              var $checkbox = $(this),
                label = $checkbox.next("label").clone()
                  .children().remove().end()
                  .text().trim();

              var $removeBtn = $h("a.active-filters__remove-btn", { href: "#", title: "Odebrat filtr" }, [""]);
              $removeBtn.on("click", function(e) {
                e.preventDefault();
                $checkbox.prop("checked", false).trigger("click");
              });

              return $h(".active-filters__parameter-value", {
                "data-id": $checkbox.attr("value")
              }, [
                $h("span", label),
                $removeBtn
              ]);
            }).toArray())]));
      });

      if(!$activeFilterList.children().length)
        return $();

      return $h(".active-filters", [
        $activeFilterList,
        $h("a.active-filters__remove-all-btn", "Zrušit všechny filtry").on("click", removeAllFilters)
      ]);
    }

    var init = tb.dom.createModuleInitializer({
      earlyInit: function() {
        if(!$("body.type-category").length)
          return false;
      },
      render: function() {
        if(!tb.dom.oneTime("#products", "CategoryActiveFilters"))
          return;

        $("#category-header").before(renderActiveFilters());
      }
    });

    return { init: init };
  })(tb.$h);

  const CartUpsell = (function(ProductInfo, $h) {
    const config = {
      fallbackLang: "cs",
      trans: {
        cs: {
          pageSelector: "body.in-kosik",
          headingHtml: "Vyzkoušejte další produkty:",
          addBtnHtml: "Přikoupit",
          inCartBtnHtml: c => `V košíku ${c} ks`,
          inStockRegex: /skladem/i
        },
        sk: {
          pageSelector: "body.in-kosik",
          headingHtml: "Doplnkové služby a produkty",
          addBtnHtml: "Pridať",
          inCartBtnHtml: c => `V košíku ${c} ks`,
          inStockRegex: /na sklade/i
        }
      },
      deleteIfInCart: true,
      hideOutOfStock: true,
      maxDescriptionLength: 0,
      products: []
    };

    function loadProducts() {
      return Promise.all(config.products.map(product => {
        if(typeof product === "string")
          product = { url: product };

        return tb.ajax.loadDocument(product.url).then($page => {
          const $detail = $page.find(".p-detail");
          if(!$detail.length)
            return null;
          const info = ProductInfo.getDetailProductInfo($detail);

          info.basicDescription = $detail.find(".basic-description").children("p,div").filter(function() {
            return !!$(this).text().trim();
          }).first().html();

          if(product.description != null) {
            info.description = product.description;
          } else {
            let description = $h("div", [info.basicDescription]).text().trim(); // convert html to text
            if(config.maxDescriptionLength > -1)
              description = truncate(description, config.maxDescriptionLength, "...");
            info.description = description;
          }

          return info;
        }).catch(err => null);
      })).then(products => products.filter(info => {
        if(!info)
          return false;
        if(config.hideOutOfStock && !info.availabilityHtml.match(t.inStockRegex))
          return false;
        return true;
      }));
    }

    let t;
    function getStrings() {
      const dl = getShoptetDataLayer();
      const lang = dl ? dl.language : config.fallbackLang;
      return config.trans[lang] || config.trans[config.fallbackLang] || {};
    }

    function createHiddenInput(name, value) {
      return $h("input", { type: "hidden", name: name, value: value });
    }

    function truncate(str, maxLength, append) {
      str = str.trim();
      if(str.length < maxLength)
        return str;

      var parts = str.split(/([ ,.:;"'_-])/);
      parts.push(""); // word,delimiter

      let res = "", lastDelimiter = "";
      for(let i = 0; i < parts.length; i += 2) {
        let nextWord = "";
        for(; i < parts.length; i += 2) {
          nextWord += parts[i];
          if(parts[i] !== "")
            break;
          else
            nextWord += parts[i + 1];
        }

        if(res.length + lastDelimiter.length + nextWord.length + append.length > maxLength)
          break;

        res += lastDelimiter + nextWord; // append first word, but not its delimiter
        lastDelimiter = parts[i + 1];
      }

      return res.length ? (res + append) : "";
    }

    function initSlick($upsell) {
      $upsell.find(".cart-upsell__products").slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        rows: 0,
        slideWidthRounding: 3,
        responsive: [
          {
            breakpoint: 1265,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 479,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }

    function renderProduct(info) {
      const $prices = $h("div", [info.priceHtml]);
      let $priceFinalHolder = $prices.find(".price-final-holder.parameter-dependent").first();
      if(!$priceFinalHolder.length)
        $priceFinalHolder = $prices.find(".price-final-holder");
      $priceFinalHolder.html($priceFinalHolder.html().replace(/([^<]+)<span class="nowrap">([^<]+)<\/span>/, ($0, $1, $2) => `<small>${$1.trim()}</small> ${$2}`));
      let $priceStandard = $prices.find(".price-standard .parameter-dependent").first();
      if(!$priceStandard.length)
        $priceStandard = $prices.find(".price-standard");
      if($priceStandard.is(".empty"))
        $priceStandard = $();
      let $flagsExtra = $h(".flags.flags-extra", [info.flagsExtra]);
      $flagsExtra.find(".price-standard").remove();
      $flagsExtra.find(".price-save .parameter-dependent:not(:first-child)").remove();
      $flagsExtra.find(".price-save .parameter-dependent").removeClass("parameter-dependent no-display");
      if($flagsExtra.find(".price-save .empty").length)
        $flagsExtra = $();

      let inCart = 0, $lastInCartItem;
      $(".cart-table tr[data-micro=cartItem]").each(tb.common.iteratee$($cartItem => {
        if($cartItem.attr("data-micro-sku") === info.sku) {
          inCart += tb.common.parseNumber($cartItem.find("input.amount").val());
          $lastInCartItem = $cartItem;
        }
      }));

      let $form;
      if(inCart > 0 && config.deleteIfInCart) {
        const $deleteForm = $lastInCartItem.find("button.remove-item").closest("form");
        $form = $h("form.pr-action", {
          action: shoptet.config.removeFromCartUrl,
          method: "post"
        }, [
          createHiddenInput("itemId", $deleteForm.find("input[name=itemId]").val()),
          createHiddenInput("priceId", info.priceId),
          createHiddenInput("amount", $deleteForm.find("input[name=amount]").val()),
          $h("button.cart-upsell-product__btn", {
            type: "submit"
          }, [inCart ? t.inCartBtnHtml(inCart) : t.addBtnHtml]).toggleClass("--in-cart", inCart > 0)
        ]);
      } else
        $form = $h("form.pr-action", {
          action: shoptet.config.addToCartUrl,
          method: "post"
        }, [
          createHiddenInput("language", info.language),
          createHiddenInput("priceId", info.priceId),
          createHiddenInput("productId", info.productId),
          $h("button.cart-upsell-product__btn", {
            type: "submit"
          }, [inCart ? t.inCartBtnHtml(inCart) : t.addBtnHtml]).toggleClass("--in-cart", inCart > 0)
        ]);

      const $availability = $h(".availability", [info.availabilityHtml]);
      const $availabilityAmount = $availability.find(".availability-amount");
      if($availabilityAmount.length) {
        const text = $availabilityAmount.text();
        $availabilityAmount.text(text.replace(/[\(\)]/g, "").replace(/>/, ">\u00a0"));
      }

      return $h(".cart-upsell-product", [
        $h(".cart-upsell-product__image", [
          $h("a", { href: info.url }, [
            $h("img", {
              src: info.image,
              alt: info.name,
            }),
          ])
        ]),
        $flagsExtra,
        $h("a.cart-upsell-product__name", { href: info.url }, info.name),
        info.description && $h(".cart-upsell-product__description", info.description),
        $h(".cart-upsell-product__availability", $availability),
        $h(".cart-upsell-product__prices", [
          $priceStandard,
          $h(".price.price-final", { "data-testid": "productCardPrice" }, [
            $h("strong", $priceFinalHolder.contents()),
          ]),
        ]),
        $h(".cart-upsell-product__action", $form),
      ]).data({ info });
    }

    function renderCartUpsell(products) {
      return $h(".cart-upsell", [
        $h("h2.cart-upsell__title", [t.headingHtml]),
        // $h("table.cart-upsell__table", products.map(renderProductRow))
        $h(".cart-upsell__products", products.map(renderProduct)),
      ]);
    }

    function isCartEmpty() {
      return !!$(".cart-inner.cart-empty").length;
    }

    let productsPromise;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        t = getStrings();
        if(!$(t.pageSelector).length || !config.products.length)
          return false;
        if(isCartEmpty())
          return false;
        productsPromise = loadProducts();
      },
      render() {
        productsPromise.then(products => {
          if(isCartEmpty()) {
            $(".cart-inner .cart-upsell").remove();
            return;
          }
          if(tb.dom.oneTime(".cart-inner", "CartUpsell")) {
            const $upsell = renderCartUpsell(products);
            $upsell.insertBefore(".cart-summary");
            $upsell.find("img").unveil();
            initSlick($upsell);
          }
        });
      }
    });

    return { config, init };
  })(tb.m.ProductInfo, tb.$h);

  const CartUtils = (function($h, $t, AjaxSubmitFormHooks) {
    const config = {
      fallbackLang: "cs",
      trans: {
        cs: {
          cartUrl: "/kosik/",
          amountLocked: "Množství nelze měnit, protože je navázané na ostatní položky."
        },
        en: {
          cartUrl: "/cart/",
          amountLocked: "Quantity is locked, because it is linked to other cart items."
        }
      },
    };

    // https://developers.shoptet.com/home/shoptet-tools/editing-templates/how-to-properly-add-product-to-cart-with-javascript/

    function loadCart(noCache) {
      return tb.ajax.loadDocument(t.cartUrl, noCache).then($doc => {
        const $cartWrapper = $doc.find("#cart-wrapper");
        if(!$cartWrapper.length)
          throw new Error("Failed to load cart.");
        return $cartWrapper;
      });
    }

    function getCartContents($cartWrapper) {
      return tb.dom.$map($cartWrapper.find("tr[data-micro=cartItem]"), $tr => {
        const product = {
          identifier: $tr.attr("data-micro-identifier"),
          sku: $tr.attr("data-micro-sku"),
          priceId: tb.common.parseNumber($tr.find("input[name=priceId]").val()),
          url: $tr.find(".main-link").attr("href"),
          price: tb.common.parsePrice($tr.find(".p-price .price-final").text()),
        };

        const itemId = $tr.find("input[name=itemId]").val();
        const amount = tb.common.parseNumber($tr.find("input[name=amount]").val());
        const totalPrice = tb.common.parsePrice($tr.find(".p-total .price-final").text());

        return { $tr, product, itemId, amount, totalPrice, };
      }).toArray();
    }

    function getCartWidgetContents($cartWidget) {
      return tb.dom.$map($cartWidget.find(".cart-widget-product"), $tr => {
        const product = {
          identifier: $row.data("microIdentifier"),
          sku: $row.attr("data-micro-sku"),
          priceId: tb.common.parseNumber($row.find("input[name=priceId]").val()),
          url: $row.find(".cart-widget-product-name a").attr("href"),
        };

        const itemId = $tr.find("input[name=itemId]").val();
        const amount = tb.common.parseNumber($tr.find("input[name=amount]").val());
        const totalPrice = tb.common.parsePrice($tr.find(".cart-widget-product-price").text());

        return { $tr, product, itemId, amount, totalPrice, };
      }).toArray();
    }

    function filterCartItems(cartItems, filter) {
      if(!filter.itemId && !filter.productCode && !filter.sku && !filter.priceId && !filter.url && !filter.customFilter)
        throw new Error("Invalid filter: " + JSON.stringify(filter));

      return Promise.resolve(cartItems).then(() => {
        if(!filter.customFilter)
          return;
        return Promise.all(cartItems, item => {
          return Promise.resolve(filter.customFilter(item)).then(res => (item.customFilterResult = res));
        });
      }).then(() => {
        return cartItems.filter(item => {
          if(filter.itemId !== undefined && item.itemId !== filter.itemId)
            return false;
          if(filter.productCode !== undefined && item.product.productCode !== filter.productCode)
            return false;
          if(filter.sku !== undefined && item.product.sku !== filter.sku)
            return false;
          if(filter.priceId !== undefined && item.product.priceId !== filter.priceId)
            return false;
          if(filter.url !== undefined && item.product.url !== filter.url)
            return false;
          if(filter.customFilter && !item.customFilterResult)
            return false;
          return true;
        });
      });
    }

    function createForm(action, method, payload) {
      const $form = tb.$h("form", { action, method });
      for(let [key, value] of Object.entries(payload)) {
        if(typeof value === "object") {
          for(let [key2, value] of Object.entries(value)) {
            $form.append(tb.$h("input", { type: "hidden", name: `${key}[${key2}]`, value }));
          }
        }
        $form.append(tb.$h("input", { type: "hidden", name: key, value }));
      }
      return $form;
    }

    function getDlCartItem($form, response) {
      const code = $form.find("input[name=productCode]").val();
      const priceId = tb.common.parseNumber($form.find("input[name=priceId]").val());

      const oldCartItems = (getShoptetDataLayer("cart") || []).filter(item => (!code || item.code === code) && (!priceId || item.priceId === priceId));
      return (response.getFromPayload("cartItems") || []).find(item => {
        if(!((!code || item.code === code) && (!priceId || item.priceId === priceId)))
          return false;

        const oldItem = oldCartItems.find(i => i.itemId === item.itemId);
        return !oldItem || oldItem.quantity < item.quantity;
      });
    }

    let ignoreNextNotification = false;
    function makeCartAjaxRequest(url, payload, silent) {
      const $form = createForm(url, shoptet.ajax.requestTypes.post, payload);

      return new Promise((resolve, reject) => {
        AjaxSubmitFormHooks.ajaxSubmitForm(url, $form[0], "functionsForCart", "cart", true, (callbacks) => {
          callbacks.success = tb.hooks.hookFn(callbacks.success, (success, args, context) => {
            if(silent) {
              ignoreNextNotification = true;
              if(url === shoptet.config.addToCartUrl)
                shoptet.cartShared.silentAddition = true; // handle multiple concurrent silent requests
            }
            const response = args[0];
            const dlCartItem = getDlCartItem($form, response);
            const res = success.apply(context, args);
            resolve([response, dlCartItem]);
            return res;
          });
          callbacks.failed = tb.hooks.hookFn(callbacks.failed, (failed, args, context) => {
            const res = failed.apply(context, args);
            reject(args[0]);
            return res;
          });
        });
      });
    }

    function submitPrAction($form) {
      return new Promise((resolve, reject) => {
        let valid = true;
        AjaxSubmitFormHooks.hookAjaxSubmitFormCallbacks((callbacks, args) => {
          if(!valid)
            return;
          callbacks.success = tb.hooks.hookFn(callbacks.success, (success, args, context) => {
            const response = args[0];
            const dlCartItem = getDlCartItem($form, response);
            const res = success.apply(context, args);
            resolve([response, dlCartItem]);
            return res;
          });
          callbacks.failed = tb.hooks.hookFn(callbacks.failed, (failed, args, context) => {
            const res = failed.apply(context, args);
            reject(args[0]);
            return res;
          });
        });
        $form.trigger("submit");
        valid = false;
      });
    }

    function addProductToCart(product, amount, silent) {
      if(!amount)
        return Promise.resolve();

      const payload = { amount, };
      if(product.priceId) {
        if(product.productId)
          payload.productId = product.productId;
        payload.priceId = product.priceId;
      } else if(product.productCode || product.sku)
        payload.productCode = product.productCode || product.sku;
      else if(product.productId) {
        payload.productId = product.productId;
        payload.parameterValueId = product.parameterValueId || {};
      } else if(product.url) {
        return tb.ajax.loadDocument(product.url).then($doc => {
          const productId = tb.common.parseNumber($doc.find("#product-detail-form input[name=productId]").val());
          const priceId = tb.common.parseNumber($doc.find("#product-detail-form input[name=priceId]").val());
          if(!productId || !priceId)
            throw new Error("Unable to fetch priceId for " + product.url);
          return addProductToCart({ ...product, productId, priceId }, amount, silent);
        });
      } else
        throw new Error("Invalid product: " + product);

      for(let [key, value] of Object.entries(product)) {
        if(key.startsWith("surchargeParameterValueId"))
          payload[key] = value;
      }

      return makeCartAjaxRequest(shoptet.config.addToCartUrl, payload, silent);
    }

    function removeFromCart(itemOrProduct, silent, cartItems) {
      if(itemOrProduct.itemId)
        return makeCartAjaxRequest(shoptet.config.removeFromCartUrl, {
          itemId: itemOrProduct.itemId
        }, silent).then(() => true);

      return Promise.resolve(cartItems || loadCart(true).then(getCartContents))
        .then(cartItems => filterCartItems(cartItems, itemOrProduct))
        .then(items => {
          return Promise.all(items, ({ itemId }) => {
            return removeFromCart({ itemId }, silent);
          }).then(() => !!items.length);
        });
    }

    function updateQuantityInCart(itemOrProduct, amount, silent, cartItems) {
      if(itemOrProduct.itemId) {
        if(!itemOrProduct.product.priceId)
          throw new Error("Both itemId and product.priceId have to be set");
        if(!amount)
          return removeFromCart(itemOrProduct);
        return makeCartAjaxRequest(shoptet.config.updateCartUrl, {
          itemId: itemOrProduct.itemId,
          priceId: itemOrProduct.product.priceId,
          amount: amount
        }, silent).then(() => true);
      }

      return Promise.resolve(cartItems || loadCart(true).then(getCartContents))
        .then(cartItems => filterCartItems(cartItems, itemOrProduct))
        .then(cartItems => {
          const firstItem = cartItems.shift();
          if(!firstItem)
            return addProductToCart(itemOrProduct, amount, silent);
          let firstItemPromise;
          if(firstItem.amount !== amount)
            firstItemPromise = updateQuantityInCart(firstItem, amount, silent, cartItems);
          return Promise.all([
            firstItemPromise,
            ...(cartItems.map(item => {
              return removeFromCart(item, silent, cartItems);
            }))
          ]).then(() => !!(firstItemPromise || cartItems.length));
        });
    }

    function lockCartRow($row, allowRemove) {
      $row = $($row);

      const $quantity = $row.find(".quantity");
      $quantity.addClass("readonly");
      $quantity.find(".increase, .decrease").addClass("hidden");
      $quantity.find("input").prop("readonly", true);
      $quantity.attr("title", t.amountLocked);

      if(!allowRemove)
        $row.find(".remove-item").css("visibility", "hidden");
    }

    function hookAfterAddToCart(callback) {
      tb.hooks.hookFn("shoptet.tracking.handleAction", (handleAction, args, context) => {
        const [form, response] = args;
        const $form = $(form);
        const formAction = shoptet.tracking.getFormAction($form.attr("action"));

        if(formAction !== shoptet.config.addToCartUrl)
          return handleAction.apply(context, args);

        const dlCartItem = getDlCartItem($form, response);
        handleAction.apply(context, args);
        callback($form, response, dlCartItem);
      });
    }

    let t;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        AjaxSubmitFormHooks.init(true);

        t = tb.helpers.getStrings(config);

        tb.hooks.hookFn("AjaxResponse.prototype.showNotification", (showNotification, args, context) => {
          if(ignoreNextNotification) {
            ignoreNextNotification = false;
            return context;
          }
          return showNotification.apply(context, args);
        });
      },
    });

    return {
      config, init,
      loadCart, getCartContents, getCartWidgetContents, filterCartItems, submitPrAction,
      addProductToCart, removeFromCart, updateQuantityInCart, lockCartRow, hookAfterAddToCart,
    };
  })(tb.$h, tb.$t, tb.m.AjaxSubmitFormHooks);

  const DetailUpsell = (function($h, $t, ProductInfo, CartUtils, AdvancedOrderHooks) {
    const config = {
      fallbackLang: "cs",
      trans: {
        cs: {
          inStockRegex: /skladem/i,
          simpleParameterNames: ["Doplňkový produkt", "Doplňkové produkty"],
          urlParameterName: /Doplňkový produkt ([0-9]+)/,
          nameParameterName: /Název doplňkového produktu ([0-9]+)/,
          descriptionParameterName: /Popis doplňkového produktu ([0-9]+)/,
        },
        sk: {
          inStockRegex: /na sklade|skladom|skladem/i,
          simpleParameterNames: ["Doplňkový produkt", "Doplňkové produkty", "Doplnkový produkt", "Doplnkové produkty"],
          urlParameterName: /Dopl[ňn]kový produkt ([0-9]+)/,
          nameParameterName: /Náz[eo]v dopl[ňn]kového produktu ([0-9]+)/,
          descriptionParameterName: /Popis dopl[ňn]kového produktu ([0-9]+)/,
        }
      },
      hideOutOfStock: true,
    };

    function loadProducts(paramProducts) {
      return Promise.all(paramProducts.map(({ url, name, description }) => {
        return tb.ajax.loadDocument(url).then($page => {
          const $detail = $page.find(".p-detail");
          if(!$detail.length)
            return null;
          const info = ProductInfo.getDetailProductInfo($detail);

          info.basicDescription = $detail.find(".basic-description").children("p,div").filter(function() {
            return !!$(this).text().trim();
          }).first().html();

          if(name)
            info.name = name;
          if(description)
            info.basicDescription = description;

          return info;
        }).catch(err => {
          console.error(`Failed to load ${url}: `, err);
          return null;
        });
      })).then(products => products.filter(info => {
        if(!info)
          return false;
        if(config.hideOutOfStock && !info.availabilityHtml.match(t.inStockRegex))
          return false;
        return true;
      }));
    }

    let cartItemsPromise;
    function loadCartItems() {
      if(!cartItemsPromise)
        cartItemsPromise = CartUtils.loadCart(true).then($cartWrapper => CartUtils.getCartContents($cartWrapper));

      return cartItemsPromise;
    }

    const UpsellItem = ({ info, }) => {
      let description = $h("div", [info.basicDescription]).text().trim(); // convert html to text
      // if(config.maxDescriptionLength > -1)
      //   description = truncate(description, config.maxDescriptionLength, "...");

      const $price = $h(".he-detail-upsell-item__price", [info.priceHtml]);
      const $priceStandard = $price.find(".price-standard");
      $priceStandard.text($priceStandard.text().trim());
      const $priceSave = $price.find(".price-save");
      $priceSave.text(`, sleva ${$priceSave.text().trim().replace("–", "")}`).insertAfter($price.find(".price-standard"));

      return $h("label.he-detail-upsell-item", [
        $h("input", { type: "checkbox" }),
        $h(".he-detail-upsell-item__image", { style: `background-image:url("${info.image}")` }),
        $h(".he-detail-upsell-item__info", [
          $h(".he-detail-upsell-item__name-desc", [
            $h(".he-detail-upsell-item__name", info.name),
            description && $h(".he-detail-upsell-item__description", description),
          ]),
          $price,
        ]),
      ]).data({ info });
    }

    function transformAdvancedOrderContent(content, { dlCartItem, upsellProducts, }) {
      console.log(content, upsellProducts);

      if(!upsellProducts.length)
        return content;

      const $div = $h("div", [content]);
      $div.find(".h2").after(upsellProducts.map(info => $h(".h2.he-upsell-line", "+\u00a0" + info.name)));
      return $div.html();
    }

    let lastAddedProductInfo;
    let t;
    const init = tb.dom.createModuleInitializer({
      dependencies: [
        ProductInfo, CartUtils, AdvancedOrderHooks,
      ],
      earlyInit() {
        t = tb.helpers.getStrings(config);

        CartUtils.hookAfterAddToCart(($form, response, dlCartItem) => {
          if(!$form.is(".product-detail-form,#product-detail-form"))
            return;

          const $detail = $form.closest(".p-detail");
          const amount = tb.common.parseNumber($form.find("input[name=amount]").val());

          const upsellProducts = tb.dom.$map($detail.find(".he-detail-upsell-item"), $item => {
            if(!$item.find("input:checked").length)
              return null;
            const { info } = $item.data();
            return info;
          }).toArray().filter(Boolean);
          if(!upsellProducts.length)
            return;
          Promise.all(upsellProducts.map(product => CartUtils.addProductToCart(product, amount, true)));
          lastAddedProductInfo = { $form, response, dlCartItem, upsellProducts };
        });

        AdvancedOrderHooks.addContentFilter((content) => {
          const info = lastAddedProductInfo;
          if(info) {
            lastAddedProductInfo = null;
            return transformAdvancedOrderContent(content, info);
          }
          return content;
        });
      },
      earlyRender() {
        tb.dom.$eachOneTime(".p-detail", async $detail => {
          const paramProducts = [], paramProductsById = {};
          for(let { name, value, $tr } of tb.sh.getDescriptiveParameters($detail)) {
            let m;
            if(t.simpleParameterNames.includes(name)) {
              const urls = value.split(";").map(s => s.trim()).filter(Boolean);
              paramProducts.push(...urls.map(url => ({ url })));
            } else if(t.urlParameterName && (m = name.match(t.urlParameterName))) {
              const p = paramProductsById[m[1]] = paramProductsById[m[1]] ?? {};
              p.url = value.trim();
              if(!paramProducts.includes(p))
                paramProducts.push(p);
            } else if(t.nameParameterName && (m = name.match(t.nameParameterName))) {
              const p = paramProductsById[m[1]] = paramProductsById[m[1]] ?? {};
              p.name = value.trim();
            } else if(t.descriptionParameterName && (m = name.match(t.descriptionParameterName))) {
              const p = paramProductsById[m[1]] = paramProductsById[m[1]] ?? {};
              p.description = value.trim();
            } else {
              continue;
            }
            $tr.css("display", "none");
          }
          if(!paramProducts.length)
            return;
          const products = await loadProducts(paramProducts);
          console.log(products);

          if(!products.length)
            return;

          $h(".he-detail-upsell", [
            $h(".he-detail-upsell__title", "Přidejte ještě výhodně k objednávce:"),
            $h(".he-detail-upsell__items", products.map(info => UpsellItem({ info }))),
          ]).insertBefore($detail.find(".p-info-wrapper .availability-value"));
        }, "DetailUpsell");
      },
    });

    return { config, init };
  })(tb.$h, tb.$t, tb.m.ProductInfo, CartUtils, tb.m.AdvancedOrderHooks);

  const InlineProductDetail = (function() {
    const config = {
      productUrls: [
        "/ashwagandha-extrakt-z-korene/",
        "/coffee-mix-arabska-kava-s-6-adaptogeny/",
        "/vyhodny-balicek-adaptogenu/"
      ]
    };

    let detailIndex = 0;
    function prepareDetail($detail, url) {
      let i = detailIndex++;

      const $extendedDesc = tb.$h(".extended-description", [
        $detail.find(".extended-description .detail-parameters"),
        $detail.find(".vote-wrap"),
      ]).hide();
      $detail.find(".p-detail-inner").nextAll().remove();
      $detail.append($extendedDesc); // restore .detail-parameters for other scripts
      $detail.addClass("inline-product");
      $detail.find(".p-detail-inner-header h1").wrapInner(tb.$h("a", { href: url }));
      $detail.find("#product-detail-form").addClass("product-detail-form").removeAttr("id");
      $detail.find("[data-gallery]").attr("data-gallery", (tmp, value) => value.replace("gallery", "gallery" + i));
      $detail.find("a[data-toggle=tab]").removeAttr("data-toggle").attr("href", (tmp, href) => url + href);

      const $variantsScript = $detail.find("script:contains(shoptet.variantsSplit.necessaryVariantData)")
      if($variantsScript.length) {
        eval($variantsScript.text());
        $detail.data("necessaryVariantData", tb.sh.getNecessaryVariantData(true));
      }
    }

    function loadInlineProducts() {
      return Promise.all(config.productUrls.map(url => {
        return tb.ajax.loadDocument(url).then($doc => {
          const $detail = $doc.find(".p-detail");
          prepareDetail($detail, url);
          return $detail;
        });
      }));
    }

    function getImageName(url) {
      const m = url.match(/\/([^/]+)\?/);
      return m && m[1];
    }

    function patchedReplaceImage(bigImage) {
      const bigImageName = getImageName(bigImage);
      const $thumb = $(".p-thumbnail").filter(tb.common.iteratee$($t => getImageName($t.attr("href")) === bigImageName));
      if(!$thumb.length)
        return;
      const $mainImage = $thumb.closest(".p-image-wrapper").find(".p-image");
      if($(".image360").length) {
        $(".image360").hide()
      }
      $mainImage.show();
      const $mainImageLink = $mainImage.find("a");
      shoptet.products.highlightActiveThumbnail(bigImageName);
      $mainImage.find("img").attr("src", bigImage);
      $mainImageLink.attr({
        href: bigImage,
        "data-href": bigImage.replace(/\/big\//, "/orig/")
      });
      const $cloudZoom = $thumb.closest(".p-image-wrapper").find(".cloud-zoom");
      if($cloudZoom.length) {
        clearTimeout(shoptet.runtime.cloudZoom);
        shoptet.runtime.cloudZoom = setTimeout((function() {
          $cloudZoom.data("zoom")?.destroy();
          $cloudZoom.CloudZoom(shoptet.config.cloudZoomOptions)
        }), 201)
      }
    }

    function patchedHightlightActiveThumbnail(imageName) {
      const $thumb = $(".p-thumbnail").filter(tb.common.iteratee$($t => getImageName($t.attr("href")) === imageName));
      if(!$thumb.length)
        return;
      const $thumbnailsInner = $thumb.closest(".p-thumbnails-inner");
      $thumbnailsInner.find("a.show360image,a.p-thumbnail").removeClass("highlighted");
      $thumb.addClass("highlighted");
    }

    function patchedCheckThumbnails(direction, action, reset) {
      return $(".p-thumbnails").map(tb.common.iteratee$($thumbnailsWrapper => {
        var $thumbnails = $thumbnailsWrapper.find(".p-thumbnails-inner > div");
        var $thumbnailsInner = $thumbnailsWrapper.find(".p-thumbnails-inner");
        if(direction == "horizontal") {
          var thumbnailsWrapperDimensions = $thumbnailsWrapper.width();
          var thumbnailsDimensions = $thumbnails.width();
          var thumbnailsScroll = parseInt($thumbnailsInner.css("left"))
        } else {
          var thumbnailsWrapperDimensions = $thumbnailsWrapper.height();
          var thumbnailsDimensions = $thumbnails.height();
          var thumbnailsScroll = parseInt($thumbnailsInner.css("top"))
        }
        var diff = thumbnailsDimensions + thumbnailsScroll;
        var sizes = {
          $thumbnailsWrapper,
          thumbnailsScroll: thumbnailsScroll,
          thumbnailsDimensions: thumbnailsDimensions,
          thumbnailsWrapperDimensions: thumbnailsWrapperDimensions,
          diff: diff
        };
        if(action == "check") {
          return sizes
        } else {
          if(reset == true) {
            if(direction == "horizontal") {
              $thumbnailsInner.css("left", 0)
            } else {
              $thumbnailsInner.css("top", 0)
            }
            setTimeout((function() {
              shoptet.products.checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll)
            }
            ), shoptet.config.animationDuration)
          } else {
            shoptet.products.checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll)
          }
        }
      })).toArray();
    }

    function patchedSwitchThumbnails(direction, $detail) {
      var sizesArray = shoptet.products.checkThumbnails(shoptet.config.thumbnailsDirection, "check", false);
      for(let sizes of sizesArray) {
        if($detail && !sizes.$thumbnailsWrapper.closest(".p-detail").is($detail))
          continue;
        const $el = sizes.$thumbnailsWrapper.find(".p-thumbnails-inner");
        sizes.$thumbnailsWrapper.find(".thumbnail-next, .thumbnail-prev").addClass("clicked");
        if(shoptet.config.thumbnailsDirection == "horizontal") {
          var thumbnailsScroll = "left"
        } else {
          var thumbnailsScroll = "top"
        }
        if(direction == "prev") {
          if(sizes["diff"] - sizes["thumbnailsWrapperDimensions"] < sizes["thumbnailsWrapperDimensions"]) {
            var thumbnailsScrollVar = sizes["thumbnailsDimensions"] - sizes["thumbnailsWrapperDimensions"]
          } else {
            var thumbnailsScrollVar = -parseInt($el.css(thumbnailsScroll)) + sizes["thumbnailsWrapperDimensions"]
          }
          $el.css(thumbnailsScroll, -thumbnailsScrollVar)
        } else {
          sizes.$thumbnailsWrapper.find(".thumbnail-next").addClass("clicked");
          if(sizes["thumbnailsScroll"] + sizes["thumbnailsWrapperDimensions"] > 0) {
            var thumbnailsScrollVar = 0
          } else {
            var thumbnailsScrollVar = sizes["thumbnailsWrapperDimensions"] + sizes["thumbnailsScroll"]
          }
          $el.css(thumbnailsScroll, thumbnailsScrollVar)
        }
        setTimeout((function() {
          shoptet.products.checkThumbnails(shoptet.config.thumbnailsDirection, "set", false);
          $el.find("img").unveil();
          sizes.$thumbnailsWrapper.find(".thumbnail-next, .thumbnail-prev").removeClass("clicked")
        }
        ), shoptet.config.animationDuration)
      }
    }

    function initSplitParameters() {
      $(".p-detail").each(tb.common.iteratee$($detail => {
        $detail.find(".variant-list .hidden-split-parameter, .variant-list .split-parameter").on("change ShoptetSelectedParametersReset", e => {
          shoptet.scripts.signalCustomEvent("ShoptetSplitVariantParameterChange", e.target);
          updateSelectedVariant($detail, true);
        });
        $detail.find(".surcharge-list .surcharge-parameter").on("change ShoptetSelectedParametersReset", e => {
          updateSelectedVariant($detail, false);
        });
        updateSelectedVariant($detail, false);
      }));
    }

    function enableAddingToCart($detail) {
      $detail.removeClass("disabled-add-to-cart");
    }

    function disableAddingToCart($detail, reason) {
      $detail.addClass("disabled-add-to-cart").data("reasonToDisable", reason);
    }

    function updateSelectedVariant($detail, isUserAction) {
      const selectedParameterValues = tb.sh.getSelectedParameterValues($detail, true);
      const hasMissingValues = Object.values(selectedParameterValues).some(v => !v);
      const variantCode = tb.sh.joinVariantCode(selectedParameterValues);
      const necessaryVariantData = $detail.data("necessaryVariantData");

      if(necessaryVariantData) {
        const data = necessaryVariantData[variantCode];
        // console.log($detail, selectedParameterValues, variantCode, data, necessaryVariantData);
        if(data) {
          const $form = $detail.find("form.product-detail-form");
          const $formAmount = $form.find(".amount");
          $form.find("input[name=priceId]").val(data.id);
          shoptet.tracking.trackProducts($form[0], data.id, "ViewContent", [shoptet.tracking.trackFacebookPixel]);
          if(isUserAction)
            shoptet.tracking.trackProducts($form[0], data.id, "detail", [shoptet.tracking.trackGoogleProductDetail])
          if(data.variantImage)
            shoptet.products.replaceImage(data.variantImage.big);
          if(data.isNotSoldOut) {
            enableAddingToCart($detail);
            hideMsg()
          } else {
            disableAddingToCart($detail, shoptet.messages["unavailableVariant"]);
            if(isUserAction)
              showMessage(shoptet.variantsCommon.reasonToDisable, "error", "", false, false)
          }
          $formAmount.val(data.minimumAmount).data({
            min: data.minimumAmount,
            max: data.maximumAmount,
            decimals: data.decimalCount
          }).attr({
            min: data.minimumAmount,
            max: data.maximumAmount
          });
          // var $cofidis = $("#cofidis");
          // if($cofidis.length) {
          //   shoptet.cofidis.calculator($(".price-final-holder:visible"), $cofidis)
          // }
          shoptet.variantsCommon.updateQuantityTooltips($form, data.minimumAmount, data.maximumAmount);
          shoptet.scripts.signalCustomEvent("ShoptetVariantAvailable");
        } else {
          const reason = shoptet.messages[hasMissingValues ? "chooseVariant" : "unavailableVariant"];
          disableAddingToCart($detail, reason);
          if(isUserAction)
            showMessage(reason, "error", "", false, false);
          shoptet.scripts.signalCustomEvent("ShoptetVariantUnavailable")
        }

        $detail.find(".p-detail-inner .parameter-dependent, .p-code .parameter-dependent").addClass(shoptet.variantsCommon.noDisplayClasses);
        const classToDisplay = data ? data.tb_code : "default-variant";
        $detail.find(".p-detail-inner .parameter-dependent." + classToDisplay + ", .p-code .parameter-dependent." + classToDisplay).removeClass(shoptet.variantsCommon.noDisplayClasses);
      }

      let finalPrice = 0, additionalPrice = 0;
      $detail.find(".surcharge-parameter option:not([data-choose]):selected").each(tb.common.iteratee$($option => {
        finalPrice += $option.data("surchargeFinalPrice");
        additionalPrice += $option.data("surchargeAdditionalPrice");
      }));
      $detail.find(".price-final-holder.calculated").each(tb.common.iteratee$($el => {
        $el.find(".calculated-price").text(($el.data("price") + finalPrice).ShoptetFormatAsCurrency());
      }));
      $detail.find(".price-additional-holder.calculated").each(tb.common.iteratee$($el => {
        $el.find(".calculated-price").text(($el.data("price") + additionalPrice).ShoptetFormatAsCurrency());
      }));
    }

    function patchedHandleSubmit($form) {
      if($form.is(".product-detail-form")) {
        const $detail = $form.closest(".p-detail");
        if($detail.hasClass("disabled-add-to-cart")) {
          showMessage($detail.data("reasonToDisable"), "error", "", false, false);
          setTimeout(() => scrollToEl($form), shoptet.config.animationDuration);
          return false;
        }
      }

      return true;
    }

    let $target;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        if(!$("body.type-index").length)
          return false;

        // replace direct references to shoptet.products functions
        $("body").on("click", ".thumbnail-next", function(e) {
          e.preventDefault();
          e.stopPropagation();
          if(!$(this).hasClass("clicked")) {
            shoptet.products.switchThumbnails("prev", $(this).closest(".p-detail"))
          }
        }).on("click", ".thumbnail-prev", function(e) {
          e.preventDefault();
          e.stopPropagation();
          if(!$(this).hasClass("clicked")) {
            shoptet.products.switchThumbnails("next", $(this).closest(".p-detail"))
          }
        }).on("click", ".p-thumbnail", function(e) {
          e.preventDefault();
          e.stopPropagation();
          shoptet.products.replaceImage($(this).attr("href"));
        });

        shoptet.products.replaceImage = patchedReplaceImage;
        shoptet.products.highlightActiveThumbnail = patchedHightlightActiveThumbnail;
        shoptet.products.checkThumbnails = patchedCheckThumbnails;
        shoptet.products.switchThumbnails = patchedSwitchThumbnails;

        tb.hooks.hookFn("shoptet.variantsCommon.handleSubmit", (handleSubmit, args, context) => {
          return handleSubmit.apply(context, args) && patchedHandleSubmit.apply(context, args);
        });

        $target = $("body.desktop .homepage-box.before-carousel .container, body.mobile.in-index main#content");
        loadInlineProducts().then($els => {
          const $div = tb.$h(".inline-products", $els).appendTo($target);

          $div.find("img").unveil();
          $div.find(".cloud-zoom").CloudZoom(shoptet.config.cloudZoomOptions);
          initColorbox();
          shoptet.products.checkThumbnails(shoptet.config.thumbnailsDirection, "set", true);
          initSplitParameters();

          tb.hooks.signalDomLoad();
        });
      },
      render() {
        $(".inline-products").appendTo($target);
        $("body.mobile.in-index .inline-products").insertAfter(".usps__wrap");
      }
    });

    return { config, init };
  })();

  const MessageDismissFix = (function() {
    const config = {
      manualDismissErrors: false
    };

    function appendDismissButtons() {
      $(".msg.msg-error").each(function() {
        if(tb.dom.oneTime(this, "MessageDismissFix"))
          $(this).append(tb.$h("button.msg__dismiss-btn", ["&times;"])).addClass("msg-dismissible");
      });
    }

    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        tb.hooks.hookFn("window.showMessage", function(showMessage, args, context) {
          clearTimeout(shoptet.runtime.dismiss);
          showMessage.apply(context, args);

          const type = args[1];
          if(config.manualDismissErrors && type === "error") {
            clearTimeout(shoptet.runtime.dismiss);
            appendDismissButtons();
          }
        });

        $("body").on("click", ".msg__dismiss-btn", function(e) {
          e.preventDefault();
          hideMsg(true);
        });
        $("body").on("click", function(e) {
          if($(".msg.msg-error").length && !$(e.target).closest(".msg").length)
            hideMsg(true);
        });
        $("html").on("click", ".msg.msg-dismissible", function(e) {
          e.stopImmediatePropagation();
        });
      }
    });

    return { config, init };
  })();

  const AjaxModalResize = (function() {
    const config = {
      rules: [
        {
          condition: html => html.includes(`class="advanced-order"`),
          className: "advanced-order-modal",
          //   width: 940
          fixHeight: true,
        },
        {
          condition: html => html.includes(`class="shipping-options-popup"`),
          className: "shipping-options-modal",
          // width: 940,
          fixHeight: true,
          transformContent(html) {
            const $doc = tb.$h("div", [html]);

            tb.$h(".close-btn-wrap", [
              tb.$h("button.btn.btn-secondary.close-btn", { type: "button", onclick: "shoptet.modal.close()" }, "Zavřít")
            ]).appendTo($doc.find(".shipping-options-popup"));

            return $doc.html();
          }
        },
      ]
    };

    function checkCondition(condition, options) {
      if(!condition)
        return true;
      if(typeof options.html !== "string")
        return false;
      return condition(options.html);
    }

    function getCustomWidth($colorbox) {
      for(let rule of config.rules) {
        if(rule.className && $colorbox.hasClass(rule.className))
          return rule.width;
      }
    }

    function init() {
      tb.hooks.hookFn("shoptet.modal.open", function(open, args, context) {
        const options = args[0];
        for(let rule of config.rules) {
          if(!checkCondition(rule.condition, options))
            continue;
          if(rule.width !== undefined)
            options.width = rule.width;
          options.className = (options.className || "") + " " + (rule.className || "");
          if(rule.fixHeight)
            options.onComplete = tb.hooks.hookFn(options.onComplete || tb.common.constant(), function(onComplete, args, context) {
              onComplete.apply(context, args);
              $("#cboxLoadedContent").find("img").on("load", function(e) {
                shoptet.modal.shoptetResize();
              }).unveil();
              shoptet.modal.shoptetResize();
            });
          if(options.html && rule.transformContent)
            options.html = rule.transformContent(options.html);
        }
        return open.apply(context, args);
      });
      tb.hooks.hookFn("shoptet.modal.shoptetResize", function(shoptetResize, args, context) {
        var width;
        var $colorbox = $("#colorbox");
        if((width = getCustomWidth($colorbox)) !== undefined) {
          ;
        } else if($colorbox.hasClass("colorbox-xs") || $colorbox.hasClass(shoptet.modal.config.classXs)) {
          width = shoptet.modal.config.widthXs
        } else if($colorbox.hasClass("colorbox-sm") || $colorbox.hasClass(shoptet.modal.config.classSm)) {
          width = shoptet.modal.config.widthSm
        } else if($colorbox.hasClass("colorbox-lg") || $colorbox.hasClass(shoptet.modal.config.classLg)) {
          width = shoptet.modal.config.widthLg
        } else {
          width = shoptet.modal.config.widthMd
        }
        if(!detectResolution(shoptet.config.breakpoints.lg)) {
          var responsiveWidth;
          if(shoptet.abilities.about.generation === 3) {
            responsiveWidth = $(".content-wrapper").width()
          } else {
            responsiveWidth = $("#content").width()
          }
          width = responsiveWidth > width ? width : responsiveWidth;
          if($colorbox.hasClass("productDetail")) {
            width = shoptet.modal.config.maxWidth
          }
        }
        shoptet.modal.resize({
          width: width
        })
      });

      // tb.hooks.hookFn("shoptet.modal.open", function(open, args, context) {
      //   $("#colorbox, #cboxOverlay").each(function() {
      //     const oldClassName = $(this).data("oldClassName");
      //     if(oldClassName !== undefined)
      //       $(this).prop("className", oldClassName);
      //   });
      //   return open.apply(context, args);
      // });
      // tb.hooks.hookFn("shoptet.modal.close", function(close, args, context) {
      //   $("#colorbox, #cboxOverlay").each(function() {
      //     $(this).data("oldClassName", $(this).prop("className"));
      //   });
      //   return close.apply(context, args);
      // });
    }

    return { init };
  })();

  const NormalizeMobileHtml = (function($h, $t) {
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        if(!$("body.mobile").length)
          return false;

        if($("body.type-index").length) {
          const $wrapper = $("#content-wrapper");
          $wrapper.after([
            $h(".content-wrapper.homepage-box.before-carousel", [
              $h(".content-wrapper-in", [
                $h(".container", [
                  $wrapper.find(".banners-row"),
                ]),
              ]),
            ]),
            $h(".content-wrapper.container", [
              $h(".content-wrapper-in", [
                $h("main.content", [
                  $wrapper.find(".content").contents(),
                ]),
              ]),
            ]),
          ]);

          // const $middleBanners = $(".content-wrapper .banners-content.body-banners");
          // if($middleBanners.length) {
          //   $middleBanners.closest(".content-wrapper").after([
          //     $h(".content-wrapper.homepage-box.middle-banners-wrapper", [
          //       $h(".content-wrapper-in", [
          //         $h(".container", [
          //           $middleBanners,
          //         ])
          //       ])
          //     ]),
          //     $h(".content-wrapper.container", [
          //       $h(".content-wrapper-in", [
          //         $h("main.content", [
          //           $middleBanners.nextAll()
          //         ])
          //       ])
          //     ])
          //   ]);
          // }
        }
      },
    });

    return { init };
  })(tb.$h, tb.$t);

  const CategorySortSelect = (function($h, $t) {
    const config = {
      fallbackLang: "cs",
      trans: {
        cs: {},
      },
    };

    let t;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        t = tb.helpers.getStrings(config);
      },
      earlyRender() {
        tb.dom.$eachOneTime("#category-header>form", $form => {
          const $fieldset = $form.find("fieldset");
          const $select = $h("select.jh-category-sort-select", tb.dom.$map($fieldset.find("input[name=order]"), $input => {
            return $h("option", { selected: $input.prop("checked") }, $input.next("label").text()).data({ $input });
          }));
          $select.on("change", function() {
            const { $input } = $(this).find("option:selected").data();
            if($input?.length)
              $input.prop("checked", true).trigger("click");
          });
          $fieldset.after($h(".jh-category-sort-select-wrap", $select));
        }, "CategorySortSelect");
      },
    });

    return { config, init };
  })(tb.$h, tb.$t);

  const AdvancedOrderProductAppendix = (function($h, $t, AdvancedOrderHooks) {
    const config = {
      fallbackLang: "cs",
      trans: {
        cs: {},
      },
    };

    function extractProductInfo($form) {
      const info = {};

      let $up;
      if($form.is("#product-detail-form")) {
        info.name = tb.dom.getTextShallow($(".p-detail h1").first()).trim();
        // const $appendixTd = $("tr.product-appendix td");
        info.appendix = $(".p-detail-inner-header span.product-appendix").text().trim();
      } else if(($up = $form.closest(".cart-upsell-product")).length) {
        const { info: upInfo } = $up.data();
        if(upInfo)
          Object.assign(info, upInfo);
      }

      return info;
    }

    let t;
    const init = tb.dom.createModuleInitializer({
      dependencies: [
        AdvancedOrderHooks
      ],
      earlyInit() {
        t = tb.helpers.getStrings(config);

        AdvancedOrderHooks.addContentFilter(function(content, $lastForm) {
          const { name, appendix } = extractProductInfo($lastForm);
          const $div = $h("div", [content]);

          const $h2 = $div.find(".h2").first();
          const aoName = tb.dom.getTextShallow($h2).trim();
          if(name && appendix && aoName.startsWith(name)) {
            $h2.html([
              $t(name),
              // $h("span.he-product-appendix", appendix),
              $h2.children(),
            ]);
          }

          return $div.html();
        });
      },
      earlyRender() {},
    });

    return { config, init };
  })(tb.$h, tb.$t, tb.m.AdvancedOrderHooks);

  const HerbsBits = (function($h, $t, AdvancedOrderHooks, Banners, NormalizeMobileHtml, CategorySortSelect, AdvancedOrderProductAppendix) {
    const config = {
      defaultExpandMenuItems: ".menu-item-706",
      // disableCouponsUntil: "2023-11-27T00:00:00+01:00",
      fallbackLang: "cs",
      trans: {
        cs: {
          hpBlogUrl: "/magazin/",
          // hpCatsBigHeading: "Poznejte sílu bylinek. Vyberte si z oblíbených kategorií",
          // hpCatsBigItemSelector: ".menu-item-706",
          hpCatsSmallHeading: "Přírodní doplňky stravy přímo pro vás",
          hpCatsSmallItemSelector: ".menu-item-846",
        }
      }
    };

    function initProductBlock($p) {
      const $availabilityAmount = $p.find(".availability-amount");
      if($availabilityAmount.length) {
        const text = $availabilityAmount.text();
        $availabilityAmount.text(text.replace(/[\(\)]/g, "").replace(/>/, ">\u00a0"));
      }

      const $priceStandard = $p.find(".price-standard");
      if($priceStandard.length) {
        const textNode = $priceStandard.prop("previousSibling"); // od
        if(textNode)
          $priceStandard.prepend(textNode.cloneNode());
        $priceStandard.prependTo($p.find(".prices"));
      }

      $p.find(".flag .price-save").html(function(i, v) {
        return v.replace("–", "");
      });
      $p.find(".flag-discount").html(function(i, v) {
        return v.replace('od', '');
      });

      $p.find(".product-appendix").addClass("category-appendix").removeClass("product-appendix");
      const $appendix = $p.find(".category-appendix");
      $appendix.insertAfter($appendix.parent());

      const inStock = Boolean($p.find(".availability").text().match(/sklad[eo]m|raktáron/i));
      $p.toggleClass("ji-out-of-stock", !inStock);
    }

    function initAoProductBlock($p) {
      const url = $p.find("a.name").attr("href");
      return tb.ajax.loadDocument(url).then($doc => {
        const $detail = $doc.find(".p-detail");
        const $detailParameters = $detail.find(".extended-description .detail-parameters");
        const appendix = $detailParameters.find("th:contains('Dodatečný název')").parent().find("td").text();
        if(!appendix)
          return;
        $h(".p-appendix", appendix).insertAfter($p.find("a.name"));
      });
    }

    function filterAdvancedOrderContent(content) {
      const $div = tb.$h("div", [content]);
      return Promise.all(tb.dom.$map($div.find(".p"), initAoProductBlock).toArray()).then(() => {
        return $div.html();
      });
    }

    const HpCats = ({ $menuItem, heading, className }) => $h(".he-hp-cats", [
      $h("h3.he-hp-cats__heading", heading),
      $h(".he-hp-cats__items", tb.dom.$map($menuItem.find(".menu-level-2>li>a"), $a => {
        const $img = $a.find("img");
        const origSrc = $img.attr("data-src") || $img.attr("src");
        return $h("a.he-hp-cat", { href: $a.attr("href") }, [
          $h("img.he-hp-cat__image", { src: tb.sh.convertImageUrl(origSrc, "orig") }),
          $h(".he-hp-cat__title", $a.next().find(">a>span").text()),
        ]);
      }))
    ]).addClass(className);

    const BlogBlock = ({ url, title, limit = 3 }) => {
      let $inner;
      tb.ajax.loadDocument(url).then($doc => {
        const $items = $doc.find("#newsWrapper .news-item");
        $inner.html($h("#newsWrapper.news-wrapper", tb.dom.$filter($items.slice(0, limit), $item => {
          const $title = $item.find("a.title");
          const url = $title.attr("href");
          $title.clone().html("Celý článek").addClass("arrow")
            .insertAfter($item.find(".text"));

          // hide current post
          return url !== location.pathname;
        })));
        tb.hooks.signalDomLoad();
      });

      return $h(".blog-block.--index", [
        $h("h2.blog-block__title", title),
        $inner = $h(".blog-block__inner"),
        $h(".blog-block__buttons", [
          $h("a.blog-block__btn", { href: url }, "Zobrazit všechny články"),
        ]),
      ]);
    };

    const CategoryUsps = () => $h(".he-cat-usps", [
      $h(".he-cat-usp.--delivery-truck", $h("span", "Doprava do 2 pracovních dnů")),
      $h(".he-cat-usp.--flag-cz", $h("span", "Vyrobeno a vyvinuto v ČR")),
      $h(".he-cat-usp.--badge", $h("span", "Garance vrácení peněz")),
    ]);

    const mqIsVerticalCategoryTop = window.matchMedia("(max-width: 1065px)");
    let $categoryTopBg;
    function resizeCategoryTopBg() {
      if(!$categoryTopBg?.length)
        return;

      const $breadcrumbsWrapper = $(".breadcrumbs-wrapper");
      const breadcrumbsWrapperTop = $breadcrumbsWrapper.offset()?.top;
      const $categoryTop = $(".category-top");
      const categoryTopBottom = $categoryTop.offset()?.top + $categoryTop.outerHeight();

      let height = categoryTopBottom - breadcrumbsWrapperTop;
      let $usps;
      if(mqIsVerticalCategoryTop.matches && ($usps = $(".he-cat-top__usps")).length) {
        const uspsTop = $usps.offset()?.top;
        height = uspsTop - breadcrumbsWrapperTop;
      }

      console.log("resizeCategoryTopBg", height);

      $categoryTopBg.css({
        "padding-bottom": height,
        "margin-bottom": -height,
      });
    }

    let categoryTopDescExpanded = false;

    let t;
    const init = tb.dom.createModuleInitializer({
      dependencies: [
        AdvancedOrderHooks, Banners, NormalizeMobileHtml, CategorySortSelect, AdvancedOrderProductAppendix,
      ],
      earlyInit() {
        t = tb.helpers.getStrings(config);

        // const disableCoupons = new Date() < new Date(config.disableCouponsUntil);
        // if(disableCoupons) {
        //   $(".cart-summary .discount-coupon").remove();
        // }

        tb.hooks.hookFn("shoptet.global.showPopupWindow", (showPopupWindow, args, context) => {
          showPopupWindow.apply(context, args);
          const [target] = args;
          if(target === "navigation") {
            $("body").addClass("submenu-visible");
            const $items = $(config.defaultExpandMenuItems).addClass("exp");
            $items.find("img").trigger("unveil");
          }
        });

        tb.hooks.hookFn("shoptet.menu.showSubmenu", (showSubmenu, args, context) => {
          showSubmenu.apply(context, args);
          const [$el] = args;
          $el.find("img").trigger("unveil");
        });

        AdvancedOrderHooks.addContentFilter(filterAdvancedOrderContent);

        if($("body.type-index").length) {

          // HP

          const $beforeCarousel = $(".homepage-box.before-carousel");
          const $content = $beforeCarousel.next(".content-wrapper.container").find(".content");

          let $afterCarouselContainer;
          $beforeCarousel.after($h(".content-wrapper.he-after-carousel", [
            $h(".content-wrapper-in", [
              $afterCarouselContainer = $h(".container"),
            ]),
          ]));

          if(t.hpCatsSmallItemSelector && $(t.hpCatsSmallItemSelector).length) {
            $afterCarouselContainer.append(HpCats({
              $menuItem: $(t.hpCatsSmallItemSelector),
              heading: t.hpCatsSmallHeading,
              className: "--small",
            }))
          }
          if(t.hpCatsBigItemSelector && $(t.hpCatsBigItemSelector).length) {
            $afterCarouselContainer.append(HpCats({
              $menuItem: $(t.hpCatsBigItemSelector),
              heading: t.hpCatsBigHeading,
              className: "--big",
            }))
          }
          $afterCarouselContainer.append(Banners.get("hpCatsBig").contents());

          $content.prepend(Banners.get("usps").contents());
          $content.append(Banners.get("hpSignpost").contents());
          $content.append(Banners.get("effects").contents());
          $content.append(Banners.get("wroteAbout").contents());
          // Příběh zakladatele
          $content.append(Banners.get("story").contents());
          // Nejnovější články z magazínu
          $content.append(BlogBlock({ url: t.hpBlogUrl, title: "Nejnovější články z magazínu", }));
          // Recenze
          // Instagram

        } else if($("body.type-category").length) {

          // Category

          $categoryTopBg = $h(".he-category-top-bg");
          tb.hooks.hookAfterWindowResize(resizeCategoryTopBg, 100);
          $categoryTopBg.insertAfter("#header");
          $("body").addClass("he-category-top-bg-ready");

        } else if($("body.type-detail").length) {

          // Detail - see Detail module

        }

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if(scrollbarWidth > 0)
          document.documentElement.style.setProperty("--he-scrollbar-width", scrollbarWidth + 'px');
      },
      earlyRender() {
        // Category

        if(tb.dom.oneTimeContents(".category-title", "HerbsBits"))
          $(".category-title").prependTo(".he-cat-top__text");

        tb.dom.$eachOneTime(".he-cat-top__usps", $usps => {
          $usps.html(CategoryUsps()).addClass("--ready");
        }, "HerbsBits");

        tb.dom.$eachOneTime(".he-cat-top__text-more", $more => {
          if(categoryTopDescExpanded) {
            $more.addClass("--visible");
            return;
          }
          $more.before($h("a.he-cat-top__text-more-link", { href: "#" }, "Zobrazit celý popis").on("click", function(e) {
            e.preventDefault();
            $(this).remove();
            $more.addClass("--visible");
            categoryTopDescExpanded = true;
          }));
        }, "HerbsBits");

        if(tb.dom.oneTimeContents(".category-content-wrapper", "HerbsBits"))
          $(".category-content-wrapper").after(Banners.get("usps").contents());

        $(".category-top h4, #productsTop").remove(); // nejprodávanější

        tb.dom.$eachOneTime(".p", initProductBlock, "HerbsBits");

        resizeCategoryTopBg();

      }
    });

    return { init };
  })(tb.$h, tb.$t, tb.m.AdvancedOrderHooks, Banners, NormalizeMobileHtml, CategorySortSelect, AdvancedOrderProductAppendix);

  const ABTesting = (function($h, $t) {
    const config = {
      pingUrl: "https://clients.jiho.digital/herbsenergy/ping.php",
      eventUrl: "https://clients.jiho.digital/herbsenergy/event.php",

      featureFlags: {
        "tribulus-alt-photo": false,
      },
      experiments: {
        "tribulus-alt-photo-v2": {
          enabled: (groupId, sessionId, visitId) => true,
          variationId: (groupId, sessionId, visitId) => groupId & 1,
          featureFlags: {
            "tribulus-alt-photo": variationId => variationId === 1,
          },
        }
      },

      fallbackLang: "cs",
      trans: {
        cs: {},
      },
    };

    // information about the user and current visit
    let groupId;
    const sessionId = ""; // TODO
    const visitId = tb.helpers.uuidv4();
    const language = getShoptetDataLayer("language");

    async function getUserInfo() {
      const res = await fetch(config.pingUrl);
      return res.json();
    }

    async function sendEvent(type, extra = {}) {
      const payload = {
        type,
        group_id: groupId,
        session_id: sessionId,
        visit_id: visitId,
        language,
        ...extra,
      };
      try {
        const url = new URL(config.eventUrl);
        for(let [key, value] of Object.entries(payload))
          url.searchParams.append(key, value);
        await fetch(url);
      } catch(err) {
        console.error(`Failed to send event ${type}`, err, payload);
      }
    }

    function replaceImage($img, newUrl) {
      $img = $($img);
      // if($img.is("[data-src]"))
      $img.attr("data-src", newUrl);
      // if(!$img.attr("src").startsWith("data:"))
      $img.attr("src", newUrl);
    }

    function applyFeatureFlags(enabledFlags) {
      if(enabledFlags["tribulus-alt-photo"]) {
        console.log("Tribulus alt photo enabled.");
        const relatedImageUrl = `${tb.config.cdnPath}/user/documents/upload/experiments/tribulus-alt-photo-v2_related.webp`;
        const detailImageUrl = `${tb.config.cdnPath}/user/documents/upload/experiments/tribulus-alt-photo-v2_detail.webp`;
        const bigImageUrl = `${tb.config.cdnPath}/user/documents/upload/experiments/tribulus-alt-photo-v2_big.webp`;
        const origImageUrl = `${tb.config.cdnPath}/user/documents/upload/experiments/tribulus-alt-photo-v2_orig.webp`;
        if($("body.type-detail") && getShoptetDataLayer("product")?.id === 271) {
          $("a.p-main-image").attr({
            href: origImageUrl,
            "data-href": origImageUrl
          });
          replaceImage("a.p-main-image img", bigImageUrl);
          const $thumb = $(".p-thumbnail").first();
          $thumb.attr("href", bigImageUrl);
          replaceImage($thumb.find("img"), relatedImageUrl);
          const firstVariant = tb.sh.getNecessaryVariantData().find(v => v.id === 1126);
          if(firstVariant) {
            firstVariant.variantImage = {
              big: bigImageUrl,
              cart: relatedImageUrl,
              detail: detailImageUrl,
              detail_small: detailImageUrl,
            };
          }
        }
        tb.dom.$each(".p", $p => {
          const productId = tb.common.parseNumber($p.attr("data-micro-product-id"));
          if(productId === 271)
            replaceImage($p.find("a.image img"), detailImageUrl);
        });
      }
    }

    function initEventHooks() {
      tb.hooks.hookFn("shoptet.tracking.trackGoogleCart", (trackGoogleCart, args, context) => {
        const [gaData, formAction] = args;
        const action = shoptet.tracking.resolveTrackingAction(formAction, gaData);
        let eventType = "";
        switch(action) {
          case "add":
            eventType = "add_to_cart";
            break;
          case "remove":
            eventType = "remove_from_cart";
            break;
          default:
            return trackGoogleCart.apply(context, args);
        }
        sendEvent(eventType, {
          product_id: gaData.base_id,
          product_name: gaData.base_name,
          variant_name: gaData.content_name,
          variant_code: gaData.content_ids[0],
          amount: gaData.amount,
          price_vat: gaData.value,
          price_wovat: gaData.valueWoVat,
        });
        return trackGoogleCart.apply(context, args);
      });

      const { pageType, order } = getShoptetDataLayer() || {};

      if(pageType === "thankYou" && order?.content) {
        for(let item of order?.content) {
          sendEvent("order_item", {
            product_id: item.id,
            product_name: item.name,
            variant_name: item.name + " " + item.variant,
            variant_code: item.sku,
            amount: item.quantity,
            price_vat: item.totalPrice.withVat / item.quantity,
            price_wovat: item.price,
          });
        }
      }
    }

    function resolveForVisit(f) {
      return typeof f === "function" ? f(groupId, sessionId, visitId) : f;
    }

    let t;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        t = tb.helpers.getStrings(config);

        const enabledFlags = { ...config.featureFlags };
        getUserInfo().then(async ({ group_id }) => {
          groupId = group_id;

          initEventHooks();

          const url = new URL(location.href);

          for(let [experimentName, info] of Object.entries(config.experiments)) {
            if(!resolveForVisit(info.enabled))
              continue;
            const forceVariationId = url.searchParams.get(experimentName) !== null ? Number(url.searchParams.get(experimentName)) : null;
            const variationId = forceVariationId ?? resolveForVisit(info.variationId);
            console.log(`Experiment ${experimentName} enabled with variationId ${variationId}`);
            if(forceVariationId == null) {
              sendEvent("experiment_viewed", {
                experiment_id: experimentName,
                variation_id: variationId,
              });
            }
            for(let [flagKey, flagValue] of Object.entries(info.featureFlags)) {
              const resolvedFlagValue = typeof flagValue === "function" ? flagValue(variationId) : flagValue;
              enabledFlags[flagKey] = resolvedFlagValue;
            }
          }
        }).catch(err => {
          console.error("Failed to load feature flags", err)
        }).then(() => {
          console.log("Applying feature flags", enabledFlags);
          applyFeatureFlags(enabledFlags);
        });
      },
    });

    return { config, init };
  })(tb.$h, tb.$t);

  const CartItemData = (function(CartUtils) {
    const config = {
      gcGracePeriodMs: 5 * 60000,
    };

    const storage = new tb.JsonStorage("CartItemData", () => ({}), localStorage);

    function getCartItemData(itemId, key) {
      const obj = storage.get()[itemId];
      return key ? obj?.[key] : obj;
    }

    function setCartItemData(itemId, key, value, lockQuantity) {
      storage.getAndUpdate(data => {
        data[itemId] ??= {};
        data[itemId][key] = value;
        if(lockQuantity)
          data[itemId].lockQuantity = true;
        data[itemId].ts = Date.now();
        return data;
      });
    }

    function getAndUpdateCartItemData(itemId, key, f, lockQuantity) {
      const obj = f(getCartItemData(itemId, key));
      setCartItemData(itemId, key, obj, lockQuantity);
      return obj;
    }

    function collectGarbage() {
      const $cartWrapper = $("#cart-wrapper");
      if(!$cartWrapper.length)
        return;
      const cartItems = CartUtils.getCartContents($cartWrapper);
      const itemIdsInCart = new Set(cartItems.map(i => i.itemId));

      const now = Date.now();
      const data = storage.get();
      for(let [itemId, { ts }] of Object.entries(data)) {
        // delete if not in cart for more than gcGracePeriodMs
        if(!itemIdsInCart.has(itemId) && ts && ts + config.gcGracePeriodMs < now)
          delete data[itemId];
      }
      if(!Object.keys(data).length)
        storage.clear();
      else
        storage.set(data);
    }

    const init = tb.dom.createModuleInitializer({
      dependencies: [
        CartUtils,
      ],
      earlyInit() {
        collectGarbage();
      },
      earlyRender() {
        tb.dom.$eachOneTime("#cart-wrapper", $cartWrapper => {
          for(let { itemId, $tr } of CartUtils.getCartContents($cartWrapper)) {
            if(getCartItemData(itemId, "lockQuantity"))
              CartUtils.lockCartRow($tr, true);
          }
        }, "CartItemData");
        tb.dom.$eachOneTime(".cart-widget-products", $cartWidgetProducts => {
          tb.dom.$each($cartWidgetProducts, $tr => {
            const itemId = $tr.find("input[name=itemId]").val();
            if(getCartItemData(itemId, "lockQuantity"))
              CartUtils.lockCartRow($tr, true);
          });
        }, "CartItemData");
      },
    });

    return { config, init, getCartItemData, setCartItemData, getAndUpdateCartItemData, };
  })(CartUtils);

  const CheckoutUtils = (function($h, $t) {
    const config = {
      fallbackLang: "cs",
      trans: {
        cs: {},
      },
    };

    function getOrderSummaryContents() {
      return tb.dom.$map(".order-summary [data-micro=cartItem]", $tr => {
        const { itemId, dlCartItem } = $tr.data();
        const product = {
          identifier: $tr.attr("data-micro-identifier"),
          sku: $tr.attr("data-micro-sku"),
          priceId: dlCartItem?.priceId,
          url: $tr.find(".main-link").attr("href"),
          price: dlCartItem?.priceWithVat,
          unit: $tr.find(".unit-value").first().text().trim().replace(/^\/ /, ""),
        };

        return { $tr, dlCartItem, itemId, amount: dlCartItem?.quantity, product, };
      }).toArray();
    }

    /* An universal function to retrieve itemId from cart table, cart widget and order summary row */
    function getRowItemId($tr) {
      return $tr.data("itemId") || $tr.find("input[name=itemId]").val();
    }

    function transformRemark(callback) {
      const $remark = $("#remark");
      const newRemark = callback($remark.val());
      $remark.val(newRemark);
      if(newRemark)
        $("#add-note").prop("checked", true);
    }

    const beforeOrderSubmitHooks = [];
    function hookBeforeOrderSubmit(callback) {
      beforeOrderSubmitHooks.push(callback);
    }

    let t;
    const init = tb.dom.createModuleInitializer({
      earlyInit() {
        t = tb.helpers.getStrings(config);

        tb.dom.$each(".order-summary", $orderSummary => {
          const dlCartItems = (getShoptetDataLayer("cart") || []);
          tb.dom.$each($orderSummary.find("[data-micro=cartItem]"), ($tr, i) => {
            const dlCartItem = dlCartItems[i];
            $tr.data({ dlCartItem, itemId: dlCartItem?.itemId, });
          });
        });

        let skipHooks = false;
        tb.hooks.hookFn("shoptet.custom.postSuccessfulValidation", (postSuccessfulValidation, args, context) => {
          const $form = $(args[0]);

          if(!$form.is("#order-form.sending-order"))
            return postSuccessfulValidation.apply(context, args);

          if(postSuccessfulValidation.apply(context, args) === false)
            return false;

          if(skipHooks) {
            skipHooks = false;
            return;
          }

          let isAsync = false;
          function handleHooks([head, ...tail]) {
            let v = false;
            head(() => {
              v = true;
              if(tail.length)
                handleHooks(tail);
              else {
                skipHooks = true;
                $form.trigger("submit");
                skipHooks = false;
              }
            });
            if(!v)
              isAsync = true;
          }

          if(beforeOrderSubmitHooks.length) {
            handleHooks(beforeOrderSubmitHooks);
            if(isAsync)
              return false;
          }
        });
      },
    });

    return { config, init, getOrderSummaryContents, getRowItemId, hookBeforeOrderSubmit, transformRemark, };
  })(tb.$h, tb.$t);

  const LabWidget = (function(GoogleMaps, CartItemData, CartUtils, CheckoutUtils) {
    const config = {
      enabledCategoryUrls: [],
      enabledProductUrls: [],
      enabledFlags: [],

      defaultZoom: 7,
      mapStyle: null,
      placesGeojsonPath: tb.config.cdnPath + "/user/documents/upload/labs/places.geojson",
      placesImagesPath: tb.config.cdnPath + "/user/documents/upload/labs/images",
      fallbackLang: "cs",
      trans: {
        cs: {},
      },
    };

    const { van, } = tb;
    const { h, } = tb.dom;
    const { classNames, } = tb.helpers;

    let geocoder;

    function isLabProductDetail() {
      if(config.enabledProductUrls.includes(location.pathname))
        return true;
      const categoryUrls = tb.dom.find(".breadcrumbs>span>a").map(dom => dom.pathname);
      if(categoryUrls.some(url => config.enabledCategoryUrls.includes(url)))
        return true;
      const flags = tb.dom.find(".product-top .flags .flag").flatMap(dom => [dom.textContent.trim(), dom.className.match(/flag-([^ ]+)/)?.[1]]).filter(Boolean);
      if(flags.some(f => config.enabledFlags.includes(f)))
        return true;
      return false;
    }

    function loadPlaces() {
      return tb.ajax.loadText(tb.ajax.appendCacheBuster(config.placesGeojsonPath)).then(json => JSON.parse(json))
    }
    const loadPlacesCached = tb.common.memoize([], loadPlaces, null);

    function formatPhone(phone) {
      return phone.replace(/([0-9]{3})/g, "$1 ").trim();
    }

    function formatDob(dob) {
      return dob.split("-").map((p, i) => i ? String(Number(p)) : p).reverse().join(".\u00a0");
    }

    async function geocodeAddress(address) {
      address = address.trim();
      if(!address)
        return null;
      geocoder ??= new google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if(status === "ZERO_RESULTS")
            return resolve(null);
          if(status !== "OK")
            return reject(new Error(`geocode returned ${status}`));
          resolve(results[0]);
        });
      });
    }

    const PlaceInfoWindow = ({ place }) => h(".he-lw-map__iw", [
      h("strong", getPlaceName(place)),
      h("address", getPlaceAddress(place)),
    ]);

    const PlaceMap = ({ class: className, places, zoomedPlace = null, standalone = false, onSelect, onPan, }) => {
      const mapDom = h(".he-lw-map", { class: () => classNames(van.val(className), van.val(standalone) && "--standalone"), });

      tb.common.nextTick(() => {
        const globalBounds = new google.maps.LatLngBounds();
        for(let p of places)
          globalBounds.extend(p.location);

        const map = new google.maps.Map(mapDom, {
          zoom: config.defaultZoom,
          center: globalBounds.getCenter(),
          gestureHandling: standalone ? "cooperative" : "greedy",
          fullscreenControl: standalone ? true : false,
          // styles: config.mapStyle,
        });
        const infoWindow = new google.maps.InfoWindow({
          content: "",
          headerDisabled: true,
          // disableAutoPan: true,
        });
        const mapPlaceData = new WeakMap;

        let hoveredPlace = null;
        const markers = places.map((place, i) => {
          const marker = new google.maps.Marker({
            position: place.location,
            // icon: {
            //   url: "/user/documents/img/map-pin.png",
            //   scaledSize: new google.maps.Size(45 * 0.5, 68 * 0.5)
            // }
          });

          mapPlaceData.set(place, {
            marker,
            openInfoWindow() {
              infoWindow.setContent(PlaceInfoWindow({ place }));
              infoWindow.open(map, marker);
              hoveredPlace = place;
            },
          });

          marker.addListener("click", () => {
            mapPlaceData.get(place)?.openInfoWindow();
            onSelect?.(place);
          });
          marker.addListener("mouseover", () => {
            mapPlaceData.get(place)?.openInfoWindow();
          });
          marker.addListener("mouseout", () => {
            setTimeout(() => {
              if(hoveredPlace === place)
                infoWindow.close();
            }, 250);
          });

          return marker;
        });

        // Add a marker clusterer to manage the markers.
        new markerClusterer.MarkerClusterer({
          markers,
          map,
          // renderer: {
          //   render({ count, position }, stats) {
          //     const range = stats.clusters.markers.max - stats.clusters.markers.min;
          //     let mag = 4;
          //     if(range > 0)
          //       mag = Math.min(Math.round(count / range * 4), 4);

          //     const iconName = "m" + (mag + 1);

          //     return new google.maps.Marker({
          //       icon: {
          //         url: "/user/documents/img/" + iconName + ".png",
          //         scaledSize: new google.maps.Size(45, 45),
          //       },
          //       label: { text: String(count), color: "white", fontSize: "10px" },
          //       position,
          //       // adjust zIndex to be above other markers
          //       zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          //     });
          //   }
          // }
        });

        let ignoreCenterChanged = false;
        map.addListener("center_changed", (...args) => {
          if(!ignoreCenterChanged)
            onPan?.(map.getCenter());
        });

        van.derive(() => {
          const place = van.val(zoomedPlace);
          if(place) {
            ignoreCenterChanged = true;
            map.panTo(place.location);
            map.setZoom(14);
            ignoreCenterChanged = false;
            mapPlaceData.get(place)?.openInfoWindow();
          } else if(zoomedPlace && zoomedPlace.val !== zoomedPlace.oldVal) { // skip reset on initial load
            ignoreCenterChanged = true;
            map.panTo(globalBounds.getCenter());
            map.setZoom(config.defaultZoom);
            ignoreCenterChanged = false;
          }
        });
      });

      return mapDom;
    };

    function getPlaceName(place) {
      return place.properties.name
        .replace(/^Odběrové pracoviště /, "")
        .replace(/^POUZE E-shop - odběry krve - /, "");
    }

    function getPlaceAddress(place) {
      const { street, city, zip } = place.properties;
      const streetFixed = street.replace(/,+$/, "");
      return `${streetFixed}, ${zip} ${city}`;
    }

    function getPlaceNavUrl(place) {
      const navUrl = new URL("https://www.google.com/maps?saddr=Current+Location");
      navUrl.searchParams.append("daddr", getPlaceAddress(place));
      return navUrl.toString();
    }

    function getCustomerName(details) {
      return `${details.name} ${details.surname}, ${formatDob(details.dob)}`;
    }

    function parseOpeningHours(rawHours) {
      const weekdays = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];

      const days = weekdays.map(name => {
        const day = rawHours.find(d => d[0] === name) || [];
        return {
          name,
          shortName: name.slice(0, 2),
          periods: day.slice(1).filter(p => p !== "hod." && p !== "–"),
        };
      });
      const maxPeriods = Math.max(...days.map(d => d.periods.length));
      for(let d of days) {
        d.closed = !d.periods.length;
        d.paddedPeriods = d.periods.length < maxPeriods ? d.periods.concat(new Array(maxPeriods - d.periods.length).map(p => "")) : d.periods;
      }
      return { days, maxPeriods };
    }

    function getCurrentPosition() {
      return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
    }

    const PlaceModalForm = ({ onSuccess, }) => {
      const locDisabled = van.state(false);
      const errorMessage = van.state(null);

      van.derive(() => {
        if(errorMessage.oldVal !== errorMessage.val) {
          shoptet.modal.resize(); // error message changes height of the modal
        }
      });

      async function handleSubmit(e) {
        e.preventDefault();
        errorMessage.val = "";
        const address = this.address.value.trim();
        if(!address) {
          errorMessage.val = "Zadejte prosím adresu.";
          return;
        }
        try {
          const result = await geocodeAddress(address);
          if(result) {
            errorMessage.val = "";
            onSuccess?.(result.geometry.location);
          } else
            errorMessage.val = "Zadaná adresa nebyla nalezena.";
        } catch(err) {
          console.error(err);
          errorMessage.val = "Nepodařilo se určit polohu zadané adresy.";
        }
      }
      async function queryGeolocation(e) {
        e.preventDefault();
        locDisabled.val = true;
        errorMessage.val = "";
        try {
          const pos = await getCurrentPosition();
          const { latitude, longitude } = pos.coords;
          errorMessage.val = "";
          onSuccess?.({ lat: latitude, lng: longitude });
        } catch(err) {
          console.error(err);
          errorMessage.val = "Nepodařilo se určit Vaší polohu.";
        } finally {
          locDisabled.val = false;
        }
      }
      return h("form.he-lw-modal__search-form", { onsubmit: handleSubmit, }, [
        h(".he-lw-modal__search-form-group", [
          h("button", {
            type: "button",
            onclick: queryGeolocation,
            disabled: locDisabled,
            title: "Použít aktuální polohu",
          }),
          h("input.form-control.he-lw-form-control", { type: "text", name: "address", required: true, placeholder: "Např. Praha", }),
          h("button", {
            type: "submit",
            title: "Vyhledat",
          }),
        ]),
        () => van.val(errorMessage) ? h(".he-lw-modal__search-form-error", errorMessage) : "",
      ]);
    };

    const PlaceModalList = ({ places, newPlace, onSelect, }) => h(".he-lw-modal__point-list", h("div", van.val(places).map((place, i) =>
      h("a.he-lw-modal__point", {
        class: () => classNames(place === van.val(newPlace) && "--selected"),
        href: "#",
        onclick(e) {
          e.preventDefault();
          onSelect?.(place);
        },
      }, [
        h(".he-lw-modal__point-title", getPlaceName(place)),
        h(".he-lw-modal__point-address", getPlaceAddress(place)),
      ]))));

    const PlaceModalListMobile = ({ ...props }) => {
      const expanded = van.state(false); // TODO
      return h(".he-lw-modal__point-list-mobile", { class: () => classNames(van.val(expanded) && "--expanded") }, [
        h("button.he-lw-modal__point-list-toggle", {
          type: "button",
          onclick() {
            expanded.val = !van.val(expanded);
          },
          title: "Zobrazit/skrýt seznam míst",
        }),
        PlaceModalList({ ...props }),
      ]);
    };

    const PlaceModalSidebar = ({ places, newPlace, onSelect, onClose, onSearch, }) => h(".he-lw-modal__sidebar", [
      h(".he-lw-modal__header", [
        h(".he-lw-modal__title", "Odběrová místa"),
        h("button.he-lw-modal__close.he-lw-close", {
          type: "button",
          title: "Zrušit",
          onclick() {
            onClose?.();
          }
        }),
      ]),
      PlaceModalForm({
        onSuccess: onSearch,
      }),
      () => !van.val(isMobile) ? PlaceModalList({ places, newPlace, onSelect, }) : "",
    ]);

    const PlaceModalSelected = ({ place, onConfirm, onCancel, }) => {
      const imageUrl = van.derive(() => {
        if(!van.val(place))
          return null;
        const { id, hasImage, } = van.val(place).properties;
        return hasImage ? `${config.placesImagesPath}/${id}.jpg` : null;
      });
      const navUrl = van.derive(() => van.val(place) && getPlaceNavUrl(van.val(place)));
      const parsedOpeningHours = van.derive(() => van.val(place)?.properties?.openingHours && parseOpeningHours(van.val(place)?.properties?.openingHours));
      const news = van.derive(() => van.val(place)?.properties?.news || []);

      const renderOpeningHours = parsedOpeningHours => h(".he-lw-modal__selected-hours",
        parsedOpeningHours.days.map(({ shortName, periods, closed, }, i) => [
          i ? h("br") : null,
          `${shortName}: ${closed ? "zavřeno" : periods.join(", ")}`,
        ]));

      return h(".he-lw-modal__selected", [
        h("button.he-lw-modal__selected-cancel.he-lw-close", {
          type: "button",
          title: "Zrušit",
          onclick() {
            onCancel?.();
          },
        }),
        () => !van.val(isMobile) && van.val(imageUrl) ? h(".he-lw-modal__selected-image", h("img", { src: imageUrl })) : "",
        h(".he-lw-modal__selected-info", [
          h(".he-lw-modal__selected-header", [
            h(".he-lw-modal__selected-title", () => van.val(place) && getPlaceName(van.val(place)) || ""),
            h(".he-lw-modal__selected-address", [
              () => van.val(place) && getPlaceAddress(van.val(place)) || "",
              " ",
              h("a.he-lw-modal__selected-nav-link.he-lw-color-unset", { href: navUrl, target: "_blank", }, "Navigovat"),
            ]),
          ]),
          h(".he-lw-modal__selected-info-row", [
            () => van.val(parsedOpeningHours) && renderOpeningHours(van.val(parsedOpeningHours)) || "",
            () => van.val(news).length && h(".he-lw-modal__selected-news", van.val(news).map(text => h("p", text))) || "",
            () => !van.val(isMobile) ? h("button.he-lw-modal__selected-confirm.btn.btn-primary.he-lw-btn.--primary", {
              type: "button",
              onclick() {
                onConfirm?.(van.val(place));
              },
            }, "Zvolit odběrové místo") : "",
          ]),
          () => van.val(isMobile) && van.val(imageUrl) ? h(".he-lw-modal__selected-image", h("img", { src: imageUrl })) : "",
        ]),
        () => van.val(isMobile) ? h(".he-lw-modal__selected-btn-wrap", [
          h("button.he-lw-modal__selected-back", {
            href: "button",
            onclick() {
              onCancel?.();
            },
          }, "Zpět"),
          h("button.he-lw-modal__selected-confirm.btn.btn-primary.he-lw-btn.--primary", {
            type: "button",
            onclick() {
              onConfirm?.(van.val(place));
            },
          }, "Zvolit odběrové místo"),
        ]) : "",
      ]);
    };

    async function preparePlaceModal() {
      const [placesGeojson] = await Promise.all([
        loadPlacesCached(),
        GoogleMaps.load(),
      ]);

      const places = placesGeojson.features;
      for(let p of places) {
        const [lng, lat] = p.geometry.coordinates;
        p.location = { lat, lng };
      }

      return { places };
    }

    function reactiveMatchMedia(query) {
      const match = window.matchMedia(query);
      const res = van.state(match.matches);
      match.addEventListener("change", e => {
        res.val = e.matches;
      });
      return res;
    }

    const isMobile = reactiveMatchMedia("(max-width: 767px)");

    const PlaceModal = ({ places, place, onClose, onConfirm, }) => {
      const sortedPlaces = van.state(places);
      const newPlace = van.state(null);
      const mapZoomedPlace = van.state(null);
      van.derive(() => {
        if(van.val(newPlace) !== van.val(place))
          mapZoomedPlace.val = null;
        newPlace.val = van.val(place);
      });

      function sortPlacesByDistanceFrom(location) {
        function distanceToUser(place) {
          return google.maps.geometry.spherical.computeDistanceBetween(location, place.location);
        }
        return (sortedPlaces.val = van.val(sortedPlaces).toSorted((a, b) => distanceToUser(a) - distanceToUser(b)));
      }

      const sortPlacesByDistanceFromDebounced = tb.common.debounce(sortPlacesByDistanceFrom, 500);

      return h(".he-lw-modal__content", [
        PlaceModalSidebar({
          newPlace,
          places: sortedPlaces,
          onClose,
          onSelect(place) {
            mapZoomedPlace.val = newPlace.val = place;
          },
          onSearch(location) {
            const newSortedPlaces = sortPlacesByDistanceFrom(location);
            mapZoomedPlace.val = newPlace.val = newSortedPlaces.length ? newSortedPlaces[0] : null;
          }
        }),
        h(".he-lw-modal__main", [
          PlaceMap({
            class: "he-lw-modal__map",
            places, // order doesn't matter for the map
            zoomedPlace: mapZoomedPlace,
            onSelect(place) {
              newPlace.val = place;
            },
            onPan(center) {
              sortPlacesByDistanceFromDebounced(center);
            },
          }),
          () => van.val(newPlace) ? PlaceModalSelected({
            place: newPlace,
            onConfirm(place) {
              onConfirm?.(place);
            },
            onCancel() {
              newPlace.val = null;
            },
          }) : "",
          () => (van.val(isMobile) && !van.val(newPlace)) ? PlaceModalListMobile({
            places: sortedPlaces,
            newPlace,
            onSelect(place) {
              // // on mobile we hide the list when showing detail, sort the list for when the user returns back
              // sortPlacesByDistanceFrom(place.location);
              mapZoomedPlace.val = newPlace.val = place;
            },
          }) : "",
        ]),
      ]);
    }

    function initFormValidators(form) {
      // const validators = {
      //   requiredInputs: {
      //     ...(shoptet.validatorRequired.validators.requiredInputs || {}),
      //     elements: form.querySelectorAll("[required]"),
      //   },
      //   email: {
      //     elements: form.querySelectorAll("[type=email]"),
      //     events: ['change', 'blur', 'validatedFormSubmit'],
      //     validator: wrapLegacyValidator(shoptet.validator),
      //     fireEvent: false
      //   },

      // };
    }

    const DetailsModal = ({ details, onClose, onSubmit, }) => {
      function handleSubmit(e) {
        e.preventDefault();
        const newDetails = Object.fromEntries(new FormData(e.target).entries());
        onSubmit?.(newDetails);
      }

      const FormGroup = ({
        id = tb.helpers.uniqueId("lwIn"),
        label,
        required = false,
        class: className,
        span = 1,
      } = {}, children) =>
        h(".he-lw-modal__details-form-group.js-validated-element-wrapper", {
          class: () => classNames(`--span-${span}`, van.val(className)),
        }, [
          label ? h("label", { for: id }, required ? h("span.required-asterisk", label + ":") : label + ":") : null,
          typeof children === "function" ? children({ id, required }) : children,
        ]);

      const inputProps = key =>
        ({ name: key, value: () => van.val(details)?.[key] ?? "" });
      const genderOption = (value, text = value) =>
        h("option", { value, selected: () => van.val(details)?.gender === value, }, text);

      const formDom = h("form.he-lw-modal__content", { onsubmit: handleSubmit }, [
        h(".he-lw-modal__title", "Koho budeme vyšetřovat?"),
        h(".he-lw-modal__details-form", [
          FormGroup({ label: "Jméno", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("name"), id, required, autocomplete: "given-name" })
          ),
          FormGroup({ label: "Příjmení", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("surname"), id, required, autocomplete: "family-name" })
          ),
          FormGroup({ label: "E-mail", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("email"), id, required, type: "email" })
          ),
          FormGroup({ label: "Telefon", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("phone"), id, required, type: "tel" })
          ),
          FormGroup({ label: "Datum narození", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("dob"), id, required, type: "date" })
          ),
          FormGroup({ label: "Rodné číslo", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("personal_number"), id, required, type: "text", pattern: "[0-9]+/?[0-9]+" })
          ),
          FormGroup({ label: "Výška (cm)", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("height"), id, required, type: "number", min: 1 })
          ),
          FormGroup({ label: "Váha (kg)", required: true }, ({ id, required }) =>
            h("input.form-control.he-lw-form-control", { ...inputProps("weight"), id, required, type: "number", min: 1 })
          ),
          FormGroup({ label: "Pohlaví", required: true, }, ({ id, required }) =>
            h("select.form-control.he-lw-form-control", { name: "gender", id, required, }, [
              h("option", { value: "", disabled: true }, "Vyberte pohlaví"),
              genderOption("muž", "Muž"),
              genderOption("žena", "Žena"),
            ]),
          ),
        ]),
        h(".he-lw-modal__footer", [
          h("button.btn.btn-primary.he-lw-modal__details-submit.he-lw-btn.--primary", { type: "submit", }, "Uložit údaje"),
        ]),
      ]);
      initFormValidators(formDom);
      return formDom;
    };

    function classNamesArray(...cns) {
      const str = classNames(cns);
      return str !== "" ? str.split(/\s+/) : str;
    }

    function openModal({ onComplete, width, size, class: className, bodyClass, ...props }, ...children) {
      const sizeUc = size ? size[0].toUpperCase() + size.slice(1) : size;

      const contentDom = h(".colorbox-html-content", ...children);
      if(width)
        contentDom._modalWidth = width;

      if(bodyClass) {
        bodyClass = classNamesArray(van.val(bodyClass));
        document.body.classList.add(...bodyClass);
      }
      shoptet.modal.open({
        html: contentDom,
        className: classNames(sizeUc && shoptet.modal.config["class" + sizeUc], className),
        ...(size ? { width: shoptet.modal.config["width" + sizeUc] } : {}),
        ...(width ? { width: van.val(width), } : {}),
        onComplete() {
          shoptet.images.unveil();
          onComplete?.();
        },
        onCleanup() {
          if(bodyClass)
            document.body.classList.remove(...bodyClass);
        },
        ...props,
      });
    }

    const PlaceParameter = ({ place, onClick, }) => {
      return h(".he-lw__parameter.--place", {
        class: () => classNames(van.val(place) && "--selected"),
        onclick(e) {
          if(e.target.matches(".he-lw__parameter-nav-link"))
            return;
          e.preventDefault();
          onClick?.();
        },
      }, [
        h(".he-lw__parameter-left", [
          () => van.val(place)
            ? h(".he-lw__parameter-name", { href: "#" }, () => getPlaceName(van.val(place)))
            : h(".he-lw__places-prompt", "Seznam odběrových míst"),
          () => van.val(place)
            ? h(".he-lw__parameter-value", [
              () => getPlaceAddress(van.val(place)),
              " ",
              h("a.he-lw__parameter-nav-link.he-lw-color-unset", { href: getPlaceNavUrl(van.val(place)), target: "_blank", }, "Navigovat"),
            ])
            : "",
        ]),
        h("a.he-lw__parameter-link", { href: "#", }, () => van.val(place) ? "Změnit místo" : "Vybrat odběrové místo"),
      ]);
    };

    const DetailsParameter = ({ details, disabledReason, onClick, }) => {
      return h(".he-lw__parameter.--details", {
        class: () => classNames(van.val(details) && "--selected", van.val(disabledReason) && "--disabled"),
        onclick(e) {
          e.preventDefault();
          if(van.val(disabledReason))
            return;
          onClick?.();
        },
      }, [
        h(".he-lw__parameter-left", [
          h("a.he-lw__parameter-name", { href: "#" }, "Koho budeme vyšetřovat?"),
          () => van.val(disabledReason) || van.val(details) ? h(".he-lw__parameter-value", () => van.val(disabledReason) || van.val(details) && getCustomerName(van.val(details)) || "") : "",
        ]),
        () => van.val(details) ? h("a.he-lw__parameter-link", { href: "#" }, "Změnit údaje") : "",
      ]);
    };

    let placeModalDataPromise;
    const LabWidget = ({ ...props } = {}) => {
      const place = van.state(null);
      const details = van.state(null);

      async function openPlaceModal() {
        placeModalDataPromise ??= preparePlaceModal();
        showSpinner();
        const placeModalData = await placeModalDataPromise;
        hideSpinner();
        openModal({
          width: () => Math.min(window.innerWidth * 0.98, 1420),
          class: "he-lw-modal --place",
          bodyClass: "he-lw-modal-visible he-lw-place-modal-visible",
        }, PlaceModal({
          ...placeModalData,
          place,
          onClose() {
            shoptet.modal.close();
          },
          onConfirm(_place) {
            console.log("confirmed place", _place);
            place.val = _place;
            shoptet.modal.close();
          },
        }));
      }
      async function openDetailsModal() {
        openModal({
          size: "md",
          class: "he-lw-modal --details",
          bodyClass: "he-lw-modal-visible he-lw-details-modal-visible",
        }, DetailsModal({
          details,
          onClose() {
            shoptet.modal.close();
          },
          onSubmit(_details) {
            console.log("submitted details", _details);
            details.val = _details;
            shoptet.modal.close();
          },
        }));
      }

      const dom = h(".he-lw", { ...props, }, [
        PlaceParameter({
          place,
          onClick: openPlaceModal,
        }),
        DetailsParameter({
          details,
          disabledReason: van.derive(() => !van.val(place) ? "Nejprve prosím zvolte odběrové místo" : null),
          onClick: openDetailsModal,
        }),
      ]);

      $("#product-detail-form").on("submit", function(e) {
        function cancelEvent() {
          e.preventDefault();
          e.stopImmediatePropagation();
        }

        if(!van.val(place)) {
          showMessage("Vyberte prosím odběrové místo.", "error");
          cancelEvent();
          return;
        }

        if(!van.val(details)) {
          showMessage("Vyplňte prosím osobní údaje vyšetřované osoby.", "error");
          cancelEvent();
          return;
        }
      });

      CartUtils.hookAfterAddToCart(($form, response, dlCartItem) => {
        if(!dlCartItem || !$form.is("#product-detail-form"))
          return;
        const amount = tb.common.parseNumber($form.find("input[name=amount]").val());

        const labItem = {
          id: tb.helpers.uuidv4(),
          amount,
          selectedPlace: van.val(place),
          details: van.val(details),
        };
        console.log(labItem);

        CartItemData.getAndUpdateCartItemData(dlCartItem.itemId, "LabWidget", labItems => {
          labItems ??= [];
          labItems.push(labItem);
          return labItems;
        }, true);
      });

      return dom;
    };

    const LabItemImage = ({ labItem }) => {
      const { hasImage, id } = labItem.selectedPlace.properties;
      const imageUrl = hasImage ? `${config.placesImagesPath}/${id}.jpg` : null;
      return h("img", { src: imageUrl || "/cms/img/common/missing_images/related.png" });
    };

    const LabItemDescription = ({ labItem, cartItem }) => {
      const { selectedPlace, details } = labItem;
      const address = getPlaceAddress(selectedPlace);
      const { name, surname, phone, email, dob, personal_number, gender, height, weight, } = details;
      return h("div", [
        h(".he-lw-item__description-row", [
          h("strong", "Odběrové místo: "),
          h("div", address),
        ]),
        h(".he-lw-item__description-row", [
          h("strong", "Vyšetřovaná osoba: "),
          h("div", `${name} ${surname}`),
          h("div", `${formatPhone(phone)}, ${email}`),
          h("div", `nar.:\u00a0${formatDob(dob)}, RČ:\u00a0${personal_number}`),
          h("div", `${gender}, ${height}\u00a0cm, ${weight}\u00a0kg`),
        ]),
      ]);
    };

    const LabCartRow = ({ cartItem, labItem }) => h("tr.he-lw-item.removeable", [
      h("td.he-lw-item__image", LabItemImage({ cartItem, labItem })),
      h("td.he-lw-item__description", { colspan: 2 }, LabItemDescription({ cartItem, labItem })),
      h("td.he-lw-item__amount", [
        h("span", String(labItem.amount)),
      ]),
      h("td.he-lw-item__price.p-price", []),
      h("td.he-lw-item__total.p-total", [
        h("button.remove-item", {
          type: "button",
          onclick(e) {
            e.preventDefault();
            this.closest("tr").remove();
            CartItemData.getAndUpdateCartItemData(cartItem.itemId, "LabWidget", data =>
              (data || []).filter(i => i.id !== labItem.id));
            const cartItems = CartUtils.getCartContents($("#cart-wrapper"));
            CartUtils.updateQuantityInCart(cartItem, cartItem.amount - labItem.amount, true, cartItems);
          },
        }, [
          h("span.sr-only", t.removeFromCart)
        ]),
      ])
    ]);

    const LabOrderSummaryRow = ({ cartItem, labItem }) => h(".he-lw-item", [
      h(".he-lw-item__description", LabItemDescription({ cartItem, labItem })),
      h(".he-lw-item__amount", [
        h("span", String(labItem.amount)),
        h("span.unit-value", String(cartItem.product.unit)),
      ]),
    ]);

    function transformRemark(remark, cartItems) {
      const lines = [];
      if(remark !== "")
        lines.push("Poznámka k objednávce: " + remark, "");

      let hasLabItems = false;
      for(let { $tr, product, itemId, amount } of cartItems) {
        const labItems = CartItemData.getCartItemData(itemId, "LabWidget");
        if(!labItems?.length)
          continue;

        hasLabItems = true;

        const $mainLink = $tr.find(".main-link");
        const name = tb.dom.getTextShallow($mainLink);
        const variant = $mainLink.find(".main-link-variant").text().trim();
        const surcharges = $mainLink.find(".main-link-surcharges").text().trim();

        lines.push("# " + amount + " ks: " + product.sku + " " + name + " " + variant + " " + surcharges);
        lines.push(new URL(product.url, location.href).toString());

        for(let [i, labItem] of labItems.entries()) {
          const { street, city, zip, } = labItem.selectedPlace.properties;
          const streetFixed = street.replace(/,+$/, "");
          const address = `${streetFixed}, ${zip} ${city}`;
          const details = labItem.details;

          lines.push(`(${i + 1}.) Počet vyšetření: ${labItem.amount}`);
          lines.push(`> Odběrové místo: ${address}`);
          lines.push(`> Vyšetřovaná osoba: `);
          lines.push(`> ${details.name} ${details.surname}`);
          lines.push(`> ${formatPhone(details.phone)}, ${details.email}`);
          lines.push(`> nar.:\u00a0${formatDob(details.dob)}, RČ:\u00a0${details.personal_number}`);
          lines.push(`> ${details.gender}, ${details.height}\u00a0cm, ${details.weight}\u00a0kg`);
        }
      }

      if(!hasLabItems)
        return remark; // pass through the original remark if there are no designer items
      return lines.join("\n").trim();
    }

    function waitUntilInViewport(dom) {
      return new Promise(resolve => {
        const obs = new IntersectionObserver(entries => {
          if(entries.some(e => e.isIntersecting)) {
            obs.disconnect();
            resolve();
          }
        }, {
          rootMargin: "50% 0px 50% 0px",
        });
        tb.common.nextTick(() => {
          obs.observe(dom);
        });
      });
    }

    async function initStandalonePlaceMap(dom) {
      dom.replaceChildren();
      await waitUntilInViewport(dom); // lazy load
      console.log("loading map");
      placeModalDataPromise ??= preparePlaceModal();
      const placeModalData = await placeModalDataPromise;
      const { places } = placeModalData;
      dom.replaceChildren(PlaceMap({ places, class: "hed-lw-map", standalone: true, }));
    }

    let t;
    const init = tb.dom.createModuleInitializer({
      dependencies: [
        GoogleMaps, CartItemData, CartUtils, CheckoutUtils,
      ],
      earlyInit() {
        t = tb.helpers.getStrings(config);

        CheckoutUtils.hookBeforeOrderSubmit(submitOrder => {
          tb.common.promiseTry(async () => {
            const $cartWrapper = await CartUtils.loadCart(true);
            const cartItems = CartUtils.getCartContents($cartWrapper);
            CheckoutUtils.transformRemark(remark => transformRemark(remark, cartItems));
          }).then(submitOrder);
        });

        const orderSummaryItems = CheckoutUtils.getOrderSummaryContents();
        for(let cartItem of orderSummaryItems) {
          const labItems = CartItemData.getCartItemData(cartItem.itemId, "LabWidget");
          if(!labItems?.length)
            continue;
          for(let labItem of labItems)
            cartItem.$tr.after(LabOrderSummaryRow({ cartItem, labItem }));
        }

        $("body").on("click", "[data-micro=cartItem] .remove-item", function(e) {
          const $tr = $(this).closest("tr");
          const itemId = $tr.find("input[name=itemId]").val();
          CartItemData.setCartItemData(itemId, "LabWidget", []); // cleanup
        });

        if($("body.type-detail").length && isLabProductDetail()) {
          $("body").addClass("he-lab-product");
          $(".p-info-wrapper .detail-parameters").after(LabWidget({ id: "heLw", }));
        }

        tb.dom.each(".he-lw-place-map-here", initStandalonePlaceMap);

        tb.hooks.hookFn("shoptet.modal.shoptetResize", (shoptetResize, args, context) => {
          const contentDom = document.querySelector(".colorbox-html-content");
          if(contentDom?._modalWidth) {
            shoptet.modal.resize({
              width: van.val(contentDom._modalWidth),
            });
          } else {
            return shoptetResize.apply(context, args);
          }
        });
      },
      earlyRender() {
        tb.dom.$each("#cart-wrapper", $cartWrapper => {
          if(!tb.dom.oneTimeContents($cartWrapper, "LabWidget"))
            return;

          const cartItems = CartUtils.getCartContents($cartWrapper);
          for(let cartItem of cartItems) {
            const labItems = CartItemData.getCartItemData(cartItem.itemId, "LabWidget");
            if(!labItems?.length)
              continue;
            for(let labItem of labItems) {
              cartItem.$tr.addClass("he-lw-has-item");
              cartItem.$tr.after(LabCartRow({ cartItem, labItem }));
            }
          }
        });
      },
    });

    return { config, init };
  })(tb.m.GoogleMaps, CartItemData, CartUtils, CheckoutUtils);

  // ================================================

  DetailTabTweaks.init();
  //CategoryActiveFilters.init();
  tb.common.assignDeep(CartUpsell.config, window.cartUpsellConfig || {});
  CartUpsell.init();
  // tb.common.assignDeep(InlineProductDetail.config, window.inlineProductDetailConfig || {});
  // InlineProductDetail.init();
  Detail.init();
  DetailVideos.init();
  DetailClickableParameters.init();
  DetailBinarySurcharges.init();
  DetailSelectFirstVariant.init();
  DetailUpsell.init();
  MessageDismissFix.init();
  AjaxModalResize.init();
  HerbsBits.init();
  ABTesting.init();
  tb.common.assignDeep(tb.m.GoogleMaps.config, {
    autoload: false,
    apiKey: "AIzaSyBVEMIwKN4NN_gQ076lDIAA7qK53n9yoCM",
    libraries: "geometry",
  });
  tb.common.assignDeep(LabWidget.config, window.labWidgetConfig || {});
  LabWidget.init();
  tb.m.AdvancedOrderHooks.init();
  tb.m.DetailHooks.init();

  // ================================================

  $(function() {
    var $footer = $(".custom-footer").clone();

    if($(".top-nav-button-account").length)
      $("body").addClass("user-logged");

    const $projectPhone = $(".top-navigation-bar .project-phone").insertAfter(".header-top>div.search");
    tb.hooks.respond("(max-width: 767px)", () => {
      $projectPhone.appendTo(".navigation-buttons");
      let $marker;
      const $footerSocials = $(".footer-socials").after($marker = $(document.createTextNode(""))).appendTo(".footer-contact");
      return () => {
        $marker.replaceWith($footerSocials);
        $projectPhone.insertAfter(".header-top>div.search");
      };
    });

    $("body.mobile #header .search").insertAfter("#header");

    $("<a href='/registrace/' class='top-nav-button top-nav-button-register'>Registrace</a>").appendTo(".top-navigation-tools");

    $("input[type=search].form-control").attr("placeholder", "Co hledáte? Např. hořčík, lepší spánek...");

    $("<div>Potřebujete poradit? Zavolejte nám.</div>").prependTo(".header-top .project-phone");
    $("<a class='navigation-user --user' href='/login/'>Přihlášení</a> <a class='navigation-user' href='/registrace/'>Registrace</a>").prependTo("body:not(.user-logged) #header .navigation-buttons");
    $("<a class='navigation-user --user' href='/login/'>Můj účet</a>").prependTo("body.user-logged #header .navigation-buttons");
    $("#header").addClass("ready");

    var current = window.location;
    var currentSpec = window.location.pathname;
    $(".navigation-in>ul>li>a").each(function() {
      var link = $(this).attr("href");
      if(current == link || currentSpec == link) {
        $(this).parent().addClass("active");
      }
    });

    /* Thx page */
    if($("body.id--15").length) {
      $(".order-summary-heading").text("Děkujeme za objednávku");
      $("<p>Pokud jste objednali do 10:00, balíček odešleme ještě ten samý den a dopravce doručí následující den. Pokud byste měli nějaký problém nebo dotaz, volejte nám na <a href='tel:603 220 482'>603 220 482</a> nebo pište na <a href='mailto:info@herbsenergy.cz'>info@herbsenergy.cz</a></p>").insertAfter(".order-summary-heading");
      $(".order-summary-heading, .reca-number, .order-summary-heading+p").wrapAll("<div class='order-summary-top'></div>");
      $(".cart-table .cart-p-image").each(function() {
        $(this).find("img").wrapAll("<a></a>");
      })
      $(".order-summary-item.total, .order-complete-links").insertAfter(".id--15 .content-inner");
      if(!$(".recapitulation-wrapper .col-sm-6").length)
        $(".recapitulation-wrapper .co-payment-method tr:last-child").insertAfter(".recapitulation-wrapper .co-payment-method table").addClass("--price");
    }


    /* Init modules */
    Layout.init();
    Cart.init();
    Catalog.init();

    /* Inserting */
    legacyLoadSnippets([
      "instagram.html",
      "heureka.html",
      "heureka-new.html",
      "login-block.html",
      "register-block.html",
      "blog-detail-more.html"
    ], function(
      instagram, heureka, heurekaNew, loginblock, registerblock, blogdetail
    ) {

      /* USPs */
      // $footer.find(">div:nth-of-type(6)>div").insertAfter("body.in-index .banners-row").addClass("usps__wrap");
      // $footer.find(">div:nth-of-type(6)>div").insertAfter("body.type-detail .product-top").addClass("usps__wrap");

      /* Instagram */
      $(instagram[0]).insertBefore("#footer");
      $footer.find(">.custom-footer__instagram .instagram-widget").appendTo("#instagram-feed");
      $("#instagram-feed img").unveil();

      // $footer.find(">div:nth-of-type(6)>div").prependTo("body.type-page  .instagram__block .container, body.type-post  .instagram__block .container").addClass("usps__wrap");

      /* Customers stories */
      // $footer.find(">div:nth-of-type(8)>div").prependTo("body.in-index .homepage-box.welcome-wrapper .container");
      // $footer.find(">div:nth-of-type(8)>div").appendTo("body.type-detail #tab-content");

      $(".products-related-header").text("Další naše produkty s blahodárnými účinky");
      $(".products-related-header, .products-related-header+.products-block").appendTo("#tab-content");
      $(".products-related-header, .products-related-header+.products-block").wrapAll("<div class='products-related-wrap' />");

      /* Heureka */
      $(heureka[0]).insertBefore("body.in-index .ref");
      Layout.initRefBlock();

      $(heurekaNew[0]).insertBefore(".instagram__block");
      Layout.initRefBlockNew();

      const $ratingTab = $("body.type-detail #ratingTab");
      if($ratingTab.length) {
        const { $t, $h } = tb;
        const $ratingWrapper = $ratingTab.find("#ratingWrapper");
        $ratingWrapper.children().wrapAll("<div class='ratingWrapper__wrapped'></div>");
        const $ratingTabTop = $("<div class='rating-tab__top'><div></div><span>Zákazníků nás doporučuje <a href='/recenze/'>Přečíst recenze</a></span></div>");
        if($(window).width() < 768) {
          // Mobile
          $ratingTab.prepend([
            $h(".ref__title.--title", "Naše hodnocení na Heurece"),
            $ratingTabTop,
            $h(".ref__title.--title", "Další hodnocení zákazníků"),
          ]);
        } else {
          // Desktop
          $("<div class='ref__subtitle --subtitle'>Ověřené recenze našich zákazníků</div>").prependTo("#ratingTab");
          $("<div class='ref__title --title'>Hodnocení produktu</div>").prependTo("#ratingTab");
          $("#ratingTab .ref__subtitle.--subtitle+p").prependTo("#ratingWrapper");
          $ratingTabTop.prependTo("#ratingTab #ratingWrapper");
        }
        Layout.initRefBlockDetail();
      }

      /* Update */
      $("body.type-detail .after-block").attr("id", "description afterblock").wrapInner("<div class='basic-description'/>").insertAfter("#ratingTab");
      $("body").on("click", ".faq-item__top", function() {
        $(this).parent().toggleClass("--active");
        $(this).next(".faq-item__bottom").slideToggle();
      })

      $("body").on("click", ".anchor-link", function() {
        if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if(target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 80
            }, 500);
            return false;
          }
        }
      });


      /* Customers stories */
      $footer.find(">div:nth-of-type(7)>div").insertBefore("body.in-index .homepage-group-title");

      /* Register */
      $(loginblock[0]).insertAfter("body.in-login .content-inner #formLogin");
      $(registerblock[0]).insertAfter("body.in-registrace .content-inner #register-form");
      $("body.in-login #formLogin, body.in-login .content-inner .login-block").wrapAll("<div class='login-wrap --login'></div>");
      $("body.in-registrace #register-form, body.in-registrace .content-inner .login-block").wrapAll("<div class='login-wrap --register'></div>");
      $("body.in-registrace #register-form .col-md-4").insertAfter(".co-registration + fieldset");
      $("body.in-registrace .content-inner input[type=submit]").removeClass("btn-secondary").addClass("btn-primary");
      $("body.in-login .content-inner .login-wrapper .btn-login").removeClass("btn-secondary").addClass("btn-primary --brown");
      $("<a href='/klient/zapomenute-heslo/' class='forgot-pass'>Zapomněli jste heslo?</a>").prependTo("#formLogin .password");
      $('<div class="social-login-buttons-divider"><span>nebo</span></div>').prependTo("body.in-registrace .register-soc");
      $("body.in-registrace .content-inner, body.in-login .content-inner").addClass("ready");


      $("body.mobile #footer h4").click(function() {
        $(this).toggleClass("--opened").next("ul").toggle();
      });

      /* Blog detail */
      $(blogdetail[0]).appendTo("body.in-magazin:not(.type-posts-listing) #content");
      Layout.initBlogBlock();
      $("#newsWrapper .news-item img").unveil();

      $("body.ordering-process .content-wrapper").addClass("ready");

      $("#checkoutSidebar .cart-content h4").click(function() {
        $(".order-summary-inner").toggleClass("--toggled");
      });

      var hideTimeout = false, $hideEl;

      $("body").on("mouseover", "#navigation .ext", function(e) {
        // if hovered back on currently hiding element, stop hiding
        if($hideEl && $(this).is($hideEl)) {
          // e.stopPropagation();
          clearTimeout(hideTimeout)
        }
      })

      var oldShowSubmenu = shoptet.menu.showSubmenu;
      function showSubmenu($el) {
        clearTimeout(hideTimeout);
        oldHideSubmenu();

        oldShowSubmenu($el);
      }
      shoptet.scripts.registerFunction(showSubmenu, "menu")

      var oldHideSubmenu = shoptet.menu.hideSubmenu;
      function hideSubmenu() {
        var $hiding = $hideEl = $("#navigation .ext.exp");

        // hide after delay
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(function() {
          if($hideEl === $hiding) // only clear if same instance
            $hideEl = null;

          oldHideSubmenu();
        }, 400);
      }
      shoptet.scripts.registerFunction(hideSubmenu, "menu");

      $("#navigation .menu-level-2>li").each(function() {
        var linkURL = $(this).find("a").attr("href");

        $(this).attr("data-href", linkURL);
      });

      $(document).on('click', '#navigation [data-href]', function() {
        const href = $(this).data('href');
        if(href) {
          window.location.href = href;
        }
      });

      $("body").on("click", ".anchor-link", function() {
        if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if(target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 80
            }, 500);
            return false;
          }
        }
      });



      $(document).trigger("customSnippetsLoaded");
      tb.hooks.signalDomLoad();

      $(".overall-wrapper").addClass("ready");
    });

  });

})();
// JavaScript Document
