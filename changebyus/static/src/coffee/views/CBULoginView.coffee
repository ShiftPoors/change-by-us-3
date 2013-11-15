define ["underscore", "backbone", "jquery", "template", "validate"], 
	(_, Backbone, $, temp, valid) ->
		CBUDLoginView = Backbone.View.extend
			parent: "body"
			templateDir: "/static"
			viewData: {} 
			
			initialize: (options) ->
				@templateDir = options.templateDir or @templateDir
				@parent = options.parent or @parent
				@viewData = options.viewData or @viewData
				@render()

			render: -> 
				@$el = $("<div class='login'/>")
				@$el.template @templateDir + "/templates/login.html",
					data: @viewData, =>
						@ajaxForm()
						@addListeners()
						onPageElementsLoad()

				$(@parent).append @$el

			addListeners: ->
				$(".btn-info").click (e) ->
					e.preventDefault()
					url = $(this).attr("href")
					popWindow url


			ajaxForm: -> 
				$submit   = $("input[type='submit']")
				$form     = $("form")
				$login    = $("form[name='signin']")
				$feedback = $(".login-feedback")
				options   =
					beforeSubmit: =>
						if $form.valid()
							$form.find("input, textarea").attr("disabled", "disabled")
							$feedback.removeClass("alert").removeClass("alert-danger").html ""
							return true
						else
							return false

					success: (response) =>
						$form.find("input, textarea").removeAttr("disabled")

						if response.msg.toLowerCase() is "ok"
							window.location.href = "/"
						else
							$feedback.addClass("alert").addClass("alert-danger").html response.msg

				$login.ajaxForm options