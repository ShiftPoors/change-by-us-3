define ["underscore", "backbone", "jquery", "template", "abstract-view"], (_, Backbone, $, temp, AbstractView) ->
  ProjectDiscussionPreviewView = AbstractView.extend(
    
    #parent:"#project-update",
    initialize: (options) ->
      AbstractView::initialize.apply this, options
      @render()

    render: ->
      @$el = $("<div class='project'/>")
      @$el.template @templateDir + "/templates/partials-project/project-discussion-preview.html",
        data: @viewData
      , ->
        self.ajaxForm()

      $(@parent).append @$el
  )
  ProjectDiscussionPreviewView

