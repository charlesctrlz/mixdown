import { Mixdown, BankBuilder, Priority } from "../dist/mixdown.module.js";
var builder = new BankBuilder();
builder.createMixerDefinition("sfx", 1);
builder.createMixerDefinition("music", 1);
builder.createMixerDefinition("ambience", 1, "sfx");
builder.createAssetDefinition("8bitexplosion", "../assets/8bitexplosion.mp3");
builder.createAssetDefinition("click", "../assets/click.mp3");
builder.createAssetDefinition("error", "../assets/error.mp3");
builder.createAssetDefinition("footsteps", "../assets/footsteps.mp3");
builder.createAssetDefinition("grunt", "../assets/grunt.mp3");
builder.createAssetDefinition("machinegun", "../assets/machine-gun.mp3");
builder.createAssetDefinition("moo", "../assets/moo.mp3");
builder.createAssetDefinition("oildrum", "../assets/oildrum.mp3");
builder.createAssetDefinition("swing", "../assets/swing.mp3");
builder.createMusicDefinition("fight", "../assets/fightmusic.mp3", 1, "music");
builder.createMusicDefinition("sad", "../assets/sadmusic.mp3", 1, "music");
builder.createMusicDefinition("room", "../assets/roomambience.mp3", 1, "ambience");
builder.createMusicDefinition("spaceship", "../assets/spaceshipambience.mp3", 1, "ambience");
builder.createSoundDefinition("8bitexplosion", Priority.High, "8bitexplosion", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("footsteps", Priority.High, "footsteps", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("machinegun", Priority.High, "machinegun", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("swing", Priority.High, "swing", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("moo", Priority.Medium, "moo", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("oildrum", Priority.Medium, "oildrum", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("grunt", Priority.Medium, "grunt", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("click", Priority.Low, "click", 1, undefined, undefined, "sfx");
builder.createSoundDefinition("error", Priority.Low, "error", 1, undefined, undefined, "sfx");
// create mixdown
// max of 15 sounds at once with a max of 4 streams and a slop size for 4 to ease out lower priority sfx
var mixdown = new Mixdown(15, 4, 4);
var loadResult = mixdown.loadBank(builder);
var initialized = false;
if (loadResult.kind === "value") {
    var promise = loadResult.value;
    promise.then(function () { return initialized = true; });
}
function sfx(name) {
    if (!initialized) {
        return;
    }
    mixdown.playSound(name);
}
var currentMusic = undefined;
function music(name) {
    if (!initialized) {
        return;
    }
    if (currentMusic) {
        // todo: fade out and stop as an option
        mixdown.stopMusic(currentMusic);
    }
    currentMusic = mixdown.playMusic(name);
}
var currentAmbience = undefined;
function ambience(name) {
    if (!initialized) {
        return;
    }
    if (currentAmbience) {
        // todo: fade out and stop as an option
        mixdown.stopMusic(currentAmbience);
    }
    currentAmbience = mixdown.playMusic(name);
}
// hook ups for html
var sfxNames = [
    "8bitexplosion",
    "footsteps",
    "machinegun",
    "swing",
    "moo",
    "oildrum",
    "grunt",
    "click",
    "error"
];
var musicNames = [
    "fight",
    "sad"
];
var ambienceNames = [
    "room",
    "spaceship"
];
function hookupClicks(nameArray, f) {
    var _loop_1 = function (name_1) {
        var button = document.getElementById(name_1);
        if (button) {
            button.addEventListener("click", function () { return f(name_1); });
        }
    };
    for (var _i = 0, nameArray_1 = nameArray; _i < nameArray_1.length; _i++) {
        var name_1 = nameArray_1[_i];
        _loop_1(name_1);
    }
}
hookupClicks(sfxNames, sfx);
hookupClicks(musicNames, music);
hookupClicks(ambienceNames, ambience);