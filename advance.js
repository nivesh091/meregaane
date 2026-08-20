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

let unmute_img = "unmute_img.png";
let mute_img = "mute_img.png";
let pause_btn_img = "pause_btn.png";
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
let isMute = 0;

async function upadating_song_count(number) {
    let folder_lenght = song_name.length;
    if (song_count) song_count.innerHTML = (current_song + 1) + "/" + folder_lenght;
    if (folder_update && playlists_name[number]) folder_update.innerHTML = playlists_name[number];
}

// GitHub Repos API se playlists fetch karna
(async function () {
    try {
        let repoApiUrl = "https://api.github.io/repos/nivesh091/meregaane/contents/songs";
        let res = await fetch(repoApiUrl);
        if (!res.ok) throw new Error("API call failed");
        let files = await res.json();

        folder_list.innerHTML = "";
        for (let item of files) {
            if (item.type === "dir") {
                playlists_name.push(item.name);
                playlists_address.push(item.path);
                folder_list.innerHTML +=
                    `<div class="folders pointer">
                        <div class="playlist_image_frame"></div>
                        <div class="card_text">
                            <div class="card_text_1"><b>${item.name.replaceAll("_", " ")}</b></div>
                            <div class="card_text_2">Nivesh</div>
                        </div>
                    </div>`;
            }
        }
        await loading_song();
    } catch (err) {
        console.error("404 Prevented - API Limit or Path error:", err);
    }
})();

async function pauseAllSong() {
    play = 0;
    for (let s = 0; s < songs_address.length; s++) {
        if (songs_player[s]) songs_player[s].style.border = "1px solid rgb(49 49 42)";
        if (play_or_pause[s]) play_or_pause[s].src = play_btn_img;
        if (play_now_text[s]) play_now_text[s].innerHTML = "Play Now";
        if (songs_address[s]) {
            songs_address[s].pause();
            if (s != current_song) { songs_address[s].currentTime = 0; }
        }
    }
}

async function getting_songs(number) {
    song_baar.value = 0;
    await pauseAllSong();
    song_name.length = 0;
    songs_address.length = 0;
    current_song = -1;
    folder_songs_list.innerHTML = "";

    // Safely encode folder path to prevent 404
    let folderPath = playlists_address[number].split('/').map(p => encodeURIComponent(p)).join('/');
    let res = await fetch(`https://api.github.io/repos/nivesh091/meregaane/contents/${folderPath}`);
    let files = await res.json();

    for (let item of files) {
        if (item.name.toLowerCase().endsWith(".mp3")) {
            // Encode audio download URL
            let href = item.download_url ? item.download_url : `https://raw.githubusercontent.com/nivesh091/meregaane/main/${folderPath}/${encodeURIComponent(item.name)}`;
            let new_audios = new Audio(href);
            songs_address.push(new_audios);

            let nm = item.name.replace(/\.mp3$/i, "");
            nm = nm.replaceAll("_", " ").replaceAll("(MP3 160K)", "").trim();
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
        if (folders[i]) {
            folders[i].addEventListener("click", () => {
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

async function updateSongBaar(sNumber) {
    if (part_1) part_1.innerHTML = song_name[sNumber];
    if (songs_address[current_song]) {
        songs_address[current_song].ontimeupdate = () => {
            let ctime = Math.floor(songs_address[current_song].currentTime || 0);
            let cmin = Math.floor(ctime / 60);
            let csec = ctime % 60;
            if (cmin < 10) cmin = "0" + cmin;
            if (csec < 10) csec = "0" + csec;

            let ttime = Math.floor(songs_address[current_song].duration || 0);
            let tmin = Math.floor(ttime / 60);
            let tsec = ttime % 60;
            if (tmin < 10) tmin = "0" + tmin;
            if (tsec < 10) tsec = "0" + tsec;

            if (time) time.innerHTML = `${cmin}:${csec} / ${tmin}:${tsec}`;
        };
    }
}

function playNextSong() {
    song_baar.value = 0;
    if (current_song >= song_name.length - 1) { playSong(0); }
    else { playSong(current_song + 1); }
}

function playLastSong() {
    song_baar.value = 0;
    if (current_song <= 0) { playSong(song_name.length - 1); }
    else { playSong(current_song - 1); }
}

async function uptadeseekbaar(sNumber) {
    if (songs_address[sNumber]) {
        songs_address[sNumber].onended = () => {
            playNextSong();
        };
        songs_address[sNumber].addEventListener("timeupdate", () => {
            csong_duratin = songs_address[sNumber].duration;
            if (csong_duratin) {
                song_baar.value = (songs_address[sNumber].currentTime * 100) / csong_duratin;
            }
        });
    }
}

async function play_this_song(songNumber) {
    if (songs_player[songNumber]) songs_player[songNumber].style.border = "1px solid white";
    if (play_or_pause[songNumber]) play_or_pause[songNumber].src = pause_btn_img;
    if (play_now_text[songNumber]) play_now_text[songNumber].innerHTML = "Playing...";
    
    current_song = songNumber;
    songs_address[songNumber].play().catch(e => console.log("Audio Play Blocked:", e));
    play = 1;

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
        if (songs_player[i]) {
            songs_player[i].onclick = () => {
                if (current_song != i) { playSong(i); }
            };
        }
        if (song_play_img[i]) {
            song_play_img[i].onclick = (e) => {
                e.stopPropagation();
                if (play == 1 && current_song == i) {
                    songs_address[current_song].pause();
                    play_now_text[i].innerHTML = "Play Now";
                    song_play_img[i].src = play_btn_img;
                    center_play_img.src = play_btn_img;
                    play = 0;
                } else {
                    playSong(i);
                    center_play_img.src = pause_btn_img;
                }
            };
        }
    }
}

vol_img.addEventListener("click", () => {
    if (current_song === -1) return;
    if (isMute == 1) {
        vol_img.src = unmute_img;
        songs_address[current_song].volume = 1;
        isMute = 0;
    } else {
        vol_img.src = mute_img;
        songs_address[current_song].volume = 0;
        isMute = 1;
    }
});

center_play_img.addEventListener("click", () => {
    if (current_song === -1) return;
    if (play == 1) {
        songs_address[current_song].pause();
        center_play_img.src = play_btn_img;
        if (song_play_img[current_song]) song_play_img[current_song].src = play_btn_img;
        play = 0;
    } else {
        songs_address[current_song].play().catch(e => console.log(e));
        center_play_img.src = pause_btn_img;
        if (song_play_img[current_song]) song_play_img[current_song].src = pause_btn_img;
        play = 1;
    }
});

volume_baar.addEventListener("input", () => {
    if (current_song !== -1 && songs_address[current_song]) {
        songs_address[current_song].volume = volume_baar.value / 100;
    }
});

song_baar.addEventListener("input", () => {
    if (current_song !== -1 && csong_duratin && songs_address[current_song]) {
        songs_address[current_song].currentTime = (song_baar.value * csong_duratin) / 100;
    }
});

play_next.addEventListener("click", () => playNextSong());
play_last.addEventListener("click", () => playLastSong());

close_btn.addEventListener("click", () => {
    left.style.display = "none";
    right.style.width = "100vw";
    menu_btn.style.display = "block";
});

home_btn.addEventListener("click", () => {
    left.style.display = "none";
    right.style.width = "100vw";
    menu_btn.style.display = "block";
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