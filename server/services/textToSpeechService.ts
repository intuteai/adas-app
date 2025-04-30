const googleTTS = require('google-tts-api');

export const generateAudio = async (commands: string[]): Promise<string> => {
  const sentence = commands.join('. ');
  return googleTTS.getAudioUrl(sentence, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  });
};

