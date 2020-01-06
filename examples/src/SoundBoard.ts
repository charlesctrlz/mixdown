import {Mixdown, BankBuilder, Priority} from "../dist/mixdown.module.js"

let builder = new BankBuilder();

builder.createMixerDefinition("sfx", 1);
builder.createMixerDefinition("music", 1);
builder.createMixerDefinition("ambience", 1, "sfx");

builder.createAssetDefinition("8bitexplosion", "../assets/8bitexplosion.mp3");
builder.createAssetDefinition("click", "../assets/click.mp3");
builder.createAssetDefinition("error", "../assets/error.mp3");
builder.createAssetDefinition("footsteps", "../assets/footsteps.mp3");
builder.createAssetDefinition("grunt", "../assets/grunt.mp3");
builder.createAssetDefinition("machine-gun", "../assets/machine-gun.mp3");
builder.createAssetDefinition("moo", "../assets/moo.mp3");
builder.createAssetDefinition("oildrum", "../assets/oildrum.mp3");
builder.createAssetDefinition("swing", "../assets/swing.mp3");

builder.createMusicDefinition("fightmusic", "../assets/fightmusic.mp3", 1, "music");
builder.createMusicDefinition("sadmusic", "../assets/sadmusic.mp3", 1, "music");

builder.createMusicDefinition("roomambience", "../assets/roomambience.mp3", 1, "ambience");
builder.createMusicDefinition("spaceshipambience", "../assets/spaceshipambience.mp3", 1, "ambience");

builder.createSoundDefinition("8bitexplosion", Priority.High, "8bitexplosion", 1, undefined, undefined, "sfx");
// todo finish this up

builder.validate();

