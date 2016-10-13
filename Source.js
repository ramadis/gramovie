"use strict"
const Movie = require('./Movie');
const parser = require('rss-parser');
const _ = require('lodash');

class Source {
  // We should extend a class for every source
  constructor (feed) {
    this.movies = this.queue = [];
    this.feed = feed;
    fetch();
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
    this.queue = this.queue.push(..._.difference(this.movies, fetchMovies()));
  }

  fetchMovies () {
    parser.parseURL(feed, (err, body) => {
      const todayMoviesFilter = (movie) => {
        const today = new Date();
        const pubday = new Date(movie.pubDate);
        return pubday.toLocaleDateString() === today.toLocaleDateString();
      }

      const rawMovies = body.feed.entries;
      return rawMovies.filter(todayMoviesFilter)
                      .map((rawMovie) => new Movie(rawMovie));
    });
  }
}
