define ["underscore", 
        "backbone", 
        "jquery",  
        "template", 
        "views/partials-discover/BannerSearchView", 
        "collection/ProjectListCollection", 
        "abstract-view"], 
    (_, 
     Backbone, 
     $, 
     temp, 
     BannerSearchView, 
     ProjectListCollection, 
     AbstractView) ->
        
        CBUDiscoverView = AbstractView.extend

            initialize: (options_) ->
                AbstractView::initialize.call @, options_
                @collection  = options_.collection or new ProjectListCollection()
                @render()

            render: -> 
                @$el = $("<div class='discover'/>")
                @$el.template @templateDir+"discover.html",
                    {data: @viewData}, => @onTemplateLoad()

            onTemplateLoad:->
                $(@parent).append @$el
                searchParent = @$el.find(".content")
                
                @bannerSearchView = new BannerSearchView({parent:searchParent})
                @bannerSearchView.on "ON_RESULTS", (s)=> @onResults(s)

                @collection.on "reset", @addAll, @
                @collection.fetch reset: true

                AbstractView::onTemplateLoad.call @


            # EVENTS
            # ----------------------------------------------------------------------
            updatePage:->
                @bannerSearchView.updatePage()

            nextPage:(e)->
                @bannerSearchView.nextPage(e)

            prevClick:(e)->
                @bannerSearchView.prevClick(e)

            pageClick:(e)->
                @bannerSearchView.pageClick(e)

            checkArrows:->
                @bannerSearchView.checkArrows()
                
            onResults:(size_)->
                @$el.find(".preload").remove()

                if size_ > 0
                    @$el.find("#no-result").hide()
                else
                    @$el.find("#no-result").show().template @templateDir+"partials-discover/no-results.html",
                        data: {}, =>
