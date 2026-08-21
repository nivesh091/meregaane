let folder_list = document.getElementsByClassName("folder_list")[0];
let folder_songs_list = document.getElementsByClassName("folder_songs_list")[0];
let play_baar = document.getElementsByClassName("play_baar")[0];
let folders = document.getElementsByClassName("folders")
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
let unmute_img = "unmute_img.png"
let mute_img = "mute_img.png"
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
    // let folder_lenght = await song_name.length;
    // song_count.innerHTML = await current_song + 1 + "/" + folder_lenght;
    let folder_lenght = song_name.length;
    song_count.innerHTML = (current_song + 1) + "/" + folder_lenght;
    folder_update.innerHTML = playlists_name[number];
}

(async function () {
    let res = await fetch("https://api.github.com/repos/nivesh091/meregaane/contents/songs");
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "dir") {
            let folderName = data[i].name;
            playlists_address.push(data[i].url);
            playlists_name.push(folderName);

            let cleanName = folderName.replaceAll("_", " ");

            folder_list.innerHTML +=
                `<div class="folders pointer">
                    <div class="playlist_image_frame"></div>
                    <div class="card_text">
                        <div class="card_text_1"><b>${cleanName}</b></div>
                        <div class="card_text_2">Nivesh</div>
                    </div>
                </div>`;
        }
    }
    await loading_song();
})();

async function pauseAllSong() {
    play = 0;
    for (let s = 0; s < song_name.length; s++) {
        songs_player[s].style.border = "1px solid rgb(49 49 42)";
        play_or_pause[s].src = "play_btn_1.png";
        play_now_text[s].innerHTML = "Play Now";
        songs_address[s].pause();
        if (s != current_song) { songs_address[s].currentTime = 0; }
    }
}

async function getting_songs(number) {
    current_song = 0;
    song_baar.value = 0;
    await pauseAllSong();

    song_name.length = 0;
    songs_address.length = 0;
    current_song = -1;
    current_folder = -1;
    folder_songs_list.innerHTML = "";

    let res = await fetch(playlists_address[number]);
    let files = await res.json();

    for (let i = 0; i < files.length; i++) {
        if (files[i].name.endsWith(".mp3")) {
            let audioUrl = files[i].download_url;
            let new_audios = new Audio(audioUrl);
            songs_address.push(new_audios);

            let nm = files[i].name.replaceAll("_", " ")
                                  .replaceAll("(MP3 160K)", "")
                                  .replace(".mp3", "") + "...";
            song_name.push(nm);

            folder_songs_list.innerHTML +=
                `<div class="songs pointer">
                    <div class="song_list_left">
                        <div class="song_img"><img class="mini_images_2" src="mp3_song.png" alt=""></div>
                        <div class="center_left">
                            <div class="song_name">
                                <p>${nm}</p>
                            </div>
                            <div class="name">Nivesh</div>
                        </div>
                    </div>
                    <div class="play_left">
                        <div class="play_left_text">Play Now</div>
                        <img class="mini_images_3 song_play_img play_or_pause invert" src="play_btn_1.png" alt="">
                    </div>
                </div>`;
        }
    }
    await check_song();
    current_folder = number;
}

async function loading_song() {
    for (let i = 0; i < playlists_name.length; i++) {
        await folders[i].addEventListener(("click"), () => {
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
        })
    }
}

async function updateSongBaar(sNumber) {
    part_1.innerHTML = song_name[sNumber];
    songs_address[current_song].addEventListener("timeupdate", () => {
        ctime = Math.floor(songs_address[current_song].currentTime);
        current_time = ctime;
        cmin = Math.floor(ctime / 60);
        csec = ctime - cmin * 60;
        if (cmin < 10) { cmin = "0" + cmin }
        if (csec < 10) { csec = "0" + csec }
        ttime = Math.floor(songs_address[current_song].duration);
        tmin = Math.floor(ttime / 60);
        tsec = ttime - tmin * 60;
        if (tmin < 10) { tmin = "0" + tmin }
        if (tsec < 10) { tsec = "0" + tsec }
        time.innerHTML = cmin + ":" + csec + "/" + tmin + ":" + tsec;
    })
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


async function uptadeseekbaar(sNumber) {
    csong_duratin = songs_address[sNumber].duration
    songs_address[current_song].addEventListener(("timeupdate"), () => {
        song_baar.value = (current_time * 100) / csong_duratin;
        if (song_baar.value == 100) {
            playNextSong();
        }
    })
}

async function play_this_song(songNumber) {
    songs_player[songNumber].style.border = "1px solid white";
    play_or_pause[songNumber].src = "pause_btn.png";
    play_now_text[songNumber].innerHTML = "Playing...";
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
    await pauseAllSong();
    await play_this_song(songNumber);
    await updateSongBaar(songNumber);
    await uptadeseekbaar(songNumber);
}
async function check_song() {
    for (let i = 0; i < song_name.length; i++) {
        await songs_player[i].addEventListener(("click"), () => {
            if (current_song != i) { playSong(i); }
        })
    }
    for (let x = 0; x < song_play_img.length; x++) {
        song_play_img[x].addEventListener(("click"), () => {
            if (play == 1) {
                songs_address[current_song].pause();
                play_now_text[x].innerHTML = "Play Now";
                song_play_img[x].src = play_btn_img;
                center_play_img.src = play_btn_img;
                play = 0;
            } else {
                songs_address[current_song].play();
                play_now_text[x].innerHTML = "Playing...";
                song_play_img[x].src = pause_btn_img;
                center_play_img.src = pause_btn_img;
                play = 1;
            }
        })
    }
}

vol_img.addEventListener(("click"), () => {
    if (isMute == 1) {
        vol_img.src = unmute_img
        songs_address[current_song].volume = 1;
        isMute = 0;
    }
    else {
        vol_img.src = mute_img
        songs_address[current_song].volume = 0;
        isMute = 1;
    }
})

center_play_img.addEventListener(("click"), () => {
    if (play == 1) {
        songs_address[current_song].pause();
        center_play_img.src = play_btn_img;
        song_play_img[current_song].src = play_btn_img;
        play = 0;
    } else {
        songs_address[current_song].play();
        center_play_img.src = pause_btn_img;
        song_play_img[current_song].src = pause_btn_img;
        play = 1;
    }
})

volume_baar.addEventListener(("input"), () => {
    songs_address[current_song].volume = volume_baar.value / 100;
    current_volume = volume_baar.value / 100;
});

song_baar.addEventListener(("input"), () => {
    current_time = song_baar.value
    songs_address[current_song].currentTime = (current_time * csong_duratin) / 100;
})

play_next.addEventListener(("click"), () => {
    playNextSong();
})

play_last.addEventListener(("click"), () => {
    playLastSong();
})

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
})
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
})
menu_btn.addEventListener("click", () => {
    if (window.innerWidth > 800) {
        left.style.display = "block";
        left.style.width = "350px";
        right.style.width = "calc(100vw - 350px)";
        menu_btn.style.display = "none";
    }
    else {
        left.style.width = "100vw";
        right.style.display = "none";
        left.style.display = "block";
        close_btn.style.display = "block";
    }
})

document.body.addEventListener("click", function enterFullscreen() {
    document.documentElement.requestFullscreen();
    document.body.removeEventListener("click", enterFullscreen);
});
