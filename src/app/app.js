/**
 * Created by Harris on 5/6/2016.
 */

var App = (function () {
    'use strict';

    var apiKey ='xxxxx';
    var apiBaseUrl = 'https://api.themoviedb.org/3';
    var apiImageBaseUrl = 'http://image.tmdb.org/t/p/w185';
    var apiSearchUrl = '/search/movie';

    var result = {};
    var searchForm,
        content,
        prev,
        next,
        count = 0,
        length = 0;

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
        length++;
        var image = new Image();
        image.onerror = function() {
            console.log('error loading image')
        };
        image.onload = function() {
            count++;
            content.appendChild(this);
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
        length = 0;
        count = 0;
        result.results.map(function (movie) {
            loadImage(movie.poster_path);
        });
    }

    /**
     * Init function
     * @param el
     */
    function init(){
        searchForm = document.getElementById('searchForm');
        content = document.getElementById('content');
        prev = document.getElementById('prev');
        next = document.getElementById('next');

        searchForm.addEventListener('focus', function reset(e){
            e.target.value = '';
        }, true);

        searchForm.addEventListener('submit', function(e){
            e.preventDefault();
            if (!e.target.movie.value) return;
            var query = JSON.stringify(e.target.movie.value);
            App.search(query, 1);
            return;
        });

        prev.addEventListener('click', function (e) {
            e.preventDefault();
            App.previous(App.result.page + 1);
            return;
        });

        next.addEventListener('click', function(e){
            e.preventDefault();
            App.next(App.result.page + 1);
            return;
        });
    }

    /**
     * Search function
     * @param query
     * @param page
     */
    function doSearch(query, page){
        query = (query) ? result.query = query : result.query;
        var url = apiBaseUrl + apiSearchUrl + '?api_key=' + apiKey + '&query=' + query + '&page=' + page;
        content.innerHTML = '';
        request(url, onSearch);
        return;
    }

    /**
     * Next function
     * @param page
     */
    function goNext(page){
        if(count < length) return;
        page = (page <= result.total_pages) ? page : 1;
        doSearch(false, page);
    }

    /**
     * Previious function
     * @param page
     */
    function goPrevious(page){
        if(count < length) return;
        page = (page >= 1) ? page : result.total_pages;
        doSearch(false, page);
    }

    return {
        result: result,
        init: init,
        search: doSearch,
        next: goNext,
        previous: goPrevious
    }

})();
