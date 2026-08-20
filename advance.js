let folder_list = document.getElementsByClassName("folder_list")[0];
let folder_songs_list = document.getElementsByClassName("folder_songs_list")[0];
let play_baar = document.getElementsByClassName("play_baar")[0];
let folders = document.getElementsByClassName("folders");
let song_count = document.getElementsByClassName("song_count")[0];
let folder_update = document.getElementsByClassName("folder_update")[0];
let songs_player = document.getElementsByClassName("songs");
let close_btn = document.getElementsByClassName("close_btn")[0];
let left = document.getElementsByClassName("left")[0];
let menu_btn = document.getElementsByClassName("menu_btn")[0];
let right = document.getElementsByClassName("right")[0];
let home_btn = document.getElementsByClassName("home_btn")[0];
let play_or_pause = document.getElementsByClassName("play_or_pause");
let play_now_text = document.getElementsByClassName("play_left_text");
let vol_img = document.getElementsByClassName("vol_img")[0];
let center_play_img = document.getElementsByClassName("center_play_img")[0];
let song_play_img = document.getElementsByClassName("song_play_img");
let sub_folder = document.getElementsByClassName("folder_list")[0];
let time = document.getElementsByClassName("time_details")[0];
let volume_baar = document.getElementsByClassName("volume_baar")[0];
let song_baar = document.getElementsByClassName("song_baar")[0];
let part_1 = document.getElementsByClassName("part_1")[0];
let play_next = document.getElementsByClassName("play_next")[0];
let play_last = document.getElementsByClassName("play_last")[0];

let folder_image = "Kishore_Kumar.jpg";
let unmute_img = "unmute_img.png";
let mute_img = "mute_img.png";
let folder_sub_title = "Playlist";
let current_song_name = "nivesh.mp3";
let pause_btn_img = "pause_btn.png";
let current_song_live_time = "00:00";
let current_song_total_time = "00:00";
let current_volume = 100;
let play_btn_img = "play_btn_1.png";
let current_song = -1;
let current_folder = -1;
let playlists_name = [];
let playlists_address = [];
let songs_address = [];
let song_name = [];
let current_time = 0;
let csong_duratin = 0;
let play = 0;
let ttime = 0;
let tmin = 0;
let tsec = 0;
let ctime = 0;
let cmin = 0;
let csec = 0;
let isMute = 0;

async function upadating_song_count(number) {
    let folder_lenght = song_name.length;
    song_count.innerHTML = (current_song + 1) + "/" + folder_lenght;
    if (playlists_name[number]) {
        folder_update.innerHTML = playlists_name[number];
    }
}

(async function () {
    let repoApiUrl = "https://api.github.io/repos/nivesh091/meregaane/contents/songs";
    
    try {
        let res = await fetch(repoApiUrl);
        let files = await res.json();

        folder_list.innerHTML = ""; 

        for (let item of files) {
            if (item.type === "dir") { 
                playlists_name.push(item.name);
                playlists_address.push(item.path);

                folder_list.innerHTML += `
                    <div class="folders pointer">
                        <div class="playlist_image_frame"></div>
                        <div class="card_text">
                            <div class="card_text_1"><b>${item.name}</b></div>
                            <div class="card_text_2">Nivesh</div>
                        </div>
                    </div>`;
            }
        }
        loading_song();
    } catch (error) {
        console.error("Error fetching folders from GitHub API:", error);
    }
})();

function pauseAllSong() {
    play = 0;
    for (let s = 0; s < song_name.length; s++) {
        if(songs_player[s]) songs_player[s].style.border = "1px solid rgb(49 49 42)";
        if(play_or_pause[s]) play_or_pause[s].src = "play_btn_1.png";
        if(play_now_text[s]) play_now_text[s].innerHTML = "Play Now";
        if(songs_address[s]) {
            songs_address[s].pause();
            if (s != current_song) { songs_address[s].currentTime = 0; }
        }
    }
}

async function getting_songs(number) {
    current_folder = number; // Shuru me hi folder index update karein
    song_baar.value = 0;
    pauseAllSong();
    
    song_name.length = 0;
    songs_address.length = 0;
    current_song = -1;
    folder_songs_list.innerHTML = "";

    let folderPath = playlists_address[number];
    let res = await fetch(`https://api.github.io/repos/nivesh091/meregaane/contents/${folderPath}`);
    let files = await res.json();

    for (let item of files) {
        if (item.name.endsWith(".mp3")) {
            let href = item.download_url;
            let new_audios = new Audio(href);
            songs_address.push(new_audios);

            let nm = item.name.replace(".mp3", "").replaceAll("_", " ");
            nm = nm + "...";
            song_name.push(nm);

            folder_songs_list.innerHTML +=
                `<div class="songs pointer">
                    <div class="song_list_left">
                        <div class="song_img"><img class="mini_images_2" src="mp3_song.png" alt=""></div>
                        <div class="center_left ">
                            <div class="song_name">
                                <p>${nm}</p>
                            </div>
                            <div class="name">Nivesh</div>
                        </div>
                    </div>
                    <div class="play_left">
                        <div class="play_left_text">
                            Play Now
                        </div>
                        <img class="mini_images_3 song_play_img play_or_pause invert" src="play_btn_1.png" alt="">
                    </div>
                </div>`;
        }
    }
    check_song();
}

function loading_song() {
    let folderElements = document.getElementsByClassName("folders");
    for (let i = 0; i < playlists_name.length; i++) {
        if (folderElements[i]) {
            folderElements[i].addEventListener("click", () => {
                if (i != current_folder) { getting_songs(i); }
                if (window.innerWidth > 800) {
                    left.style.display = "block";
                    left.style.width = "350px";
                    right.style.width = "calc(100vw - 350px)";
                    menu_btn.style.display = "none";
                } else {
                    right.style.display = "none";
                    left.style.display = "block";
                    left.style.width = "100vw";
                    menu_btn.style.display = "none";
                }
            });
        }
    }
}

function updateSongBaar(sNumber) {
    part_1.innerHTML = song_name[sNumber];
    songs_address[current_song].addEventListener("timeupdate", () => {
        ctime = Math.floor(songs_address[current_song].currentTime);
        current_time = ctime;
        cmin = Math.floor(ctime / 60);
        csec = ctime - cmin * 60;
        if (cmin < 10) { cmin = "0" + cmin }
        if (csec < 10) { csec = "0" + csec }
        ttime = Math.floor(songs_address[current_song].duration || 0);
        tmin = Math.floor(ttime / 60);
        tsec = ttime - tmin * 60;
        if (tmin < 10) { tmin = "0" + tmin }
        if (tsec < 10) { tsec = "0" + tsec }
        time.innerHTML = cmin + ":" + csec + "/" + tmin + ":" + tsec;
    });
}

function playNextSong() {
    song_baar.value = 0;
    if (current_song == song_name.length - 1) { playSong(0); }
    else { playSong(current_song + 1) }
}

function playLastSong() {
    if (current_song == -1 || current_song == 0) { playSong(0) }
    song_baar.value = 0;
    if (current_song == 0) { playSong(song_name.length - 1); }
    else { playSong(current_song - 1) }
}

function uptadeseekbaar(sNumber) {
    csong_duratin = songs_address[sNumber].duration;
    songs_address[current_song].addEventListener("timeupdate", () => {
        song_baar.value = (current_time * 100) / csong_duratin;
        if (song_baar.value == 100) {
            playNextSong();
        }
    });
}

async function play_this_song(songNumber) {
    if(songs_player[songNumber]) songs_player[songNumber].style.border = "1px solid white";
    if(play_or_pause[songNumber]) play_or_pause[songNumber].src = "pause_btn.png";
    if(play_now_text[songNumber]) play_now_text[songNumber].innerHTML = "Playing...";
    
    songs_address[songNumber].play();
    play = 1;
    current_song = songNumber;
    await upadating_song_count(current_folder);
    
    if (window.innerWidth <= 800) {
        right.style.display = "block";
        left.style.display = "none";
        right.style.width = "100vw";
        menu_btn.style.display = "block";
    }
}

async function playSong(songNumber) {
    pauseAllSong();
    await play_this_song(songNumber);
    updateSongBaar(songNumber);
    uptadeseekbaar(songNumber);
}

function check_song() {
    for (let i = 0; i < song_name.length; i++) {
        if (songs_player[i]) {
            songs_player[i].addEventListener("click", () => {
                if (current_song != i) { playSong(i); }
            });
        }
    }
}

vol_img.addEventListener("click", () => {
    if (isMute == 1) {
        vol_img.src = unmute_img;
        if(songs_address[current_song]) songs_address[current_song].volume = 1;
        isMute = 0;
    } else {
        vol_img.src = mute_img;
        if(songs_address[current_song]) songs_address[current_song].volume = 0;
        isMute = 1;
    }
});

center_play_img.addEventListener("click", () => {
    if (current_song === -1) return;
    if (play == 1) {
        songs_address[current_song].pause();
        center_play_img.src = play_btn_img;
        if(song_play_img[current_song]) song_play_img[current_song].src = play_btn_img;
        play = 0;
    } else {
        songs_address[current_song].play();
        center_play_img.src = pause_btn_img;
        if(song_play_img[current_song]) song_play_img[current_song].src = pause_btn_img;
        play = 1;
    }
});

volume_baar.addEventListener("input", () => {
    if(songs_address[current_song]) {
        songs_address[current_song].volume = volume_baar.value / 100;
    }
    current_volume = volume_baar.value / 100;
});

song_baar.addEventListener("input", () => {
    if(songs_address[current_song]) {
        current_time = song_baar.value;
        songs_address[current_song].currentTime = (current_time * csong_duratin) / 100;
    }
});

play_next.addEventListener("click", () => { playNextSong(); });
play_last.addEventListener("click", () => { playLastSong(); });

close_btn.addEventListener("click", () => {
    left.style.display = "none";
    right.style.width = "100vw";
    menu_btn.style.display = "block";
    if (window.innerWidth <= 800) {
        right.style.display = "block";
        left.style.display = "none";
        right.style.width = "100vw";
        menu_btn.style.display = "block";
    }
});

home_btn.addEventListener("click", () => {
    left.style.display = "none";
    right.style.width = "100vw";
    menu_btn.style.display = "block";
    if (window.innerWidth <= 800) {
        right.style.display = "block";
        left.style.display = "none";
        right.style.width = "100vw";
        menu_btn.style.display = "block";
    }
});

menu_btn.addEventListener("click", () => {
    if (window.innerWidth > 800) {
        left.style.display = "block";
        left.style.width = "350px";
        right.style.width = "calc(100vw - 350px)";
        menu_btn.style.display = "none";
    } else {
        left.style.width = "100vw";
        right.style.display = "none";
        left.style.display = "block";
        close_btn.style.display = "block";
    }
});