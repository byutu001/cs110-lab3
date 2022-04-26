/*
    CS110 Lab 3
    Bea Yutuc
    Mariam Razak
*/

/* Timer */
let timer = setInterval(() => {
    fetchTweets();
}, 5000);


const existingTweets = new Map(); // checks if tweet already exists in tweetList
let tweetList = [];

/* Grabs the tweets from the http link */
async function fetchTweets() {
    try {
        /* 
            .then can be replaced by await, it will act the same
            cleaner & don't have to get it mixed up
        */
        const res = await fetch('http://ec2-18-209-247-77.compute-1.amazonaws.com:3000/feed/random?q=weather', {
            method: "GET" //making a get request to get the json data of the tweet
        });
        
        const newTweets = await res.json();
        
        newTweets.statuses.forEach(tweet => {
            if (!existingTweets.get(tweet.id_str)) {
                tweetList.push(tweet);
                existingTweets.set(tweet.id_str, true);
            }
        });

        tweetList = sortByDate(tweetList);

        let wrapperElement = document.querySelector('.wrapper');
        wrapperElement.innerHTML = '';

        console.log(tweetList);

        for (let i = 0; i < tweetList.length; i += 1) {
            /* querySelecter gets the first element inside the HTML that matches the selector */
        
            let tweetElement = document.createElement("div");
            tweetElement.innerHTML = `
                <img class="centerIcon" src="images/ratatouille.jpg">
                
                <div class="centerUsername"> 
                    <span style="color:black"><b>Remy </b></span>
                    <span style="color:gray">@remy ${moment(tweetList[i].created_at).format("MMM DD YYYY HH:MM")}</span>
                    <div>${tweetList[i].text}</div>
                </div>
            `;
            tweetElement.classList.add("tweet");
            
            /* Adds Tweet element to the wrapper */
            wrapperElement.appendChild(tweetElement);
        }
    } catch (err) {
        console.error(err);
    }
}

fetchTweets();

//stops the setInterval that's calling fetchTweets: clearInterval(timer);
function stopTimer() {
    clearInterval(timer);
}

document.getElementById('searchBar').addEventListener('keypress', (event) => {
    console.log(event.target.value);
});


/* Bubble Sort for Tweets */
function sortByDate(tweets) {
    var done = false;
        while(!done) {
            done = true;
            for(var i = 1; i < tweets.length; i++) {
                var a = new Date(tweets[i-1].created_at);
                var b = new Date(tweets[i].created_at);
                if(a < b) {
                    done = false;
                    var tmp = tweets[i - 1];
                    tweets[i - 1]= tweets[i];
                    tweets[i] = tmp;
                }
            }
        }   
    return tweets;
}


/* 
    handles the checkbox
    when clicked, it stops the tweets from being check every 5 seconds
    when reclicked, it continues to check tweets every 5 seconds
*/
let tweetFetchEnabled = true;
document.getElementById('enableTweetFetching').addEventListener('click', () => {
    tweetFetchEnabled = !tweetFetchEnabled;

    if (!tweetFetchEnabled) {
        stopTimer();
    } else {
        timer = setInterval(() => {
            fetchTweets();
        }, 5000);
    }
});
