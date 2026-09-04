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
let play_btn_img = "play_btn_1.png";
let current_song = -1;
let current_folder = -1;

let playlists_name = [];
let playlists_address = [];
let songs_address = [];
let song_name = [];
let play = 0;
let isMute = 0;

function updatePlaybarName(name) {
    let myname = document.querySelector(".myname");
    if (myname) {
        myname.innerText = name;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;
    return `${mins}:${secs}`;
}

async function upadating_song_count(number) {
    let folder_lenght = song_name.length;
    if (song_count) song_count.innerHTML = (current_song + 1) + "/" + folder_lenght;
    if (folder_update && playlists_name[number]) folder_update.innerHTML = playlists_name[number];
}

(async function () {
    try {
        let res = await fetch("https://api.github.com/repos/nivesh091/meregaane/contents/songs");
        let data = await res.json();

        for (let i = 0; i < data.length; i++) {
            if (data[i].type === "dir") {
                let folderName = data[i].name;
                playlists_address.push(data[i].url);
                playlists_name.push(folderName);
                let newname = folderName.replaceAll("_", " ");
                folder_list.innerHTML +=
                    `<div class="folders pointer">
                        <div class="playlist_image_frame"></div>
                        <div class="card_text">
                            <div class="card_text_1"><b>${newname}</b></div>
                            <div class="card_text_2">Nivesh</div>
                        </div>
                    </div>`;
            }
        }
    } catch (error) {
        console.error(error);
    }

    await loading_song();
})();

async function pauseAllSong() {
    play = 0;
    for (let s = 0; s < songs_address.length; s++) {
        if (songs_player[s]) {
            songs_player[s].style.border = "1px solid rgb(49 49 42)";
        }
        if (play_or_pause[s]) {
            play_or_pause[s].src = play_btn_img;
        }
        if (play_now_text[s]) {
            play_now_text[s].innerHTML = "Play Now";
        }
        if (songs_address[s]) {
            songs_address[s].pause();
            if (s !== current_song) { 
                songs_address[s].currentTime = 0; 
            }
        }
    }
}

async function getting_songs(number) {
    if (song_baar) song_baar.value = 0;
    await pauseAllSong();

    song_name.length = 0;
    songs_address.length = 0;
    current_song = -1;
    folder_songs_list.innerHTML = "";

    try {
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
    } catch (error) {
        console.error(error);
    }

    await check_song();
    current_folder = number;
    if (song_name.length > 0) {
        updatePlaybarName(song_name[0]);
    }
}

async function loading_song() {
    for (let i = 0; i < playlists_name.length; i++) {
        if (folders[i]) {
            folders[i].addEventListener("click", () => {
                if (i !== current_folder) { getting_songs(i); }
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

function uptadeseekbaar(sNumber) {
    let audio = songs_address[sNumber];
    if (!audio) return;

    audio.ontimeupdate = () => {
        let currentTime = audio.currentTime;
        let duration = audio.duration;

        if (time && !isNaN(duration) && duration > 0) { 
            time.innerHTML = `${formatTime(currentTime)} / ${formatTime(duration)}`; 
        }
        if (song_baar && !isNaN(duration) && duration > 0) { 
            song_baar.value = (currentTime / duration) * 100; 
        }
        if (duration > 0 && currentTime >= duration) { 
            playNextSong(); 
        }
    };
}

function playNextSong() {
    if (song_name.length === 0) return;
    if (song_baar) song_baar.value = 0;
    if (current_song === song_name.length - 1 || current_song === -1) { 
        playSong(0); 
    } else { 
        playSong(current_song + 1); 
    }
}

function playLastSong() {
    if (song_name.length === 0) return;
    if (song_baar) song_baar.value = 0;

    if (current_song <= 0) { 
        playSong(song_name.length - 1); 
    } else { 
        playSong(current_song - 1); 
    }
}

async function play_this_song(songNumber) {
    if (!songs_address[songNumber]) return;
    if (songs_player[songNumber]) songs_player[songNumber].style.border = "1px solid white";
    if (play_or_pause[songNumber]) play_or_pause[songNumber].src = pause_btn_img;
    if (play_now_text[songNumber]) play_now_text[songNumber].innerHTML = "Playing...";
    updatePlaybarName(song_name[songNumber]);
    if (center_play_img) center_play_img.src = pause_btn_img;
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
    uptadeseekbaar(songNumber);
}

async function check_song() {
    for (let i = 0; i < song_name.length; i++) {
        if (songs_player[i]) {
            songs_player[i].addEventListener("click", () => {
                if (current_song !== i) { 
                    playSong(i); 
                } else {
                    if (play === 1) {
                        songs_address[current_song].pause();
                        if (play_now_text[i]) play_now_text[i].innerHTML = "Play Now";
                        if (song_play_img[i]) song_play_img[i].src = play_btn_img;
                        if (center_play_img) center_play_img.src = play_btn_img;
                        play = 0;
                    } else {
                        songs_address[current_song].play();
                        if (play_now_text[i]) play_now_text[i].innerHTML = "Playing...";
                        if (song_play_img[i]) song_play_img[i].src = pause_btn_img;
                        if (center_play_img) center_play_img.src = pause_btn_img;
                        updatePlaybarName(song_name[i]);
                        play = 1;
                    }
                }
            });
        }
    }
}

if (vol_img) {
    vol_img.addEventListener("click", () => {
        if (current_song === -1 || !songs_address[current_song]) return;
        if (isMute === 1) {
            vol_img.src = unmute_img;
            songs_address[current_song].volume = 1;
            isMute = 0;
        } else {
            vol_img.src = mute_img;
            songs_address[current_song].volume = 0;
            isMute = 1;
        }
    });
}

if (center_play_img) {
    center_play_img.addEventListener("click", () => {
        if (current_song === -1 && song_name.length > 0) {
            playSong(0);
            return;
        }
        if (current_song === -1 || !songs_address[current_song]) return;

        if (play === 1) {
            songs_address[current_song].pause();
            center_play_img.src = play_btn_img;
            if (song_play_img[current_song]) song_play_img[current_song].src = play_btn_img;
            if (play_now_text[current_song]) play_now_text[current_song].innerHTML = "Play Now";
            play = 0;
        } else {
            songs_address[current_song].play();
            center_play_img.src = pause_btn_img;
            if (song_play_img[current_song]) song_play_img[current_song].src = pause_btn_img;
            if (play_now_text[current_song]) play_now_text[current_song].innerHTML = "Playing...";
            updatePlaybarName(song_name[current_song]);
            play = 1;
        }
    });
}

if (volume_baar) {
    volume_baar.addEventListener("input", () => {
        if (current_song !== -1 && songs_address[current_song]) {
            songs_address[current_song].volume = volume_baar.value / 100;
        }
    });
}

if (song_baar) {
    song_baar.addEventListener("input", () => {
        if (current_song !== -1 && songs_address[current_song]) {
            let duration = songs_address[current_song].duration;
            if (duration && !isNaN(duration)) {
                songs_address[current_song].currentTime = (song_baar.value * duration) / 100;
            }
        }
    });
}

if (play_next) play_next.addEventListener("click", () => playNextSong());
if (play_last) play_last.addEventListener("click", () => playLastSong());

if (close_btn) {
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
}

if (home_btn) {
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
}

if (menu_btn) {
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
}

//   document.body.addEventListener("click", function enterFullscreen() {
 //      document.documentElement.requestFullscreen();
  //    document.body.removeEventListener("click", enterFullscreen);
  // });

// Screen par kahin bhi tap/click hone par fullscreen trigger karne ke liye
document.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.log(`Fullscreen enable nahi ho saka: ${err.message}`);
        });
    }
});

// Jab screen size ya fullscreen status change ho (e.g., jab user Esc dabaye)
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        // Agar exit ho gaya hai, to agle user tap par automatic fir se fullscreen ho jayega
        console.log("Fullscreen exit ho gaya. Agle tap par fir se fullscreen ho jayega.");
    }
});

iski bajah se to nahi ha ?
