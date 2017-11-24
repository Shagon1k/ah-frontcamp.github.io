import {API_KEY, ARTICLES_ADDING_NUMBER, ARTICLES_DEFAULT_NUMBER, NEWS_SOURCES} from './js/config.js';
import Article from './js/components/Article.js';
import ArticlesBox from './js/components/ArticlesBox.js';
import Source from './js/components/Source.js';
import SourceChooser from './js/components/SourceChooser.js';

let sourcesArray = [],
    articlesArray = [],
    sourceChooser,
    articlesBox,
    newsSourceStorage = [];         //will store already downloaded information


NEWS_SOURCES.forEach((source) => {sourcesArray.push(new Source(source))});
sourceChooser = new SourceChooser(sourcesArray);
document.querySelector('.sourceListContainer').innerHTML = sourceChooser.render();

articlesBox = new ArticlesBox(ARTICLES_DEFAULT_NUMBER, ARTICLES_ADDING_NUMBER);

document.querySelector('.sourceList').addEventListener('click', (e) => {
    if (e.target.tagName != 'LI') return;

    let selectedSourceId = e.target.dataset.sourceId,
    	selectedSourceIsActive = e.target.dataset.sourceActive,
        resultSource,
        xhr,
        articles;

    if (selectedSourceIsActive === "false") {
    	e.target.dataset.sourceActive = "true";
    	e.target.classList.toggle('activeSource');
    	resultSource = newsSourceStorage.find((elem) => elem.sourceId === selectedSourceId);

    	if (resultSource) {
    	    articlesBox.addSource(resultSource.sourceArticles);
			document.querySelector('.articleBoxContainer').innerHTML = articlesBox.render();
    	} else {
    	    xhr = new XMLHttpRequest();
    	    xhr.open('GET', `https://newsapi.org/v2/top-headlines?sources=${selectedSourceId}&apiKey=${API_KEY}`);
    	    xhr.send();
    	    xhr.onload = function() {
    	        articles = JSON.parse(this.responseText).articles;
    	        articlesBox.addSource(articles);
    	        newsSourceStorage.push({
    	            sourceId: selectedSourceId,
    	            sourceArticles: articles
    	        });
    	        document.querySelector('.articleBoxContainer').innerHTML = articlesBox.render();
    	    }
    	}

    } else {
    	e.target.dataset.sourceActive = "false";
    	e.target.classList.toggle('activeSource');
    	articlesBox.removeSource(selectedSourceId);
    	document.querySelector('.articleBoxContainer').innerHTML = articlesBox.render();
    }

})


document.querySelector('.dummyButton').addEventListener('click', () => {
    articlesBox.increaseRenderedArticles();
    document.querySelector('.articleBoxContainer').innerHTML = articlesBox.render();
})