// Template Function
var template = function(id) {
  return _.template( $('#' + id).html() );
};

// Models
var Book = Backbone.Model.extend({});

// Collections
var Books = Backbone.Collection.extend({
  model: Book,
  comparator: 'title',
  // localStorage: new Backbone.LocalStorage("BookCollection")
  url: 'http://tiy-515.herokuapp.com/collections/chrisbusta',
});

// Views - Form Actions
var AddBookView = Backbone.View.extend({
  el: '#addBook',
  events: {
    'submit': 'addBook'
  },
  addBook: function(e) {
    e.preventDefault();

    this.collection.create({
      title: this.$('#book_title').val(),
      author: this.$('#book_author').val(),
      year: this.$('#book_year').val()
    }, { wait: true });

    this.clearForm();
  },
  clearForm: function() {
    this.$('#book_title').val(''),
    this.$('#book_author').val(''),
    this.$('#book_year').val('');
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
  template: template('bookTemplate'),
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

// sampe data
books.add({ title: "Dandelion Wine", author: "Ray Bradbury", year: 2001 });
books.add({ title: "The Electric Kool-aid Acid Test", author: "Tom Wolfe", year: 2011 });
books.add({ title: "Henry & June", author: "Anais Nin", year: 2021 });
books.add({ title: "Cooked", author: "Michael Pollan", year: 2001 });
books.add({ title: "Sweet Dreams", author: "John Dennett", year: 2009 });
books.add({ title: "Kitchen Confidential", author: "Anthony Bourdain", year: 2008 });

// create a view instance of the collection
// create view after data to keep data sorted
var allBooksView = new BooksView({ collection: books }).render();
$('#allBooks').append(allBooksView.el);

var addBooksView = new AddBookView({ collection: books });
