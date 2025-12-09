# Audio Samples for AI Music Generator

This folder should contain sample audio files for the DJ AI Studio's mock music generator.

## Required Files (Demo Mode):

Place these audio files in this directory:

- `demo-beat.mp3` - Default/fallback sample
- `bass-sample.mp3` - Triggered by prompts containing "bass" or "deep"
- `drum-sample.mp3` - Triggered by prompts containing "drum" or "beat"
- `synth-sample.mp3` - Triggered by prompts containing "synth" or "electronic"
- `lofi-sample.mp3` - Triggered by prompts containing "lofi" or "chill"
- `ambient-sample.mp3` - Triggered by prompts containing "ambient" or "pad"

## File Format:
- **Format**: MP3, WAV, or OGG
- **Sample Rate**: 44.1kHz recommended
- **Duration**: 2-8 seconds (loops work best)
- **Size**: Keep under 1MB per file for quick loading

## To Add Files:
1. Place your audio files in `/public/audio/`
2. Ensure file names match exactly as listed above
3. Test by typing keywords in the AI Generator interface

## Future: Real AI Integration
To use actual AI music generation APIs:
- Integrate Suno AI, MusicGen, or Stable Audio
- Update `/api/generate-music` endpoint in `app.js`
- Add API keys to `.env` file
