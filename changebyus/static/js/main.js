require.config({
  baseUrl: "/static/js",
  paths: {
    "jquery": "ext/jquery/jquery",
    "hotkeys": "ext/jquery/jquery.hotkeys",
    "moment": "ext/moment/moment.min",
    "underscore": "ext/underscore/underscore-min",
    "backbone": "ext/backbone/backbone-min",
    "bootstrap": "ext/bootstrap/bootstrap.min",
    "bootstrap-fileupload": "ext/bootstrap/bootstrap-fileupload",
    "button": "ext/jquery/jquery.screwdefaultbuttonsV2.min",
    "serializeObject": "ext/jquery/jquery.serializeObject.min",
    "serializeJSON": "ext/jquery/jquery.serializeJSON.min",
    "dropkick": "ext/jquery/jquery.dropkick-min",
    "hogan": "ext/hogan/hogan-2.0.0.amd",
    "wysiwyg": "ext/bootstrap/bootstrap-wysiwyg",
    "autocomp": "ext/bootstrap/typeahead.min",
    "prettify": "ext/google/prettify",
    "template": "ext/jquery/template",
    "form": "ext/jquery/jquery.form.min",
    "validate": "ext/jquery/jquery.validate.min",
    "main-view": "views/CBUMainView",
    "discover-view": "views/CBUDiscoverView",
    "project-view": "views/CBUProjectView",
    "project-owner-view": "views/CBUProjectOwnerView",
    "login-view": "views/CBULoginView",
    "signup-view": "views/CBUSignupView",
    "create-view": "views/partials-project/ProjectCreateView",
    "abstract-view": "views/partials-universal/AbstractView",
    "abstract-modal-view": "views/partials-universal/AbstractModalView",
    "project-sub-view": "views/partials-project/ProjectSubView",
    "resource-project-view": "views/partials-universal/ResourceProjectPreviewView",
    "user-view": "views/CBUUserView",
    "dashboard-view": "views/CBUDashboardView",
    "stream-view": "views/CBUStreamView"
  }
});

require(["jquery", "backbone", "main-view", "discover-view", "project-view", "project-owner-view", "login-view", "signup-view", "user-view", "dashboard-view", "stream-view", "create-view"], function($, Backbone, CBUMainView, CBUDiscoverView, CBUProjectView, CBUProjectOwnerView, CBULoginView, CBUSignupView, CBUUserView, CBUDashboardView, CBUStreamView, ProjectCreateView) {
  return $(document).ready(function() {
    var $footer, $navTop, $window, CBUAppRouter, CBURouter, config, footerHeight;
    config = {
      parent: "#frame"
    };
    CBURouter = Backbone.Router.extend({
      routes: {
        "project/:id": "project",
        "project/:id/admin": "projectAdmin",
        "user/:id": "user",
        "discover": "discover",
        "stream/dashboard": "dashboard",
        "create": "create",
        "login": "login",
        "signup": "signup",
        "project": "project",
        "stream": "stream",
        "stream/": "stream",
        "": "default"
      },
      project: function(id_) {
        config.model = {
          id: id_
        };
        config.isOwner = userID === projectOwnerID;
        return window.CBUAppView = new CBUProjectView(config);
      },
      projectAdmin: function(id_) {
        var isOwner;
        isOwner = userID === projectOwnerID;
        config.model = {
          id: id_
        };
        config.isOwner = isOwner;
        return window.CBUAppView = isOwner ? new CBUProjectOwnerView(config) : new CBUProjectView(config);
      },
      user: function(id_) {
        config.model = {
          id: id_
        };
        return window.CBUAppView = new CBUUserView(config);
      },
      discover: function() {
        return window.CBUAppView = new CBUDiscoverView(config);
      },
      dashboard: function() {
        config.model = {
          id: window.userID
        };
        return window.CBUAppView = new CBUDashboardView(config);
      },
      create: function() {
        return window.CBUAppView = new ProjectCreateView(config);
      },
      login: function() {
        return window.CBUAppView = new CBULoginView(config);
      },
      signup: function() {
        return window.CBUAppView = new CBUSignupView(config);
      },
      stream: function() {
        return window.CBUAppView = new CBUStreamView(config);
      },
      "default": function() {
        return window.CBUAppView = new CBUMainView(config);
      }
    });
    CBUAppRouter = new CBURouter();
    Backbone.history.start({
      pushState: true
    });
    /* NAV*/

    $navTop = $('.nav.pull-left');
    $navTop.hover(function() {
      return $(this).toggleClass('active');
    }, function() {
      return $(this).removeClass('active');
    });
    /* LOG OUT*/

    $("a[href='/logout']").click(function(e) {
      var _this = this;
      e.preventDefault();
      return $.ajax({
        type: "GET",
        url: "/logout"
      }).done(function(response) {
        return window.location.reload();
      });
    });
    /* GLOBAL UTILS*/

    window.popWindow = function(url) {
      var h, left, title, top, w;
      title = "social";
      w = 650;
      h = 650;
      left = (screen.width / 2) - (w / 2);
      top = (screen.height / 2) - (h / 2);
      return window.open(url, title, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=+" + left);
    };
    window.delay = function(time, fn) {
      return setTimeout(fn, time);
    };
    window.arrayToListString = function(arr_) {
      var i, str, _i, _len;
      for (i = _i = 0, _len = arr_.length; _i < _len; i = ++_i) {
        str = arr_[i];
        arr_[i] = capitalize(str);
      }
      if (arr_.length <= 1) {
        str = arr_.join();
      } else {
        str = arr_.slice(0, -1).join(", ") + " and " + arr_[arr_.length - 1];
      }
      return str;
    };
    window.capitalize = function(str_) {
      var str;
      return str = str_.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
    window.buttonize3D = function() {
      var $btn, $btn3d, btn, _i, _len, _results;
      $btn3d = $('.btn-3d');
      _results = [];
      for (_i = 0, _len = $btn3d.length; _i < _len; _i++) {
        btn = $btn3d[_i];
        console.log(btn);
        $btn = $(btn);
        $btn.parent().addClass('btn-3d-parent');
        _results.push($btn.attr('data-content', $btn.html()));
      }
      return _results;
    };
    /* STICKY FOOTER*/

    $window = $(window);
    footerHeight = 0;
    $footer = $(".footer-nav");
    window.positionFooter = function() {
      return delay(100, function() {
        footerHeight = parseInt($footer.height()) + parseInt($footer.css('margin-top'));
        console.log($footer.css('margin-top'), footerHeight, $(document.body).height(), $window.height());
        if (($(document.body).height() + footerHeight) < $window.height()) {
          return $footer.css({
            position: "fixed",
            bottom: 0
          });
        } else {
          return $footer.css({
            position: "relative"
          });
        }
      });
    };
    positionFooter();
    $window.scroll(positionFooter).resize(positionFooter);
    return window.onPageElementsLoad = function() {
      console.log('onPageElementsLoad');
      return positionFooter();
    };
    /* END STICKY FOOTER*/

  });
});
