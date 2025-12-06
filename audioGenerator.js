import { FileWriter } from 'wav';

export async function generateAudio(prompt) {
  const duration = 10;
  const sampleRate = 44100;
  const numChannels = 2;
  const bitDepth = 16;
  
  return new Promise((resolve, reject) => {
    const outputPath = '/tmp/generated-audio.wav';
    
    const writer = new FileWriter(outputPath, {
      sampleRate: sampleRate,
      channels: numChannels,
      bitDepth: bitDepth
    });
    
    const bpm = prompt.match(/fast|energetic|upbeat/i) ? 140 : 
                prompt.match(/slow|chill|ambient/i) ? 80 : 120;
    const isMinor = prompt.match(/sad|dark|minor/i);
    const hasBeats = prompt.match(/beat|drum|percussion|techno|house/i);
    
    const totalSamples = sampleRate * duration;
    const bufferSize = totalSamples * numChannels * 2;
    const buffer = Buffer.alloc(bufferSize);
    
    let bufferIndex = 0;
    
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      const bassFreq = isMinor ? 110 : 130;
      sample += Math.sin(2 * Math.PI * bassFreq * t) * 0.3;
      
      const melodyNote = Math.floor(t * 2) % 4;
      const melodyFreqs = isMinor ? [220, 247, 261, 293] : [261, 293, 329, 349];
      const melodyFreq = melodyFreqs[melodyNote];
      sample += Math.sin(2 * Math.PI * melodyFreq * t) * 0.2;
      
      if (hasBeats) {
        const beatTime = t * bpm / 60;
        const beatPattern = Math.floor(beatTime * 4) % 4;
        if (beatPattern === 0) {
          const beatPhase = beatTime % 1;
          const kick = Math.sin(2 * Math.PI * 60 * t * Math.exp(-beatPhase * 20)) * 0.4;
          sample += kick;
        }
      }
      
      sample += Math.sin(2 * Math.PI * melodyFreq * 0.5 * t) * 0.08;
      
      const envelope = Math.min(1, t * 10, (duration - t) * 10);
      sample *= envelope;
      
      const value = Math.max(-1, Math.min(1, sample)) * 32767;
      const intValue = Math.floor(value);
      
      buffer.writeInt16LE(intValue, bufferIndex);
      buffer.writeInt16LE(intValue, bufferIndex + 2);
      bufferIndex += 4;
    }
    
    writer.write(buffer);
    writer.end();
    
    writer.on('finish', () => resolve(outputPath));
    writer.on('error', reject);
  });
}
