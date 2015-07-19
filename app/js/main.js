// Template Function
var template = function(id) {
  return _.template( $('#' + id).html() );
};

// Models
var Contact = Backbone.Model.extend({});

// Collections
var Contacts = Backbone.Collection.extend({
  model: Contact,
  comparator: 'name',

  url: 'http://tiy-515.herokuapp.com/collections/chrisbusta',
});

// Views - Form Actions
var AddContactView = Backbone.View.extend({
  el: '#addContacts',
  events: {
    'submit': 'addContacts'
  },
  addContacts: function(e) {
    e.preventDefault();

    this.collection.create({
      name: this.$('#first_last').val(),
      email: this.$('#email').val(),
      phone: this.$('#phone_number').val()
    }, { wait: true });

    this.clearForm();
  },
  clearForm: function() {
    this.$('#first_last').val(''),
    this.$('#email').val(''),
    this.$('#phone_number').val('');
  }
});

// Views - Books
var ContactsView = Backbone.View.extend({
  tagName: 'tbody',
  initialize: function() {
    this.collection.on('add', this.addOne, this);
  },
  render: function() {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function(book) {
    var contactView = new ContactView({ model: book });
    this.$el.append(contactView.render().el);
  }
});

var ContactView = Backbone.View.extend({
  tagName: 'tr',
  template: template('contactTemplate'),
  initialize: function() {


    // New method:
    this.listenTo(this.model, 'destroy', this.remove);
  },
  render: function() {
    this.$el.html( this.template( this.model.toJSON() ));
    console.log(this.model.toJSON());
    return this;
  },
  events: {
    'click a.edit': 'editContact',
    'click a.delete': 'deleteContact'
  },
  editContact: function() {
    console.log(this.model.toJSON());
  },
  deleteContact: function() {
    this.model.destroy();
  }
});



// create an instance of the model
var contacts = new Contacts();

// sample data
contacts.add({ name: "Christian Bustamante", email: "chrisbusta@hotmail.com", phone: 7703556211 });
contacts.add({ name: "Linda Bustamante", email: "mathewsL@hotmail.com", phone: 4049931502 });
contacts.add({ name: "Alexander Bustamante", email: "alexander@gmail.com", phone: 7703556212 });
contacts.add({ name: "Gloria Bustamante", email: "gloria@gmail.com", phone: 7062161909 });


// create a view instance of the collection
// create view after data to keep data sorted
var allContactsView = new ContactsView({ collection: contacts }).render();
$('#allContacts').append(allContactsView.el);

var addContactsView = new AddContactView({ collection: contacts });
