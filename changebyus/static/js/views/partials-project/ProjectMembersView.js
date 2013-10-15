define(["underscore", "backbone", "jquery", "template", "views/partials-project/ProjectSubView", "views/partials-project/ProjectMemberListItemView"], function(_, Backbone, $, temp, ProjectSubView, ProjectMemberListItemView) {
  var ProjectMembersView;
  return ProjectMembersView = ProjectSubView.extend({
    parent: "#project-members",
    $teamList: null,
    $memberList: null,
    render: function() {
      var _this = this;
      this.$el = $(this.parent);
      console.log('ProjectMembersView render');
      return this.$el.template(this.templateDir + "/templates/partials-project/project-members.html", {}, function() {
        _this.$el.find(".preload").remove();
        _this.$teamList = _this.$el.find("#team-members ul");
        return _this.$memberList = _this.$el.find("#project-members ul");
      });
    },
    addOne: function(model_) {
      var view;
      console.log('ProjectMembersView model_', model_);
      view = new ProjectMemberListItemView({
        model: model_
      });
      return this.$teamList.append(view.el);
    }
  });
});
