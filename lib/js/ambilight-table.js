// Generated by CoffeeScript 1.3.3
(function() {
  var $, _ref, _ref1, _ref2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if ((_ref = window.Ambilight) == null) {
    window.Ambilight = {};
  }

  window.Ambilight.Background = (function() {

    function Background(image, canvas, strength) {
      this.render = __bind(this.render, this);
      this.image = image[0];
      this.canvas = canvas[0];
      this.strength = strength;
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height;
      this.context = this.canvas.getContext("2d");
      this.context.drawImage(this.image, 0, 0);
      this.render();
    }

    Background.prototype.render = function() {
      var x, y;
      this.context.globalAlpha = 0.2;
      y = -this.strength;
      while (y <= this.strength) {
        x = -this.strength;
        while (x <= this.strength) {
          this.context.drawImage(this.canvas, x, y);
          if (x >= 0 && y >= 0) {
            this.context.drawImage(this.canvas, -(x - 1), -(y - 1));
          }
          x += 2;
        }
        y += 2;
      }
      this.context.globalAlpha = 1.0;
      $(this.canvas).css("transform", "scale(3)");
      return $(this.canvas).css("opacity", "0.6");
    };

    return Background;

  })();

  if ((_ref1 = window.Ambilight) == null) {
    window.Ambilight = {};
  }

  window.Ambilight.Border = (function() {

    function Border(image, canvas, strength) {
      this.render = __bind(this.render, this);
      this.image = image[0];
      this.canvas = canvas[0];
      this.strength = strength;
      this.canvas.width = this.image.width * 4;
      this.canvas.height = this.image.height * 4;
      this.context = this.canvas.getContext("2d");
      this.context.drawImage(this.image, this.image.width / 2, this.image.height / 2, this.image.width / 2, this.image.height / 2);
    }

    Border.prototype.render = function() {
      var x, y;
      this.context.globalAlpha = 0.5;
      y = -this.strength;
      while (y <= this.strength) {
        x = -this.strength;
        while (x <= this.strength) {
          this.context.drawImage(this.canvas, x, y);
          if (x >= 0 && y >= 0) {
            this.context.drawImage(this.canvas, -(x - 1), -(y - 1));
          }
          x += 2;
        }
        y += 2;
      }
      while (y <= this.strength) {
        x = -this.strength;
        while (x <= this.strength) {
          this.context.drawImage(this.canvas, x, y);
          if (x >= 0 && y >= 0) {
            this.context.drawImage(this.canvas, -(x - 1), -(y - 1));
          }
          x += 2;
        }
        y += 2;
      }
      this.context.globalAlpha = 1.0;
      return $(this.canvas).css("opacity", "0.6");
    };

    return Border;

  })();

  $ = jQuery;

  $.extend($.fn, {
    ambilight: function(options) {
      return this.each(function() {
        if ($(this).data("_ambilightTable") == null) {
          return $(this).data('_ambilightTable', new window.Ambilight.Table(this, options));
        }
      });
    }
  });

  if ((_ref2 = window.Ambilight) == null) {
    window.Ambilight = {};
  }

  window.Ambilight.Table = (function() {
    var currentID;

    currentID = 0;

    function Table(element, options) {
      this.preloadImages = __bind(this.preloadImages, this);

      this.onKeydown = __bind(this.onKeydown, this);

      this.deactivateCurrentImage = __bind(this.deactivateCurrentImage, this);

      this.delegateEvents = __bind(this.delegateEvents, this);
      this.el = $(element);
      this.images = this.el.find("img");
      this.options = this.setDefaults(options);
      this.prepareImages();
      this.preloadImages();
    }

    Table.prototype.activateImage = function(image) {
      this.deactivateCurrentImage();
      image = $(image);
      this.currentImage = image;
      return image.data("_ambilightContainer").addClass("ambilight-active");
    };

    Table.prototype.blurImage = function(image) {
      var canvas, id;
      image = $(image);
      if (image.data("_ambilightCanvas") != null) {
        return true;
      }
      id = image.data("id");
      canvas = $("<canvas id='ambilight-canvas-" + id + "' class='ambilight-canvas'></canvas>");
      image.data("_ambilightCanvas", canvas);
      image.data("_ambilightContainer").prepend(canvas);
      this.wrapTable(canvas);
      return this.convertImage(image, canvas);
    };

    Table.prototype.convertImage = function(image, canvas) {
      switch (this.options.renderMethod) {
        case "background":
          return new window.Ambilight.Background(image, canvas, this.options.strength);
        case "border":
          return new window.Ambilight.Border(image, canvas, this.options.strength);
      }
    };

    Table.prototype.delegateEvents = function() {
      return $(document).on("keydown", this.onKeydown);
    };

    Table.prototype.deactivateCurrentImage = function() {
      if (this.currentImage == null) {
        return true;
      }
      return this.currentImage.data("_ambilightContainer").removeClass("ambilight-active");
    };

    Table.prototype.nextImage = function() {
      var newIndex;
      newIndex = this.images.index(this.currentImage) + 1;
      if (newIndex > this.images.length - 1) {
        newIndex = 0;
      }
      return this.setImage(newIndex);
    };

    Table.prototype.onKeydown = function(e) {
      switch (e.keyCode) {
        case 40:
          return this.previousImage();
        case 37:
          return this.previousImage();
        case 38:
          return this.nextImage();
        case 39:
          return this.nextImage();
      }
    };

    Table.prototype.preloadImages = function() {
      var imagesLoaded,
        _this = this;
      imagesLoaded = [];
      return this.images.on("load", function(e) {
        var image;
        image = $(e.currentTarget);
        if (_this.images.index(image) === 0) {
          _this.setImage(0);
        }
        imagesLoaded.push(image);
        if (_this.images.length === imagesLoaded.length) {
          _this.delegateEvents();
          return _this.el.trigger("allAmbilightImagesLoaded");
        }
      });
    };

    Table.prototype.prepareImages = function() {
      var image, _i, _len, _ref3, _results;
      _ref3 = this.images;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        image = _ref3[_i];
        image = $(image);
        image.addClass("ambilight-image");
        image.data("id", ++currentID);
        image.attr("id", "ambilight-image-" + (image.data("id")));
        image.wrap($("<div class='ambilight-image-container'></div>"));
        image.data("_ambilightContainer", image.closest(".ambilight-image-container"));
        _results.push(this.wrapTable(image));
      }
      return _results;
    };

    Table.prototype.previousImage = function() {
      var newIndex;
      newIndex = this.images.index(this.currentImage) - 1;
      if (newIndex < 0) {
        newIndex = this.images.length - 1;
      }
      return this.setImage(newIndex);
    };

    Table.prototype.setDefaults = function(options) {
      var _ref3, _ref4;
      if (options == null) {
        options = {};
      }
      if ((_ref3 = options.renderMethod) == null) {
        options.renderMethod = "background";
      }
      if ((_ref4 = options.strength) == null) {
        options.strength = 10;
      }
      return options;
    };

    Table.prototype.setImage = function(index) {
      this.activateImage(this.images[index]);
      return this.blurImage(this.images[index]);
    };

    Table.prototype.wrapTable = function(element) {
      element.wrap($("<div class='ambilight-image-table'></div>"));
      return element.wrap($("<div class='ambilight-image-cell'></div>"));
    };

    return Table;

  })();

}).call(this);
