// Template Function
var template = function(id) {
  return _.template( $('#' + id).html() );
};

// Models
var Book = Backbone.Model.extend({});

// Collections
var Books = Backbone.Collection.extend({
  model: Book,
  comparator: 'name',

  url: 'http://tiy-515.herokuapp.com/collections/chrisbusta',
});

// Views - Form Actions
var AddBookView = Backbone.View.extend({
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
var BooksView = Backbone.View.extend({
  tagName: 'tbody',
  initialize: function() {
    this.collection.on('add', this.addOne, this);
  },
  render: function() {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function(book) {
    var bookView = new BookView({ model: book });
    this.$el.append(bookView.render().el);
  }
});

var BookView = Backbone.View.extend({
  tagName: 'tr',
  template: template('contactTemplate'),
  initialize: function() {
    // Leaky method?:
    // this.model.on('destroy', this.unrender, this);

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
var books = new Books();

// sample data
books.add({ name: "Christian Bustamante", email: "chrisbusta@hotmail.com", phone: 770-355-6211 });
books.add({ name: "Linda Bustamante", email: "", phone: 2011 });
books.add({ name: "Alexander Bustamante", email: "alexander@gmail.com", phone: 2021 });
books.add({ name: "Gloria Bustamante", email: "", phone: 2001 });


// create a view instance of the collection
// create view after data to keep data sorted
var allBooksView = new BooksView({ collection: books }).render();
$('#allContacts').append(allBooksView.el);

var addBooksView = new AddBookView({ collection: books });
