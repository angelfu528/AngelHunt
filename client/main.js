Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});
//routing
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {
        to: 'navbar'
    });
    this.render('website_form', {
        to: 'form'
    });
    this.render('website_list', {
        to: 'main'
    });
});

Router.route('/:_id', function () {
    this.render('navbar', {
        to: 'navbar'
    });
    this.render('comments_list', {
        to: 'main',
        data: function() {
            return Websites.findOne({_id: this.params._id});
        }
    });
    this.render('comment_form', {
        to: 'comment'
    });
});


// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort: {up:-1}});
	}
});
/* User accounts - wrong */
Template.registerHelper('getUser', function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (user) {
        return user.username;
    }
    else {
        return "anon";
    }
});

Template.comments_list.helpers({
    comments:function(){
        return Comments.find({website: Router.current().params._id});
    }
});


/////
// template events 
/////

Template.website_item.events({
"click .js-upvote":function(event){
    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id = this._id;
    console.log("Up voting website with id "+website_id);
    
    // put the code in here to add a vote to a website!
    /*Websites.update({_id: website_id},
                    {$set: {up: this.up + 1}});*/
	Websites.update({_id: website_id}, {$inc: {up: 1}});
    
    return false;// prevent the button from reloading the page
}, 
"click .js-downvote":function(event){

    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id = this._id;
    console.log("Down voting website with id "+website_id);

    // put the code in here to remove a vote from a website!
    Websites.update({_id: website_id}, {$inc: {down: 1}});
    
    return false;// prevent the button from reloading the page
}
})

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}, 
	"submit .js-save-website-form":function(event){
		// here is an example of how to get the url out of the form:
		var url, title, description; 

			url = event.target.url.value;
			title = event.target.title.value;
		  	description = event.target.description.value;
		  	console.log("site: " + url + "title:" + title + "description: " + description);
		//  put your website saving code in here!	
		    console.log("here")
		    if (Meteor.user()) { 
		        Websites.insert({
				    url: url,
				    title: title,
				    description: description,
				    upVotes: 0,
				    downVotes: 0,
				    createdOn: new Date(),
				    createdBy: Meteor.user()._id
			});
    }
    		console.log("here?")
      	
      		$("#website_form").toggle('slow');
		return false;// stop the form submit from reloading the page
	}
});

Template.comment_form.events({
    "submit .js-save-comment-form":function(event){
        if (Meteor.user()) {
            // here is an example of how to get the comment out of the form:
            var comment = event.target.comment.value;
            console.log("The comment is: "+comment);

            Comments.insert({
                website: Router.current().params._id, 
                comment: comment, 
                createdOn: new Date(),
                user: Meteor.user()._id
            });
            event.target.comment.value = "";
        }
        else {
            alert('You need to be logged in to submit comments!');
        }

        return false; // stop the form submit from reloading the page

    }
});

/*	Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		console.log("Up voting website with id "+website_id);
		// put the code in here to add a vote to a website!
		Websites.update({_id: website_id}, {$inc: {upVotes: 1}});

		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;

		console.log("Down voting website with id "+website_id);

		// put the code in here to remove a vote from a website!
		 Websites.update({_id: website_id}, {$inc: {downVotes: 1}});
		return false;// prevent the button from reloading the page
	}
})*/