const searchBtn=document.getElementById('search-btn-div');
let searchBox=document.getElementById('search-input-div');
searchBtn.addEventListener('click',function(){
    searchBox.classList.toggle('hide-element');
    document.querySelector('.nav-bar-content-box').classList.toggle('zindex-value');
});

// ------------starting of favorite btn-------------
const popularMoviesList=document.getElementsByClassName('popular-movies');

function showFavoriteBttn(elementsVal){
    for(let i=0;i<elementsVal.length;i++){
        elementsVal[i].addEventListener('mouseover',function(event){
            // console.log(elementsVal[i]);
            elementsVal[i].children[1].classList.remove('hide-element');
        });
    }
}

function hideFavoriteBttn(elementsVal){
    for(let i=0;i<elementsVal.length;i++){
        elementsVal[i].addEventListener('mouseout',function(event){
            elementsVal[i].children[1].classList.add('hide-element');
        });
    }
}

let nowPlayingFavBtn=document.getElementsByClassName('now-playing-container');
let airringTodayFavbtn=document.getElementsByClassName('airring-today-container');

function showFavoriteBttn2(elementsVal){
    elementsVal.addEventListener('mouseover',function(event){
        elementsVal.children[2].classList.remove('hide-element');
    });
}
function hideFavoriteBttn2(elementsVal){
    elementsVal.addEventListener('mouseout',function(event){
        elementsVal.children[2].classList.add('hide-element');
    });
}

if(popularMoviesList.length>0){
    showFavoriteBttn(popularMoviesList);
    showFavoriteBttn2(airringTodayFavbtn[0]);
    showFavoriteBttn2(nowPlayingFavBtn[0]);
}

if(popularMoviesList.length>0){
    hideFavoriteBttn2(airringTodayFavbtn[0]);
    hideFavoriteBttn(popularMoviesList);
    hideFavoriteBttn2(nowPlayingFavBtn[0]);
}
//-------------ending of favorite btn---------------

// --------------Starting of searching movies --------------
const searchInput=document.getElementById('search-input');

let searched_Display_Box=document.getElementsByClassName('search-display-box');

// ------------------fetching and displaying function-------
async function fetchingSearchedMovie(typed_Movie_Name){
    let finalApi=`https://www.omdbapi.com/?s=${(typed_Movie_Name).trim()}&page=2&apikey=5216b3fb`;

    let movies_result=await fetch(`${finalApi}`);
    let movies_searched_result=await movies_result.json();
    if(movies_searched_result.Response){
        let movies_data=movies_searched_result.Search;
        let new_element="";
        for(let i=0;i<movies_data.length;i++){
            let movie_value=movies_data[i];
            let img_url;
            if(movie_value.Poster!=="N/A"){
                img_url=movie_value.Poster;
            }
            else{
                img_url='./Photos/timthumb.png'
            }
            new_element+=`<div class="searched-movies" id="${movie_value.imdbID}">
            <div class="searched-movie-picture">
                <img src="${img_url}" alt="">
            </div>
            <div class="searched-movie-info">
                <p>${movie_value.Title}</p>
                <p>${movie_value.Year}</p>
            </div>
            <div class='search-bar-fav-bttn'>
                <i class="fa-regular fa-heart"></i>
            </div>
            </div>`
        }
        searched_Display_Box[0].innerHTML=new_element;
        searchBarFavBttn(searched_Display_Box[0]);
        searchBarFavBttn_inRed(searched_Display_Box[0])
        renderSearchedMovie();
    }
}

let fav_IMDB_array=[];
function searchBarFavBttn(element){
    // console.log(element)
    let len=element.children.length;
    for(var i=0;i<len;i++){
        let id=element.children[i].id;
        let ele=element.children[i].children[2].children[0];
        // console.log(ele);
        ele.addEventListener('click',function(event){
            event.stopPropagation();
            console.log('clicked on heart');
            let ispresent=false;
            if(localStorage.getItem('IMDBList')){
                let array=localStorage.getItem('IMDBList');
                let result=JSON.parse(array);
                let temp_array=[];
                for(var j=0;j<result.length;j++){
                    if(result[j]==id){
                        ispresent=true;
                    }
                    else{
                        temp_array.push(result[j]);
                    }
                }
                fav_IMDB_array=temp_array;
            }
            if(!ispresent){
                fav_IMDB_array.push(id);
                ele.classList.add('favorite-btn-toggle');
            }
            else{
                ele.classList.remove('favorite-btn-toggle');
            }
            localStorage.setItem("IMDBList",JSON.stringify(fav_IMDB_array));
        })
    }
}

function searchBarFavBttn_inRed(element){
    let len=element.children.length;
    for(var i=0;i<len;i++){
        let id=element.children[i].id;
        let ele=element.children[i].children[2].children[0];
        if(localStorage.getItem('IMDBList')){
            let array=localStorage.getItem('IMDBList');
            let result=JSON.parse(array);
            for(var j=0;j<result.length;j++){
                if(id==result[j]){
                    ele.classList.add('favorite-btn-toggle');
                }
            }
        }    
    }    
}
searchInput.addEventListener('keyup',function(){
    let typed_Movie_Name=searchInput.value;
    // console.log(typed_Movie_Name);
    if(typed_Movie_Name.length>0){
        searched_Display_Box[0].classList.remove('hide-element');
        fetchingSearchedMovie(typed_Movie_Name);
    }
    else{
        searched_Display_Box[0].classList.add('hide-element');
    }
})

// --------------ending of searching movies --------------

//---------starting of rendering clicked movie details------------

let searched_movies=document.getElementsByClassName('searched-movies');
let searched_movies_poster=document.getElementsByClassName('poster-div');
let movies_details_box=document.getElementsByClassName('movies-details-box');


function rendering(_result){
    let searched_movies_poster_url;
            if(_result.Poster!=="N/A"){
                searched_movies_poster_url=_result.Poster;
            }
            else{
                searched_movies_poster_url='./Photos/timthumb.png';
            }
            searched_movies_poster[0].innerHTML=`<img class="poster-div-img" src="${searched_movies_poster_url}" alt="">`

            movies_details_box[0].innerHTML=
            ` 
                    <div class="movie-info">
                        <p>Movie Name:&emsp;<span>${_result.Title}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Release Date:&emsp;<span>${_result.Released}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Run Time:&emsp;<span></span>${_result.Runtime}</p>
                    </div>
                    <div class="movie-info">
                        <p>Genre:&emsp;<span>${_result.Genre}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Actor:&emsp;<span>${_result.Actors}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Writer:&emsp;<span>${_result.Writer}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Director:&emsp;<span>${_result.Director}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Plot:&emsp;<span>${_result.Plot}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Language:&emsp;<span>${_result.Language}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Country:&emsp;<span>${_result.Country}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Rating:&emsp;<span>${_result.Ratings[0].Source+":"+_result.Ratings[0].Value}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Box Office:&emsp;<span>${_result.BoxOffice}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>
                            <i class="fa-solid fa-trophy"></i>
                            Award:&emsp;<span>${_result.Awards}</span> 
                        </p>
                    </div>
            `
            localStorage.removeItem("ans");
}

function renderSearchedMovie(){
    for(let i=0;i<searched_movies.length;i++){
        searched_movies[i].addEventListener('click',async function(event){
            let result_url=`https://www.omdbapi.com/?i=${searched_movies[i].id}&apikey=5216b3fb`;
            let result=await fetch(result_url);
            let _result=await result.json();
            if(window.location.pathname=='/index.html'){
                localStorage.setItem("ans",JSON.stringify(_result));
                window.location.assign("http://127.0.0.1:5500/moviePage.html");
            }
            else{
                rendering(_result);
            }
        })
    }
}

/*------rendreing the result after window.location.assign-------------*/
function nextPagemoved(){
    try{
        if(localStorage.getItem("ans").length>0){
            let _result=JSON.parse(localStorage.getItem("ans"));
            rendering(_result);
        }
    }
    catch(e){
        console.log(e);
    }
}
nextPagemoved();
/*------rendreing the result after window.location.assign-------------*/


let nav_bar_form_content=document.getElementsByClassName('nav-bar-form-content');
window.addEventListener('click',(event)=>{
    // console.log(event.target)
    if(event.target!=nav_bar_form_content[0]){
        searched_Display_Box[0].classList.add('hide-element');
    }
})
//---------ending of rendering clicked movie details------------


// ---------------starting of fetching&Displaying Now Playing---
let now_playing_slides=document.querySelector('.now-playing-slides');

let now_playing_next_btn=document.querySelector('.now-playing-next-btn');
let now_playing_prev_btn=document.querySelector('.now-playing-prev-btn');
let now_playing_fav_btn=document.querySelector('.now-playing-fav-btn');
let now_playing=document.querySelector('.now-playing');

function renderingNowPlaying(nowPlaying_Data){
    let now_playing_poster=`https://image.tmdb.org/t/p/w1280/${nowPlaying_Data.results[nowPlayingCounter].backdrop_path}`;
        // console.log(now_playing_poster);
    now_playing.innerHTML=`<img src="${now_playing_poster}" alt="movie-poster" class="now-playing-slides" id=${nowPlaying_Data.results[nowPlayingCounter].id}>`;
        // goNextNowPlaying(nowPlaying_Data);
    // console.log(now_playing);
    now_playing_fav_btn.innerHTML=`<i class="fa-regular fa-heart" id=${nowPlaying_Data.results[nowPlayingCounter].id}></i>`
    toggleFavoriteBttn2(now_playing_fav_btn);
    renderingHeartinRed_Movies2(now_playing_fav_btn);
}
async function fetchingNowPlayingData(){
    if(window.location.pathname=='/index.html'){
        let nowPlayingData=await fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=9b0ead2052060d4e517306d3630ee020');
        let nowPlaying_Data=await nowPlayingData.json();
        // console.log(nowPlaying_Data.results[0]);
        renderingNowPlaying(nowPlaying_Data);
        // console.log('nowplaying 1st poster');
        now_playing_next_btn.addEventListener('click',function(){   nowPlayingCounter++;
            goNextNowPlaying(nowPlaying_Data);
            // document.querySelector('.now-playing-slides').style.transition=`1s`;
        });

        now_playing_prev_btn.addEventListener('click',function(){
            nowPlayingCounter--;
            goPrevNowPlaying(nowPlaying_Data);
        })
        indexPageMovies(now_playing);
    }
}
fetchingNowPlayingData();

let nowPlayingCounter=0;
function goNextNowPlaying(nowPlaying_Data){
    // nowPlaying_Data_value=nowPlaying_Data;
    let result_len=nowPlaying_Data.results.length;
    // console.log(nowPlaying_Data);
    // console.log();
    nowPlayingCounter=nowPlayingCounter%result_len;
    renderingNowPlaying(nowPlaying_Data);
    // let now_playing_poster=`https://image.tmdb.org/t/p/w1280/${nowPlaying_Data.results[nowPlayingCounter].backdrop_path}`;
    //     // console.log(now_playing_poster);
    // now_playing.innerHTML=`<img src="${now_playing_poster}" alt="movie-poster" class="now-playing-slides" id=${nowPlaying_Data.results[nowPlayingCounter].id}>`;
    // toggleFavoriteBttn2(now_playing);
    // console.log('next bttn clicked');
}

function goPrevNowPlaying(nowPlaying_Data){
    let result_len=nowPlaying_Data.results.length;
    if(nowPlayingCounter<0){
        nowPlayingCounter=result_len-1;
    }
    console.log(nowPlayingCounter%result_len);
    renderingNowPlaying(nowPlaying_Data);
    // let now_playing_poster=`https://image.tmdb.org/t/p/w1280/${nowPlaying_Data.results[nowPlayingCounter].backdrop_path}`;
    //     // console.log(now_playing_poster);
    // now_playing.innerHTML=`<img src="${now_playing_poster}" alt="movie-poster" class="now-playing-slides" id=${nowPlaying_Data.results[nowPlayingCounter].id}>`;
    // toggleFavoriteBttn2(now_playing);

}

// ---------------ending of fetching&Displaying Now Playing---


// ------------------------------starting of fetching and displaying popular movies----------------------------

let popularMoviesCounter=0;
let popularNamesCounter=0;
let popular_movies_container=document.querySelector('.popular-movies-container');
let popular_movies_prev_btn=document.querySelector('.popular-movie-prev-btn');
let popular_movies_next_btn=document.querySelector('.popular-movie-next-btn');

let new_div_created=document.querySelector('.new-div-created');

function renderingPopularMovies(PopularMovies_Data){
    new_div_created.innerHTML=`  
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${PopularMovies_Data.results[popularMoviesCounter++].poster_path}" alt="" id=${PopularMovies_Data.results[popularMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${PopularMovies_Data.results[popularMoviesCounter++].poster_path}" alt="" id=${PopularMovies_Data.results[popularMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${PopularMovies_Data.results[popularMoviesCounter++].poster_path}" alt="" id=${PopularMovies_Data.results[popularMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${PopularMovies_Data.results[popularMoviesCounter++].poster_path}" alt="" id=${PopularMovies_Data.results[popularMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            `
            showFavoriteBttn(popularMoviesList);
            hideFavoriteBttn(popularMoviesList);
            indexPageMovies(new_div_created);
            toggleFavoriteBttn(new_div_created);
            renderingHeartinRed_Movies(new_div_created);
}
// ----------------------------------------------------------
let movies_names_info=document.getElementsByClassName('movies-names-info');

function renderingNamesandYears(data_value,moviesCounter,si,ei){
    for(var i=si;i<ei;i++){
        movies_names_info[i].innerHTML=`<p class="movies-names">${data_value.results[moviesCounter].title}</p>
    <p class="movies-year">${data_value.results[moviesCounter].release_date}</p>`
    moviesCounter++
    }
}
// -----------------------------------------------------------
async function fetchingPopularMoviesData(){
    if(window.location.pathname=='/index.html'){
        let PopularMoviesData=await fetch('https://api.themoviedb.org/3/movie/popular?api_key=9b0ead2052060d4e517306d3630ee020');
        let PopularMovies_Data=await PopularMoviesData.json();
        // console.log(PopularMovies_Data);
        // console.log('inside popular movies')
        popularNamesCounter=popularMoviesCounter;
        renderingPopularMovies(PopularMovies_Data);
        renderingNamesandYears(PopularMovies_Data,popularNamesCounter,0,4);
        let popular_len=PopularMovies_Data.results.length;
        popular_movies_next_btn.addEventListener('click',function(){   
            // console.log('popular next btn')
            popularMoviesCounter=popularMoviesCounter%popular_len;
            // console.log(popularMoviesCounter);
            popularNamesCounter=popularMoviesCounter;
            renderingPopularMovies(PopularMovies_Data);
            renderingNamesandYears(PopularMovies_Data,popularNamesCounter,0,4);
        });

        popular_movies_prev_btn.addEventListener('click',function(){
            console.log('prev clicked')
            console.log(popularMoviesCounter);
            if(popularMoviesCounter==4){
                popularMoviesCounter=popular_len-4;
            }
            else{
                popularMoviesCounter=popularMoviesCounter-8;
            }
            popularMoviesCounter=popularMoviesCounter%popular_len;
            // console.log(popularMoviesCounter);
            popularNamesCounter=popularMoviesCounter;
            renderingPopularMovies(PopularMovies_Data);
            renderingNamesandYears(PopularMovies_Data,popularNamesCounter,0,4);
        })
    }
}
fetchingPopularMoviesData();
// -------ending of fetching and displaying popular movies---


// -------------starting of fetching and displaying top rated--

function renderingTopRatedMovies(TopRatedMovies_Data){
    new_div_top_rated.innerHTML=`  
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${TopRatedMovies_Data.results[topRatedMoviesCounter++].poster_path}" alt="" id=${TopRatedMovies_Data.results[topRatedMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${TopRatedMovies_Data.results[topRatedMoviesCounter++].poster_path}" alt="" id=${TopRatedMovies_Data.results[topRatedMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${TopRatedMovies_Data.results[topRatedMoviesCounter++].poster_path}" alt="" id=${TopRatedMovies_Data.results[topRatedMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${TopRatedMovies_Data.results[topRatedMoviesCounter++].poster_path}" alt="" id=${TopRatedMovies_Data.results[topRatedMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            `
            showFavoriteBttn(popularMoviesList);
            hideFavoriteBttn(popularMoviesList);
            indexPageMovies(new_div_top_rated);
            toggleFavoriteBttn(new_div_top_rated);
            renderingHeartinRed_Movies(new_div_top_rated);
            // console.log(new_div_top_rated.innerHTML);
}

let new_div_top_rated=document.querySelector('.new-div-top-rated');
let top_rated_movies_prev_btn=document.querySelector('.top-rated-movies-prev-btn');
let top_rated_movies_next_btn=document.querySelector('.top-rated-movies-next-btn');
let topRatedMoviesCounter=0;
let topRatedNamesCounter=0;
async function fetchingTopRatedMoviesData(){
    if(window.location.pathname=='/index.html'){
        let TopRatedMoviesData=await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=9b0ead2052060d4e517306d3630ee020');
        let TopRatedMovies_Data=await TopRatedMoviesData.json();
        // console.log(PopularMovies_Data);
        // console.log('inside popular movies')
        topRatedNamesCounter=topRatedMoviesCounter;
        renderingTopRatedMovies(TopRatedMovies_Data);
        renderingNamesandYears(TopRatedMovies_Data,topRatedNamesCounter,4,8)
        let topRated_len=TopRatedMovies_Data.results.length;
        top_rated_movies_next_btn.addEventListener('click',function(){   
            console.log('Top Rated next btn')
            topRatedMoviesCounter=topRatedMoviesCounter%topRated_len;
            // console.log(topRatedMoviesCounter);
            topRatedNamesCounter=topRatedMoviesCounter;
            renderingTopRatedMovies(TopRatedMovies_Data);
            renderingNamesandYears(TopRatedMovies_Data,topRatedNamesCounter,4,8);
            
        });

        top_rated_movies_prev_btn.addEventListener('click',function(){
            console.log('prev clicked')
            console.log(topRatedMoviesCounter);
            if(topRatedMoviesCounter==4){
                topRatedMoviesCounter=topRated_len-4;
            }
            else{
                topRatedMoviesCounter=topRatedMoviesCounter-8;
            }
            topRatedMoviesCounter=topRatedMoviesCounter%topRated_len;
            // console.log(topRatedMoviesCounter);
            topRatedNamesCounter=topRatedMoviesCounter;
            renderingTopRatedMovies(TopRatedMovies_Data);
            renderingNamesandYears(TopRatedMovies_Data,topRatedNamesCounter,4,8);
        })
    }
}
fetchingTopRatedMoviesData();

// -------------ending of fetching and displaying top rated--


// -----starting of fetching and displaying of upcoming movies--

function renderingUpcomingMovies(UpcomingMovies_Data){
    new_div_upcoming.innerHTML=`  
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${UpcomingMovies_Data.results[upcomingMoviesCounter++].poster_path}" alt="" id=${UpcomingMovies_Data.results[upcomingMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${UpcomingMovies_Data.results[upcomingMoviesCounter++].poster_path}" alt="" id=${UpcomingMovies_Data.results[upcomingMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${UpcomingMovies_Data.results[upcomingMoviesCounter++].poster_path}" alt="" id=${UpcomingMovies_Data.results[upcomingMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${UpcomingMovies_Data.results[upcomingMoviesCounter++].poster_path}" alt="" id=${UpcomingMovies_Data.results[upcomingMoviesCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            `
            showFavoriteBttn(popularMoviesList);
            hideFavoriteBttn(popularMoviesList);
            indexPageMovies(new_div_upcoming);
            toggleFavoriteBttn(new_div_upcoming);
            renderingHeartinRed_Movies(new_div_upcoming);
            // console.log(new_div_upcoming.innerHTML)
}

let new_div_upcoming=document.querySelector('.new-div-upcoming');
let upcoming_movies_prev_btn=document.querySelector('.upcoming-movies-prev-btn');
let upcoming_movies_next_btn=document.querySelector('.upcoming-movies-next-btn');
let upcomingMoviesCounter=0;
let upcomingNamesCounter=0;
async function fetchingUpcomingMoviesData(){
    if(window.location.pathname=='/index.html'){
        let UpcomingMoviesData=await fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=9b0ead2052060d4e517306d3630ee020');
        let UpcomingMovies_Data=await UpcomingMoviesData.json();
        // console.log(PopularMovies_Data);
        // console.log('inside popular movies')
        upcomingNamesCounter=upcomingMoviesCounter;
        renderingUpcomingMovies(UpcomingMovies_Data);
        renderingNamesandYears(UpcomingMovies_Data,upcomingNamesCounter,8,12);
        let upcoming_len=UpcomingMovies_Data.results.length;
        upcoming_movies_next_btn.addEventListener('click',function(){   
            console.log('Top Rated next btn')
            upcomingMoviesCounter=upcomingMoviesCounter%upcoming_len;
            // console.log(topRatedMoviesCounter);
            upcomingNamesCounter=upcomingMoviesCounter;
            renderingUpcomingMovies(UpcomingMovies_Data);
            renderingNamesandYears(UpcomingMovies_Data,upcomingNamesCounter,8,12);
            
        });

        upcoming_movies_prev_btn.addEventListener('click',function(){
            console.log('prev clicked')
            // console.log(topRatedMoviesCounter);
            if(upcomingMoviesCounter==4){
                upcomingMoviesCounter=upcoming_len-4;
            }
            else{
                upcomingMoviesCounter=upcomingMoviesCounter-8;
            }
            upcomingMoviesCounter=upcomingMoviesCounter%upcoming_len;
            // console.log(topRatedMoviesCounter);
            upcomingNamesCounter=upcomingMoviesCounter;
            renderingUpcomingMovies(UpcomingMovies_Data);
            renderingNamesandYears(UpcomingMovies_Data,upcomingNamesCounter,8,12);
        })
    }
}
fetchingUpcomingMoviesData();
// -----starting of fetching and displaying of upcoming movies--


// --------------------------------------------------Tv shows------------------------------------------
//-----------airring today-----------------------
// let now_playing_slides=document.querySelector('.now-playing-slides');

let airring_today_next_btn=document.querySelector('.airring-today-next-btn');
let airring_today_prev_btn=document.querySelector('.airring-today-prev-btn');

let airring_today=document.querySelector('.airring-today');
let airring_today_fav_btn=document.querySelector('.airring-today-fav-btn');
function renderingAirringToday(airringToday_Data){
    let airring_today_poster=`https://image.tmdb.org/t/p/w1280/${airringToday_Data.results[airringTodayCounter].backdrop_path}`;
    // console.log(now_playing_poster);
    airring_today.innerHTML=`<img src="${airring_today_poster}" alt="movie-poster" class="now-playing-slides" id=${airringToday_Data.results[airringTodayCounter].id}>`;

    airring_today_fav_btn.innerHTML=`<i class="fa-regular fa-heart" id=${airringToday_Data.results[airringTodayCounter].id}></i>`;

    toggleFavoriteBttn3(airring_today_fav_btn);
    renderingHeartinRed_Series2(airring_today_fav_btn);
}
async function fetchinAairringTodayData(){
    if(window.location.pathname=='/index.html'){
        let airringTodayData=await fetch('https://api.themoviedb.org/3/tv/airing_today?api_key=9b0ead2052060d4e517306d3630ee020');
        let airringToday_Data=await airringTodayData.json();
        // console.log(airringToday_Data.results[0]);
        
        // goNextNowPlaying(nowPlaying_Data);
        renderingAirringToday(airringToday_Data)
        indexPageTvShows(airring_today);
        airring_today_next_btn.addEventListener('click',function(){   airringTodayCounter++;
            goNextAirringToday(airringToday_Data);
            // document.querySelector('.now-playing-slides').style.transition=`1s`;
        });

        airring_today_prev_btn.addEventListener('click',function(){
            airringTodayCounter--;
            goPrevAirringToday(airringToday_Data);
        })
    }
}
fetchinAairringTodayData();

let airringTodayCounter=0;
function goNextAirringToday(airringToday_Data){
    // nowPlaying_Data_value=nowPlaying_Data;
    let result_len=airringToday_Data.results.length;
    // console.log(nowPlaying_Data);
    // console.log();
    airringTodayCounter=airringTodayCounter%result_len;
    renderingAirringToday(airringToday_Data)
    // let airring_today_poster=`https://image.tmdb.org/t/p/w1280/${airringToday_Data.results[airringTodayCounter].backdrop_path}`;
    //     // console.log(now_playing_poster);
    // airring_today.innerHTML=`<img src="${airring_today_poster}" alt="movie-poster" class="now-playing-slides" id=${airringToday_Data.results[airringTodayCounter].id}>`;
    // console.log(airring_today);
}

function goPrevAirringToday(airringToday_Data){
    let result_len=airringToday_Data.results.length;
    if(airringTodayCounter<0){
        airringTodayCounter=result_len-1;
    }
    renderingAirringToday(airringToday_Data)
    // console.log(airringTodayCounter%result_len);
    // let airring_today_poster=`https://image.tmdb.org/t/p/w1280/${airringToday_Data.results[airringTodayCounter].backdrop_path}`;
    //     // console.log(now_playing_poster);
    // airring_today.innerHTML=`<img src="${airring_today_poster}" alt="movie-poster" class="now-playing-slides" id=${airringToday_Data.results[airringTodayCounter].id}>`;
}

// --------------starting of on air shows----------------

// --------------------------------------------------------
function renderingNamesandYears2(data_value,moviesCounter,si,ei){
    for(var i=si;i<ei;i++){
        movies_names_info[i].innerHTML=`<p class="movies-names">${data_value.results[moviesCounter].name}</p>
    <p class="movies-year">${data_value.results[moviesCounter].first_air_date}</p>`
    moviesCounter++
    }
}
// ---------------------------------------------------------

function renderingtopRatedTvShow(topRatedTvShow_Data){
    top_rated_show_newDiv.innerHTML=`  
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${topRatedTvShow_Data.results[topRatedTvShowCounter++].poster_path}" alt="" id=${topRatedTvShow_Data.results[topRatedTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${topRatedTvShow_Data.results[topRatedTvShowCounter++].poster_path}" alt="" id=${topRatedTvShow_Data.results[topRatedTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${topRatedTvShow_Data.results[topRatedTvShowCounter++].poster_path}" alt="" id=${topRatedTvShow_Data.results[topRatedTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${topRatedTvShow_Data.results[topRatedTvShowCounter++].poster_path}" alt="" id=${topRatedTvShow_Data.results[topRatedTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            `
            showFavoriteBttn(popularMoviesList);
            hideFavoriteBttn(popularMoviesList);
            indexPageTvShows(top_rated_show_newDiv);
            toggleFavoriteBttn(top_rated_show_newDiv);
            renderingHeartinRed_Series(top_rated_show_newDiv)
            // console.log(top_rated_show_newDiv.innerHTML)
}

let top_rated_show_newDiv=document.querySelector('.on-air-show-newDiv');
let top_rated_show_prev_btn=document.querySelector('.on-air-show-prev-btn');
let top_rated_show_next_btn=document.querySelector('.on-air-show-next-btn');
let topRatedTvShowCounter=0;
let topRatedTvShowNamesCounter=0;
async function fetchingTopRatedTvShowData(){
    if(window.location.pathname=='/index.html'){
        let topRatedTvShowData=await fetch('https://api.themoviedb.org/3/tv/top_rated?api_key=9b0ead2052060d4e517306d3630ee020');
        let topRatedTvShow_Data=await topRatedTvShowData.json();
        // console.log(topRatedTvShow_Data);
        // console.log('inside popular movies')
        topRatedTvShowNamesCounter=topRatedTvShowCounter;
        renderingtopRatedTvShow(topRatedTvShow_Data);
        renderingNamesandYears2(topRatedTvShow_Data,topRatedTvShowNamesCounter,12,16);
        let upcoming_len=topRatedTvShow_Data.results.length;
        top_rated_show_next_btn.addEventListener('click',function(){   
            console.log('Top Rated next btn')
            topRatedTvShowCounter=topRatedTvShowCounter%upcoming_len;
            // console.log(topRatedMoviesCounter);
            topRatedTvShowNamesCounter=topRatedTvShowCounter;
            renderingtopRatedTvShow(topRatedTvShow_Data);
            renderingNamesandYears2(topRatedTvShow_Data,topRatedTvShowNamesCounter,12,16);
            
        });

        top_rated_show_prev_btn.addEventListener('click',function(){
            console.log('prev clicked')
            // console.log(topRatedMoviesCounter);
            if(topRatedTvShowCounter==4){
                topRatedTvShowCounter=upcoming_len-4;
            }
            else{
                topRatedTvShowCounter=topRatedTvShowCounter-8;
            }
            topRatedTvShowCounter=topRatedTvShowCounter%upcoming_len;
            // console.log(topRatedMoviesCounter);
            upcomingNamesCounter=topRatedTvShowCounter;
            renderingtopRatedTvShow(topRatedTvShow_Data);
            renderingNamesandYears2(topRatedTvShow_Data,upcomingNamesCounter,12,16);
        })
    }
}
fetchingTopRatedTvShowData();

// --------------ending of on air shows----------------

// ----------------starting of popular Tv shows-----------
function renderingpopularTvShow(popularTvShow_Data){
    popular_tv_show_newDiv.innerHTML=`  
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${popularTvShow_Data.results[popularTvShowCounter++].poster_path}" alt="" id=${popularTvShow_Data.results[popularTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${popularTvShow_Data.results[popularTvShowCounter++].poster_path}" alt="" id=${popularTvShow_Data.results[popularTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${popularTvShow_Data.results[popularTvShowCounter++].poster_path}" alt="" id=${popularTvShow_Data.results[popularTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            <div class="popular-movies">
                <img src="https://image.tmdb.org/t/p/w780/${popularTvShow_Data.results[popularTvShowCounter++].poster_path}" alt="" id=${popularTvShow_Data.results[popularTvShowCounter-1].id}>
                <div class="favorite-btn hide-element">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="movies-names-info">
                    <p class="movies-names">Dream Girl 2</p>
                    <p class="movies-year">11 Sep 2023</p>
                </div>
            </div>
            `
            showFavoriteBttn(popularMoviesList);
            hideFavoriteBttn(popularMoviesList);
            indexPageTvShows(popular_tv_show_newDiv)
            toggleFavoriteBttn(popular_tv_show_newDiv);
            renderingHeartinRed_Series(popular_tv_show_newDiv)
            // console.log(popular_tv_show_newDiv.innerHTML);
}

let popular_tv_show_newDiv=document.querySelector('.popular-tv-show-newDiv');
let popular_tv_show_prev_btn=document.querySelector('.popular-tv-show-prev-btn');
let popular_tv_show_next_btn=document.querySelector('.popular-tv-show-next-btn');
let popularTvShowCounter=0;
let popularTvShowNamesCounter=0;
async function fetchingpopularTvShowData(){
    if(window.location.pathname=='/index.html'){
        let popularTvShowData=await fetch('https://api.themoviedb.org/3/tv/popular?api_key=9b0ead2052060d4e517306d3630ee020');
        let popularTvShow_Data=await popularTvShowData.json();
        // console.log(popularTvShow_Data);
        // console.log('inside popular movies')
        popularTvShowNamesCounter=popularTvShowCounter;
        renderingpopularTvShow(popularTvShow_Data);
        renderingNamesandYears2(popularTvShow_Data,popularTvShowNamesCounter,16,20);
        let upcoming_len=popularTvShow_Data.results.length;
        popular_tv_show_next_btn.addEventListener('click',function(){   
            console.log('Top Rated next btn')
            popularTvShowCounter=popularTvShowCounter%upcoming_len;
            // console.log(topRatedMoviesCounter);
            popularTvShowNamesCounter=popularTvShowCounter;
            renderingpopularTvShow(popularTvShow_Data);
            renderingNamesandYears2(popularTvShow_Data,popularTvShowNamesCounter,16,20);
            
        });

        popular_tv_show_prev_btn.addEventListener('click',function(){
            console.log('prev clicked')
            // console.log(topRatedMoviesCounter);
            if(popularTvShowCounter==4){
                popularTvShowCounter=upcoming_len-4;
            }
            else{
                popularTvShowCounter=popularTvShowCounter-8;
            }
            popularTvShowCounter=popularTvShowCounter%upcoming_len;
            // console.log(topRatedMoviesCounter);
            popularNamesCounter=popularTvShowCounter;
            renderingpopularTvShow(popularTvShow_Data);
            renderingNamesandYears2(popularTvShow_Data,popularNamesCounter,16,20);
        })
    }
}
fetchingpopularTvShowData();

// ----------------ending of popular Tv shows-----------


// ---------starting of rendering movies and tv shows details in moviePage.html---
let movies_main_box=document.querySelectorAll('#movies-main-box img');

function indexPageMovies(elements){
    elements.addEventListener('click',async function(event){
        id=event.target.id;
        let data=await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=9b0ead2052060d4e517306d3630ee020`);
        let _data=await data.json();
        let imdb_id=_data.imdb_id;
        let omdbData=await fetch(`https://www.omdbapi.com/?i=${imdb_id}&apikey=5216b3fb`);
        let omdb_Data=await omdbData.json();
        localStorage.setItem("ans",JSON.stringify(omdb_Data));
        window.location.assign("http://127.0.0.1:5500/moviePage.html");
    });
}


// ---------ending of rendering movies and tv shows details in moviePage.html---


// -----------starting of rendering tv shows details on moviePage.html-----
function rendering2(_result){
    let searched_movies_poster_url;
            if(_result.Poster!=="N/A"){
                searched_movies_poster_url=`https://image.tmdb.org/t/p/w1280/${_result.backdrop_path}`;
            }
            else{
                searched_movies_poster_url='./Photos/timthumb.png';
            }
            searched_movies_poster[0].innerHTML=`<img class="poster-div-img" src="${searched_movies_poster_url}" alt="">`

            movies_details_box[0].innerHTML=
            ` 
                    <div class="movie-info">
                        <p>Series Name:&emsp;<span>${_result.name}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>First Air Date:&emsp;<span>${_result.first_air_date}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Episode Run Time:&emsp;<span>${_result.episode_run_time}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Genre:&emsp;<span>${_result.genres[0].name}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Number Of Seasons:&emsp;<span>${_result.number_of_seasons}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Number Of Episodes:&emsp;<span>${_result.number_of_episodes}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Last Episode To Air:&emsp;<span>${_result.last_episode_to_air.air_date}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Plot:&emsp;<span>${_result.overview}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Language:&emsp;<span>${_result.original_language}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Country:&emsp;<span>${_result.origin_country[0]}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Rating:&emsp;<span>${_result.vote_average}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>Vote Count:&emsp;<span>${_result.vote_count}</span></p>
                    </div>
                    <div class="movie-info">
                        <p>
                            <i class="fa-solid fa-trophy"></i>
                            Popularity:&emsp;<span>${_result.popularity}</span> 
                        </p>
                    </div>
            `
            localStorage.removeItem("ans2");
            // console.log('this function is called');
}
        //saving data before moving to moviePage.html
function indexPageTvShows(elements){
    elements.addEventListener('click',async function(event){
        let id=event.target.id;
        let data=await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=9b0ead2052060d4e517306d3630ee020`);
        let _data=await data.json();
        console.log(_data);
        localStorage.setItem("ans2",JSON.stringify(_data));
        window.location.assign("http://127.0.0.1:5500/moviePage.html");
    })
}
function nextPagemoved2(){
    // console.log('this function is run')
    try{
        // console.log(localStorage.getItem("ans2"));
        // console.log(localStorage.getItem("ans2").length);

        if(localStorage.getItem("ans2").length>0){
        // console.log(typeof(localStorage.getItem("ans2")));
            let value=localStorage.getItem("ans2");
            let _result=JSON.parse(value);
            // console.log(_result)
            rendering2(_result);
            // console.log('this function is run')
        }
    }
    catch(e){
        console.log(e);
    }
}
nextPagemoved2();

// -----------ending of rendering tv shows details on moviePage.html-----

// ----------------------------starting of favorite movie&Tv Shows button function-----------------------
// let fav_movie_array=[];
// let fav_tvshow_array=[];
let fav_movie_array_local=[];
let fav_tvshow_array_local=[];

function searchidLocalMemory(id,array,len){
    let new_Array=[];
    let ispresent=false;
    console.log(array);
    for(var i=0;i<array.length;i++){
        if(array[i]==id){
            ispresent=true;
        }
        else{
            new_Array.push(array[i]);
        }
    }
    if(len>2){
        fav_tvshow_array_local=new_Array;
    }
    else{
        fav_movie_array_local=new_Array;
    }
    console.log(fav_movie_array_local);

    return ispresent;
}

function toggleFavoriteBttn(element){
    // console.log(element.parentNode.classList.length);
    // console.log(element.children[0].children[1].children[0]);
    let parentNodeClassLenght=element.parentNode.classList.length;
    for(var i=0;i<4;i++){
        let id=element.children[i].children[0].id;
        let ele=element.children[i].children[1].children[0];
        toggleFavoriteBttn_mainFunction(ele,id,parentNodeClassLenght);
    }
}
function toggleFavoriteBttn_mainFunction(ele,id,parentNodeClassLenght){
    ele.addEventListener('click',function(event){
        // event.stopPropagatoin();
        event.stopPropagation();
        let isPresentinLocalMemory=false;
        if(localStorage.getItem("favMovies") && parentNodeClassLenght<=2){
            fav_movie_array_local=JSON.parse(localStorage.getItem("favMovies"));
            isPresentinLocalMemory=searchidLocalMemory(id,fav_movie_array_local,parentNodeClassLenght);
            // console.log(parentNodeClassLenght);
            console.log(fav_movie_array_local);
            if(isPresentinLocalMemory && fav_movie_array_local.length==0){
                localStorage.setItem("favMovies",JSON.stringify(fav_movie_array_local));
            }
        }
        if(localStorage.getItem("favSeries") && parentNodeClassLenght>2){
            fav_tvshow_array_local=JSON.parse(localStorage.getItem("favSeries"));
            isPresentinLocalMemory=searchidLocalMemory(id,fav_tvshow_array_local,parentNodeClassLenght);
            if(isPresentinLocalMemory && fav_tvshow_array_local.length==0){
                localStorage.setItem("favSeries",JSON.stringify(fav_tvshow_array_local));
            }
        }
        if(!isPresentinLocalMemory){
            // console.log(parentNodeClassLenght)
            // ele.classList.toggle('favorite-btn-toggle');
            if(parentNodeClassLenght>2 && !isPresentinLocalMemory){
                fav_tvshow_array_local.push(id);
                // console.log('this is tv array')
            }
            else{
                fav_movie_array_local.push(id);
                // console.log('this is movie array')
                // console.log(fav_movie_array_local);

            }
        }
        ele.classList.toggle('favorite-btn-toggle');
        
        // fav_movie_array_local=JSON.parse(localStorage.getItem("favMovies"));
        // fav_tvshow_array_local=JSON.parse(localStorage.getItem("favSeries"));
        if(fav_movie_array_local.length>0){
            localStorage.setItem("favMovies",JSON.stringify(fav_movie_array_local));
        }
        if(fav_tvshow_array_local.length>0){
            localStorage.setItem("favSeries",JSON.stringify(fav_tvshow_array_local));
        }
    });
}

// ----------------------------ending of favorite movie&Tv Shows button function-----------------------

// ----------starting of rendering favorite movies&tvshow on favorite.html-------------
let fav_movies_box=document.querySelector('.fav-movies-box');
let fav_tvShows_box=document.querySelector('.fav-tvShows-box');
let fav_movie_array;
let fav_tvshow_array;
let fav_IMDB_list;
async function renderingFavoriteMovies(){
    let divElement="";
    for(var i=0;i<fav_movie_array.length;i++){
        let data=await fetch(`https://api.themoviedb.org/3/movie/${fav_movie_array[i]}?api_key=9b0ead2052060d4e517306d3630ee020`);
        let _data=await data.json();
        // console.log(_data)
        divElement+=`<div class="fav-movies">
                        <img src="https://image.tmdb.org/t/p/w780/${_data.poster_path}" alt="">
                        <div>
                            <i class="fa-solid fa-trash" id=${fav_movie_array[i]}></i>
                            <p>${_data.title}</p>
                        </div>
                    </div>`
        
    }
    if(fav_IMDB_list.length>0){
        for(var i=0;i<fav_IMDB_list.length;i++){
            let result_url=`https://www.omdbapi.com/?i=${fav_IMDB_list[i]}&apikey=5216b3fb`;
            let result=await fetch(result_url);
            let _result=await result.json();
            divElement+=`<div class="fav-movies">
                        <img src="${_result.Poster}" alt="">
                        <div>
                            <i class="fa-solid fa-trash" id=${fav_IMDB_list[i]}></i>
                            <p>${_result.Title}</p>
                        </div>
                    </div>`
        }
    }
    // console.log(divElement)
    fav_movies_box.innerHTML=divElement;
    favMovie_Delete(fav_movies_box);
}
function favMovie_Delete(element){
    // console.log(element);
    let len=element.children.length;
    for(var i=0;i<len;i++){
        let id=element.children[i].children[1].children[0].id;
        // console.log(id);
        let ele=element.children[i].children[1].children[0];
        // console.log(ele);
        ele.addEventListener('click',function(event){
            event.stopPropagation();
            let temp_array=[];
            let fav_array=JSON.parse(localStorage.getItem('favMovies'));
            let ispresent=false;
            for(var j=0;j<fav_array.length;j++){
                if(fav_array[j]==id){
                    ispresent=true;
                }
                else{
                    temp_array.push(fav_array[j]);
                }
            }
            localStorage.setItem('favMovies',JSON.stringify(temp_array));
            if(!ispresent){
                let temp_array=[];
                let fav_array=JSON.parse(localStorage.getItem('IMDBList'));
                for(var j=0;j<fav_array.length;j++){
                    if(fav_array[j]==id){
                        ispresent=true;
                    }
                    else{
                        temp_array.push(fav_array[j]);
                    }
                }
                localStorage.setItem('IMDBList',JSON.stringify(temp_array));
            }
            favPageRendering();
        })
    }
}
async function renderingFavoriteTvShows(){
    let divElement="";
    for(var i=0;i<fav_tvshow_array.length;i++){
        let data=await fetch(`https://api.themoviedb.org/3/tv/${fav_tvshow_array[i]}?api_key=9b0ead2052060d4e517306d3630ee020`);
        let _data=await data.json();
        // console.log(_data)
        divElement+=`<div class="fav-movies">
                        <img src="https://image.tmdb.org/t/p/w780/${_data.poster_path}" alt="">
                        <div>
                            <i class="fa-solid fa-trash" id=${fav_tvshow_array[i]}></i>
                            <p>${_data.name}</p>
                        </div>
                    </div>`
        
    }
    // console.log(divElement)
    fav_tvShows_box.innerHTML=divElement;
    favSeries_Delete(fav_tvShows_box);
}

function favSeries_Delete(element){
    let len=element.children.length;
    for(var i=0;i<len;i++){
        let id=element.children[i].children[1].children[0].id;
        // console.log(id);
        let ele=element.children[i].children[1].children[0];
        // console.log(ele);
        ele.addEventListener('click',function(event){
            event.stopPropagation();
            let temp_array=[];
            let fav_array=JSON.parse(localStorage.getItem('favSeries'));
            let ispresent=false;
            for(var j=0;j<fav_array.length;j++){
                if(fav_array[j]==id){
                    ispresent=true;
                }
                else{
                    temp_array.push(fav_array[j]);
                }
            }
            localStorage.setItem('favSeries',JSON.stringify(temp_array));
            favPageRendering();
        })  
    }      
}

function favPageRendering(){
    if(window.location.pathname=='/favorite.html'){
        if(localStorage.getItem("favMovies").length>0){
            let value=localStorage.getItem("favMovies");
            let _result=JSON.parse(value);
            fav_movie_array=_result;
            // console.log(fav_movie_array);
            if(localStorage.getItem('IMDBList')){
                fav_IMDB_list=JSON.parse(localStorage.getItem('IMDBList'))
            }
            renderingFavoriteMovies();
        }
        if(localStorage.getItem("favSeries").length>0){
            let value=localStorage.getItem("favSeries");
            let _result=JSON.parse(value);
            fav_tvshow_array=_result;
            // console.log(fav_movie_array);
            renderingFavoriteTvShows();
        }
    }
}
favPageRendering();

// ----------ending of rendering favorite movies&tvshow on favorite.html-------------


// -----marking in red for all selected as favorite movies & shows------
function renderingHeartinRed_Movies(element){
    for(var i=0;i<4;i++){
        let id=element.children[i].children[0].id;
        let ele=element.children[i].children[1].children[0];
        if(localStorage.getItem("favMovies").length>0){
            let value=localStorage.getItem("favMovies");
            let _result=JSON.parse(value);
            for(var j=0;j<_result.length;j++){
                if(_result[j]==id){
                    ele.classList.add('favorite-btn-toggle');
                }
            }
        }
    }    
}
function renderingHeartinRed_Movies2(element){
    let ele=element.children[0];
    // console.log(ele);
    let id=element.children[0].id;
    if(localStorage.getItem("favMovies").length>0){
        // console.log('inside if of 2')
        let value=localStorage.getItem("favMovies");
        let _result=JSON.parse(value);
        // console.log(_result);
        for(var j=0;j<_result.length;j++){
            if(_result[j]==id){
                // console.log('found the id');
                ele.classList.add('favorite-btn-toggle');
            }
        }
    }
}
function renderingHeartinRed_Series2(element){
    let ele=element.children[0];
    // console.log(ele);
    let id=element.children[0].id;
    if(localStorage.getItem("favSeries").length>0){
        // console.log('inside if of 2')
        let value=localStorage.getItem("favSeries");
        let _result=JSON.parse(value);
        // console.log(_result);
        for(var j=0;j<_result.length;j++){
            if(_result[j]==id){
                // console.log('found the id');
                ele.classList.add('favorite-btn-toggle');
            }
        }
    }
}
function renderingHeartinRed_Series(element){
    for(var i=0;i<4;i++){
        let id=element.children[i].children[0].id;
        let ele=element.children[i].children[1].children[0];
        if(localStorage.getItem("favSeries").length>0){
            let value=localStorage.getItem("favSeries");
            let _result=JSON.parse(value);
            for(var j=0;j<_result.length;j++){
                if(_result[j]==id){
                    ele.classList.add('favorite-btn-toggle');
                }
            }
        }
    }    
}

function toggleFavoriteBttn2(element){
    // console.log(element);
    let id=element.children[0].id;
    // console.log(id);
    let ele=element.children[0];
    // console.log(ele);
    // let leng=element.parentNode.classList;
    toggleFavoriteBttn_mainFunction(ele,id,1);
}
function toggleFavoriteBttn3(element){
    let id=element.children[0].id;
    // console.log(id);
    let ele=element.children[0];
    // console.log(ele);
    // let leng=element.parentNode.classList;
    toggleFavoriteBttn_mainFunction(ele,id,3);
}

// -----ending of marking in red for all selected as favorite movies & shows------
