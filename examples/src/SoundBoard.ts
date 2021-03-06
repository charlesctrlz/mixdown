import {Mixdown, BankBuilder, Priority, StreamGenerationHandle} from "../dist/mixdown.module.js"

// todo pull this out
type Optional<T> = T | undefined;

let builder = new BankBuilder();

builder.createMixerDefinition("sfx", 1);
builder.createMixerDefinition("music", 1);
builder.createMixerDefinition("ambience", 1, "sfx");

builder.createAssetDefinition("8bitexplosion", "./assets/8bitexplosion.mp3");
builder.createAssetDefinition("click", "./assets/click.mp3");
builder.createAssetDefinition("error", "./assets/error.mp3");
builder.createAssetDefinition("footsteps", "./assets/footsteps.mp3");
builder.createAssetDefinition("grunt", "./assets/grunt.mp3");
builder.createAssetDefinition("machinegun", "./assets/machine-gun.mp3");
builder.createAssetDefinition("moo", "./assets/moo.mp3");
builder.createAssetDefinition("oildrum", "./assets/oildrum.mp3");
builder.createAssetDefinition("swing", "./assets/swing.mp3");

builder.createStreamDefinition("fight", "./assets/fightmusic.mp3", 1, "music");
builder.createStreamDefinition("sad", "./assets/sadmusic.mp3", 1, "music");

builder.createStreamDefinition("room", "./assets/roomambience.mp3", 1, "ambience");
builder.createStreamDefinition("spaceship", "./assets/spaceshipambience.mp3", 1, "ambience");

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
const mixdown = new Mixdown(15, 4, 4); 
const loadResult = mixdown.loadBank(builder.bank);

let initialized = false;

if (loadResult.kind === "value") {
    const promise = loadResult.value;
    promise.then(() => initialized = true);
}

function sfx (name : string) {
    if (!initialized) {
        return;
    }

    mixdown.playSound(name);
}

let currentMusic : Optional<StreamGenerationHandle> = undefined;
function music (name : string) {
    if (!initialized) {
        return;
    }
    if (currentMusic) {
        mixdown.fadeOutAndRemove(currentMusic, 0.5);
    }

    currentMusic = mixdown.playStream(name);
}

let currentAmbience : Optional<StreamGenerationHandle> = undefined;
function ambience (name : string) {
    if (!initialized) {
        return;
    }
    if (currentAmbience) {
        mixdown.fadeOutAndRemove(currentAmbience, 0.5);
    }

    currentAmbience = mixdown.playStream(name);
}

function stopStream(handle : Optional<StreamGenerationHandle>) {
    if (handle) {
        mixdown.fadeOutAndRemove(handle, 0.5);
    }
}

// hook ups for html
const sfxNames = [
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

const musicNames = [
    "fight",
    "sad"
]

const ambienceNames = [
    "room",
    "spaceship"
]

function hookupClicks(nameArray : string[], f : (arg0 : string) => void) {
    for (let name of nameArray) {
        const button = document.getElementById(name);
        if (button) {
            button.addEventListener("click", () => f(name));
        }
    }   
}

hookupClicks(sfxNames, sfx);
hookupClicks(musicNames, music);
hookupClicks(ambienceNames, ambience);

const stopMusic = document.getElementById("stopmusic");
if (stopMusic) {
    stopMusic.addEventListener("click", () => stopStream(currentMusic));
}

const stopAmbience = document.getElementById("stopambience");
if (stopAmbience) {
    stopAmbience.addEventListener("click", () => stopStream(currentAmbience));
}

function getEventFloatValue(event : Event) : number {
    return parseFloat((event.currentTarget as HTMLInputElement).value);
}

function masterChanged(event : Event) {
    const gain = getEventFloatValue(event);
    mixdown.masterMixer.gain(gain);
}

function sfxChanged(event : Event) {
    const gain = getEventFloatValue(event);
    const mixer = mixdown.getMixer("sfx");
    mixer?.gain(gain);
}

function musicChanged(event : Event) {
    const gain = getEventFloatValue(event);
    const mixer = mixdown.getMixer("music");
    mixer?.gain(gain);
}

function ambienceChanged(event : Event) {
    const gain = getEventFloatValue(event);
    const mixer = mixdown.getMixer("ambience");
    mixer?.gain(gain);
}

const masterSlider = document.getElementById("master");
if (masterSlider) {
    masterSlider.addEventListener("input", masterChanged);
}

const sfxSlider = document.getElementById("sfx");
if (sfxSlider) {
    sfxSlider.addEventListener("input", sfxChanged);
}

const musicSlider = document.getElementById("music");
if (musicSlider) {
    musicSlider.addEventListener("input", musicChanged);
}

const ambienceSlider = document.getElementById("master");
if (ambienceSlider) {
    ambienceSlider.addEventListener("input", ambienceChanged);
}