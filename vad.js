/*
 * Simple Voice Activity Detection (VAD) for browsers
 * Adapted to ES‑module from https://github.com/Experience-Monks/voice-activity-detection
 */

export default function createVAD(audioContext, stream, opts = {}) {
  // --- default options ----------------------------------------------
  const defaults = {
    fftSize: 1024,
    bufferLen: 1024,
    smoothingTimeConstant: 0.2,
    minCaptureFreq: 85,          // Hz
    maxCaptureFreq: 255,         // Hz
    noiseCaptureDuration: 1000,  // ms
    minNoiseLevel: 0.3,          // 0…1
    maxNoiseLevel: 0.7,          // 0…1
    avgNoiseMultiplier: 1.2,
    onVoiceStart() {},
    onVoiceStop() {},
    onUpdate() {}
  };

  // merge user opts
  const options = { ...defaults, ...opts };

  // --- internal state ----------------------------------------------
  let baseLevel = 0;
  let voiceScale = 1;
  let activityCounter = 0;
  const activityCounterMin = 0;
  const activityCounterMax = 60;
  const activityCounterThresh = options.activityCounterThresh ?? 5;

  const envFreqSamples = [];
  let noiseCapturing = true;
  let prevVad = undefined;
  let vad = false;
  let captureTimer;

  // --- WebAudio graph ----------------------------------------------
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = options.smoothingTimeConstant;
  analyser.fftSize = options.fftSize;

  const processor = audioContext.createScriptProcessor(options.bufferLen, 1, 1);
  source.connect(analyser);
  analyser.connect(processor);
  processor.connect(audioContext.destination); // required in Chrome

  processor.onaudioprocess = handleAudio;

  // collect ambient noise
  captureTimer = setTimeout(initNoiseLevel, options.noiseCaptureDuration);

  // --- helpers ------------------------------------------------------
  function hzToIndex(hz) {
    const nyquist = audioContext.sampleRate / 2;
    return Math.round(hz / nyquist * analyser.frequencyBinCount);
  }

  function bandAverage(data, minFreq, maxFreq) {
    const start = hzToIndex(minFreq);
    const end   = hzToIndex(maxFreq);
    let sum = 0;
    let count = 0;
    for (let i = start; i <= end; i++) {
      sum += data[i] / 255; // normalise 0‑1
      count++;
    }
    return count ? sum / count : 0;
  }

  // --- initial noise capture ---------------------------------------
  function initNoiseLevel() {
    noiseCapturing = false;
    envFreqSamples.sort((a, b) => a - b);
    const amb = envFreqSamples.length
        ? envFreqSamples.reduce((p, c) => Math.min(p, c), 1)
        : (options.minNoiseLevel || 0.1);

    baseLevel = amb * options.avgNoiseMultiplier;
    baseLevel = Math.max(options.minNoiseLevel, Math.min(options.maxNoiseLevel, baseLevel));
    voiceScale = 1 - baseLevel;
  }

  // --- main analyser loop ------------------------------------------
  function handleAudio() {
    const freqs = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqs);

    const avg = bandAverage(freqs, options.minCaptureFreq, options.maxCaptureFreq);

    if (noiseCapturing) {
      envFreqSamples.push(avg);
      return;
    }

    if (avg >= baseLevel && activityCounter < activityCounterMax) {
      activityCounter++;
    } else if (avg < baseLevel && activityCounter > activityCounterMin) {
      activityCounter--;
    }
    vad = activityCounter > activityCounterThresh;

    if (prevVad !== vad) {
      vad ? options.onVoiceStart() : options.onVoiceStop();
      prevVad = vad;
    }

    options.onUpdate(Math.max(0, avg - baseLevel) / voiceScale);
  }

  // --- public api ---------------------------------------------------
  function destroy() {
    clearTimeout(captureTimer);
    processor.disconnect();
    analyser.disconnect();
    source.disconnect();
    processor.onaudioprocess = null;
  }

  return { destroy };
}
