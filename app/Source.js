"use strict"
const Movie = require('./Movie');
const parser = require('rss-parser');
const _ = require('lodash');

class Source {
  // We should extend a class for every source
  constructor (feed) {
    this.movies = [];
    this.queue = [];
    this.feed = feed;
  }

  inform () {
    const movie = this.queue.shift();
    if (movie) this.movies.push(movie);
    return movie;
  }

  findMovie (title) {
    return this.movies.find((movie) => movie.title === title)
  }

  fetch () {
    return new Promise((resolve, fail) => {
      parser.parseURL(this.feed, (err, body) => {
        const todayMoviesFilter = (movie) => {
          const today = new Date();
          const pubday = new Date(movie.pubDate);
          return pubday.toLocaleDateString() < today.toLocaleDateString();
        }

        const rawMovies = body.feed.entries;
        const movies = rawMovies.filter(todayMoviesFilter)
                                .map((rawMovie) => new Movie(rawMovie));

        const difference = movies.filter((movie) => !this.movies.find(savedMovie => savedMovie.title === movie.title))
        this.queue.push(...difference);
        resolve();
      });
    });
  }
}

module.exports = Source;