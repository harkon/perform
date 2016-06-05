/**
 * Created by Harris on 5/6/2016.
 */

var App = (function () {
    'use strict';

    var apiKey ='e2d4ca37c05e23e1e281028262a07c75';
    var apiBaseUrl = 'https://api.themoviedb.org/3';
    var apiImageBaseUrl = 'http://image.tmdb.org/t/p/w185';
    var apiSearchUrl = '/search/movie';

    var result = {};
    var elem;

    /**
     * XMLHttpRequest Utility function
     * @param url
     * @param cb
     */
    function request(url, cb){
        var aReq = new XMLHttpRequest();
        aReq.addEventListener('load', cb);
        aReq.open("GET", url, true);
        aReq.send();
    }

    /**
     * Load Image Utility function
     * @param path
     */
    function loadImage(path){
        if(!path) return;
        var image = new Image();
        image.onerror = function() {
            console.log('error loading image')
        };
        image.onload = function() {
            elem.appendChild(this);
        };
        // start loading
        image.src = apiImageBaseUrl + path;
    }

    /**
     * XMLHttpRequest Callback
     * @param event
     */
    function onSearch(event){
        var json = JSON.parse(event.target.response);
        Object.assign(result, json);
        result.results.map(function (movie, i, arr) {
            loadImage(movie.poster_path);
        });
    }

    /**
     * Init function
     * @param el
     */
    function init(el){
        elem = el;
    }

    /**
     * Search function
     * @param query
     * @param page
     */
    function search(query, page){
        query = (query) ? result.query = query : result.query;
        var url = apiBaseUrl + apiSearchUrl + '?api_key=' + apiKey + '&query=' + query + '&page=' + page;
        elem.innerHTML = '';
        request(url, onSearch);
        return;
    }

    /**
     * Next function
     * @param page
     */
    function goNext(page){
        page = (page <= result.total_pages) ? page : 1;
        search(result.query, page);
    }

    /**
     * Previious function
     * @param page
     */
    function goPrevious(page){
        page = (page >= 1) ? page : result.total_pages;
        search(result.query, page);
    }

    return {
        result: result,
        init: init,
        search: search,
        next: goNext,
        previous: goPrevious
    }

})();