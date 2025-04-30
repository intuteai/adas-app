import googleTTS from 'google-tts-api';

export const generateAudio = async (commands: string[]): Promise<string> => {
  const sentence = commands.join('. ');
  const url = googleTTS.getAudioUrl(sentence, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  });

  return url;
};
