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
//
