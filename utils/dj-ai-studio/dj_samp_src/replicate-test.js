// replicate-test.js
import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function testMusicGen() {
  try {
    const output = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      {
        input: {
          prompt: "violin",
          model_version: "stereo-large",
          output_format: "mp3",
          normalization_strategy: "peak"
        }
      }
    );
    console.log("Replicate output:", output);
  } catch (err) {
    console.error("Replicate error:", err);
  }
}

testMusicGen();