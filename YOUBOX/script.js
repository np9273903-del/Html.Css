// ---------------------------
// YouBox Playlist
// ---------------------------

const input = document.getElementById("videoInput");
const addBtn = document.getElementById("addBtn");
const playlistDiv = document.getElementById("playlistItems");
const counter = document.getElementById("count");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");

let playlist = JSON.parse(localStorage.getItem("youboxPlaylist")) || [];

let currentIndex = 0;

// -------------------------------
// Load YouTube API
// -------------------------------

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

let player;

// API Ready

function onYouTubeIframeAPIReady(){

    player = new YT.Player("player",{

        width:"100%",

        height:"520",

        videoId:"",

        playerVars:{

            autoplay:1,

            rel:0

        },

        events:{

            onStateChange:onPlayerStateChange

        }

    });

}

// --------------------------------
// Auto Next Video
// --------------------------------

function onPlayerStateChange(event){

    if(event.data == YT.PlayerState.ENDED){

        nextVideo();

    }

}

// --------------------------------
// Extract Video ID
// --------------------------------

function getVideoID(url){

    if(url.includes("watch?v=")){

        return url.split("v=")[1].split("&")[0];

    }

    if(url.includes("youtu.be/")){

        return url.split("youtu.be/")[1].split("?")[0];

    }

    return null;

}

// --------------------------------
// Add Video
// --------------------------------

addBtn.onclick = ()=>{

    const id = getVideoID(input.value);

    if(id==null){

        alert("Invalid YouTube URL");

        return;

    }

    playlist.push({

        id:id

    });

    localStorage.setItem(

        "youboxPlaylist",

        JSON.stringify(playlist)

    );

    input.value="";

    renderPlaylist();

    playVideo(

        playlist.length-1

    );

};

// Enter Key

input.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        addBtn.click();

    }

});

// --------------------------------
// Play Video
// --------------------------------

function playVideo(index){

    currentIndex=index;

    player.loadVideoById(

        playlist[index].id

    );

    highlight();

}

// --------------------------------
// Previous
// --------------------------------

function previousVideo(){

    if(currentIndex>0){

        playVideo(

            currentIndex-1

        );

    }

}

// --------------------------------
// Next
// --------------------------------

function nextVideo(){

    if(currentIndex<playlist.length-1){

        playVideo(

            currentIndex+1

        );

    }

}

// --------------------------------
// Buttons
// --------------------------------

prevBtn.onclick=previousVideo;

nextBtn.onclick=nextVideo;

playBtn.onclick=()=>{

    player.playVideo();

};

// --------------------------------
// Highlight
// --------------------------------

function highlight(){

    const cards=

    document.querySelectorAll(".video-card");

    cards.forEach(card=>{

        card.style.border="none";

    });

    if(cards[currentIndex]){

        cards[currentIndex].style.border=

        "3px solid #ff2d2d";

    }

}

// --------------------------------
// Delete
// --------------------------------

function deleteVideo(index){

    playlist.splice(index,1);

    localStorage.setItem(

        "youboxPlaylist",

        JSON.stringify(playlist)

    );

    renderPlaylist();

    if(playlist.length){

        playVideo(0);

    }else{

        document.getElementById("player").innerHTML=

        `<div class="welcome">

        <h2>No Videos</h2>

        </div>`;

    }

}

// --------------------------------
// Render Playlist
// --------------------------------

function renderPlaylist(){

    playlistDiv.innerHTML="";

    counter.innerHTML=

    playlist.length+" Videos";

    playlist.forEach((video,index)=>{

        playlistDiv.innerHTML+=`

<div class="video-card">

<div class="video-left"

onclick="playVideo(${index})">

<img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg">

<div class="video-info">

<h3>

Video ${index+1}

</h3>

<p>

${video.id}

</p>

</div>

</div>

<div class="delete"

onclick="deleteVideo(${index})">

🗑

</div>

</div>

`;

    });

    highlight();

}

// --------------------------------
// Initial Load
// --------------------------------

renderPlaylist();

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

setTimeout(()=>{

    if(playlist.length){

        playVideo(0);

    }

},1200);