define ["underscore", "backbone", "jquery", "template", "abstract-view"], (_, Backbone, $, temp, AbstractView) ->
	ProjectCreateModalView = AbstractView.extend
	
		initialize: (options) ->
			AbstractView::initialize.call @, options
			@render()

		render: ->
			@$el = $("<div class='modal-fullscreen dark'/>") 
			@$el.template @templateDir + "/templates/partials-project/project-create-modal.html",
				data: @viewData,  => @onTemplateLoad()
			$(@parent).append @$el 

			onTemplateLoad:->
				@$el.find(".close-x").click => 
					console.log('close')
					@$el.remove()