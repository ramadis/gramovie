"use strict"
class Movie {
  constructor (params) {
    this.image = params.content;
    this.summary = params.contentSnippet;
    this.rating = params.contentSnippet;
    
    delete params.contentSnippet;
    delete params.content;
    delete params.guid;

    Object.assign(this, params);
  }

  get title () { return this._title; }
  set title (_title) {
    this._title = _title.split('(')[0].trim()
  }

  get summary () { return this._summary; }
  set summary (_summary) {
    this._summary = _summary.split(' min')[1].slice(0, 137) + '...';
  }

  get rating () { return this._rating; }
  set rating (_rating) {
    this._rating = _rating.substr(13,3);
  }

  get image () { return this._image; }
  set image (_image) {
    this._image = _image.split("\"")[3];
  }

  toString () {
    return `${this.title}: ${this.rating}/10

${this.summary}`;
  }

  get rss () {
    return {
      title: this.title,
      url: this.link,
      date: new Date(),
      enclosure: this.enclosure
    };
  }
}

module.exports = Movie;