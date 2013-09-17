
define(["underscore", 
        "backbone", 
        "jquery", 
        "template",
        "views/partials/ProjectCalenderView",
        "views/partials/ProjectMembersView",
        "views/partials/ProjectUpdatesView",
        "model/ProjectModel",
        "collection/ProjectCalendarCollection",
        "collection/ProjectMemberCollection",
        "collection/ProjectUpdatesCollection"
        ],

 function(_, 
          Backbone, 
          $, 
          temp, 
          ProjectCalenderView, 
          ProjectMembersView, 
          ProjectUpdatesView, 
          ProjectModel, 
          ProjectCalendarCollection, 
          ProjectMemberCollection, 
          ProjectUpdatesCollection) {
    
    var CBUProjectView = Backbone.View.extend({

        parent: 'body',
        templateDir: '/static',
        viewData:{},
        projectCalenderView:null,
        projectMembersView:null,
        projectUpdatesView:null,
        updatesBTN:null,
        membersBTN:null,
        calendarBTN:null,

        initialize: function(options) {
            var self = this;

            this.templateDir = options.templateDir || this.templateDir;
            this.parent      = options.parent || this.parent;  
            this.model       = new ProjectModel(options.model);
            this.collection  = options.collection || this.collection;
           
            this.model.fetch({
                success:function(){ self.render(); }
            });
        },

        render:function(){
            var self = this;

            this.$el = $("<div class='project-container'/>");
            this.$el.template(this.templateDir + '/templates/project.html', {}, function() {
                self.addSubViews();
            });

            $(this.parent).append(this.$el); 
        },

        addSubViews:function(){
            var self = this,
                $header = $("<div class='project-header'/>");

            $header.template(this.templateDir + '/templates/partials-project/project-header.html', {data:this.model.attributes}, function() {
                var id = {id:self.model.get('id')},
                    projectUpdatesCollection  = new ProjectUpdatesCollection(id),
                    projectMemberCollection   = new ProjectMemberCollection(id),
                    projectCalendarCollection = new ProjectCalendarCollection(id);

                self.projectUpdatesView  = new ProjectUpdatesView({collection:projectUpdatesCollection}); 
                self.projectMembersView  = new ProjectMembersView({collection:projectMemberCollection});
                self.projectCalenderView = new ProjectCalenderView({collection:projectCalendarCollection});

                self.updatesBTN  = $('a[href="#updates"]');
                self.membersBTN  = $('a[href="#members"]');
                self.calendarBTN = $('a[href="#calendar"]');

                self.projectMembersView.hide(); 
                self.projectCalenderView.hide();

                var hash = window.location.hash.substring(1);
                if (hash == "") {
                    self.toggleSubView("updates"); 
                }else{
                    self.toggleSubView(hash); 
                } 

                $(window).bind('hashchange', function(e){
                    var hash = window.location.hash.substring(1);
                    self.toggleSubView(hash);
                    e.preventDefault();
                }); 
            });

            this.$el.prepend($header);
            
        },

        toggleSubView:function(view){
            this.projectUpdatesView.hide(); 
            this.projectMembersView.hide(); 
            this.projectCalenderView.hide();

            this.updatesBTN.removeClass('active');
            this.membersBTN.removeClass('active');
            this.calendarBTN.removeClass('active');

            switch(view){
                case "updates":
                    this.projectUpdatesView.show();
                    this.updatesBTN.addClass('active');
                    break;
                
                case "members":
                    this.projectMembersView.show();
                    this.membersBTN.addClass('active');
                    break;

                case "calendar":
                    this.projectCalenderView.show();
                    this.calendarBTN.addClass('active');
                    break;
            }
        }
    });

    return CBUProjectView;
    
});


