define ["underscore", "backbone", "jquery", "template", "dropkick", "abstract-view","autocomp", "model/ProjectModel", "resource-project-view"], 
	(_, Backbone, $, temp, dropkick, AbstractView, autocomp, ProjectModel, ResourceProjectPreviewView) ->
		BannerSearchView = AbstractView.extend

			byProjectResources:'projects'
			sortByPopularDistance:'popular'
			locationObj:{lat:0, lon:0, name:""}
			category:""
			ajax:null
			initSend:true

			initialize: (options) ->
				AbstractView::initialize.call @, options
				@render()

			events:
				"click .search-catagories li":"categoriesClick"
				"focus #search-input":"showInput"
				"keypress #search-input":"onInputEnter"
				"click #modify":"toggleVisibility"
				"click .pill-selection":"pillSelection"
				"click .search-inputs .btn":"sendForm"

			render: -> 
				@$el = $(".banner-search")
				@$el.template @templateDir + "/templates/partials-discover/banner-search.html",
					data: @viewData, => 
						@onTemplateLoad()
				$(@parent).append @$el

			onTemplateLoad:->
				$('#search-near').typeahead(
					template: '<div class="zip">{{ name }} {{ zip }}</div>'
					engine: Hogan 
					valueKey: 'name'
					name: 'zip'
					remote:
						url: "/api/project/geopoint?s=%QUERY"
						filter: (resp) ->
							zips = []
							if resp.msg.toLowerCase() is "ok" and resp.data.length > 0
								for loc in resp.data
									zips.push {'name':loc.name,'lat':loc.lat,'lon':loc.lon, 'zip':loc.zip}
							zips
				).bind('typeahead:selected', (obj, datum) =>
					@locationObj = datum 
				)

				$dropkick = $('#search-range').dropkick()
				@$resultsModify = $('.results-modify')
				
				@delegateEvents()
				onPageElementsLoad()
				@autoGetGeoLocation()

			autoGetGeoLocation:->
				if navigator.geolocation
					navigator.geolocation.getCurrentPosition (loc)=>
						@handleGetCurrentPosition(loc)
					, @sendForm
				else
					@sendForm()

			handleGetCurrentPosition:(loc)->
				@locationObj.lat = loc.coords.latitude
				@locationObj.lon = loc.coords.longitude

				console.log 'handleGetCurrentPosition:(loc)', loc
				url = "/api/project/geoname?lat=#{@locationObj.lat}&lon=#{@locationObj.lon}"
				$.get url, (resp) ->
					if resp.success then $("#search-near").val resp.data[0].name

				@sendForm()

			categoriesClick:(e)->
				@category = $(e.currentTarget).html()
				$('#search-input').val @category
				$('.search-catagories').hide()

			pillSelection:(e)->
				$this = $(e.currentTarget)
				$this.toggleClass('active')
				$this.siblings().toggleClass('active')

				switch $this.html()
					when 'Projects'
						@byProjectResources = 'projects'
					when 'Resources'
						@byProjectResources = 'resources'
					when 'Popular'
						@sortByPopularDistance = 'popular'
					when 'Distance'
						@sortByPopularDistance = 'distance'

			showInput:->
				@category = ""
				$('.search-catagories').show()
				

			toggleVisibility:(e)->
				onClick = false
				if e 
					e.preventDefault()
					onClick = true

				@$resultsModify.toggle(!onClick)
				$('.search-toggles').toggle(onClick)
				$('.filter-within').toggle(onClick)

			onInputEnter:(e) ->
				if e.which is 13
					@sendForm()

			sendForm:(e)->
				if e then e.preventDefault()
				
				$('.search-catagories').hide()
				$("#projects-list").html("")

				dataObj = {
					s: if @category is "" then $("#search-input").val() else ""
					cat: @category
					loc: @locationObj.name
					d: $("select[name='range']").val()
					type: @byProjectResources  
					lat: @locationObj.lat
					lon: @locationObj.lon
				}

				if @ajax then @ajax.abort()
				@ajax = $.ajax(
					type: "POST"
					url: "/api/project/search"
					data: JSON.stringify(dataObj)
					dataType: "json" 
					contentType: "application/json; charset=utf-8"
				).done (response_)=>
					if response_.success 
						if @initSend is false
							if @locationObj.name isnt "" then @toggleVisibility()
							@$resultsModify.find('input').val @locationObj.name
						@initSend = false

						size=0
						for k,v of response_.data
							@addProject v._id
							size++
						$('h4').html(size+" Projects")
						onPageElementsLoad()

			addProject:(id_)->
				projectModel = new ProjectModel({id:id_})
				view = new ResourceProjectPreviewView({model: projectModel, parent: "#projects-list"})
				view.fetch() 