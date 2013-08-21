$ = jQuery

$.extend $.fn, ambilight: (options)-> 
  @each -> 
    $(this).data('_ambilightTable', new AmbilightTable(this, options)) unless $(this).data("_ambilightTable")?

class AmbilightTable
  
  currentID = 0

  constructor:(element, options)->
    @element = $ element
    @images = @element.find "img"
    do @prepareImages
    do @delegateEvents
    @setImage 0

  activateImage: (image)->
    do @deactivateCurrentImage
    image = $ image
    @currentImage = image
    image.data("_ambilightContainer").addClass "ambilight-active"

  blurImage: (image)->
    image = $ image
    return true if image.data("_ambilightCanvas")?
    id = image.data "id"
    canvas = $ "<canvas id='ambilight-canvas-#{id}' class='ambilight-canvas'></canvas>"
    image.data "_ambilightCanvas", canvas
    image.data("_ambilightContainer").prepend canvas
    stackBlurImage "ambilight-image-#{id}", "ambilight-canvas-#{id}", 100, true

  delegateEvents: =>
    $(document).on "keydown", @onKeydown

  deactivateCurrentImage: =>
    return true unless @currentImage?
    @currentImage.data("_ambilightContainer").removeClass "ambilight-active"

  nextImage: ->
    newIndex = @images.index(@currentImage)+1
    newIndex = 0 if newIndex > @images.length-1
    @setImage newIndex

  onKeydown: (e)=>
    switch e.keyCode
      when 40 # down
        do @previousImage
      when 37 # left
        do @previousImage
      when 38 # up
        do @nextImage
      when 39 # right
        do @nextImage

  prepareImages: ->
    for image in @images
      image = $ image
      image.addClass "ambilight-image"
      image.data "id", ++currentID
      image.attr "id", "ambilight-image-#{image.data("id")}"
      image.wrap $ "<div class='ambilight-image-container'></div>"
      image.data "_ambilightContainer", image.closest ".ambilight-image-container"
      image.wrap $ "<div class='ambilight-image-table'></div>"
      image.wrap $ "<div class='ambilight-image-cell'></div>"

  previousImage: ->
    newIndex = @images.index(@currentImage)-1
    newIndex = @images.length-1 if newIndex < 0
    @setImage newIndex

  setImage: (index)->
    @activateImage @images[index]
    @blurImage @images[index]

jQuery -> do $(".ambilight-table").ambilight