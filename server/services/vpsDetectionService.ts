// sendFrameToVPS.ts
import axios from 'axios';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';

// Explicitly set FFmpeg binary path from ffmpeg-static
ffmpeg.setFfmpegPath(ffmpegPath as string);

export const sendFrameToVPS = async (videoPath: string): Promise<string[]> => {
  const framePath = path.join(__dirname, '../../uploads/frame.jpg');

  return new Promise((resolve) => {
    ffmpeg(videoPath)
      .on('end', async () => {
        try {
          const base64Image = fs.readFileSync(framePath, { encoding: 'base64' });

          const response = await axios.post('http://148.66.155.196:5050', {
            image: `data:image/jpeg;base64,${base64Image}`,
          });

          resolve(response.data?.commands || ['No commands']);
        } catch (error: any) {
          console.error('❌ Error sending frame to VPS:', error.message);
          resolve(['Error detecting']);
        }
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err);
        resolve(['Frame extraction failed']);
      })
      .screenshots({
        count: 1,
        folder: path.join(__dirname, '../../uploads'),
        filename: 'frame.jpg',
        timemarks: ['00:00:01.000'],
      });
  });
};
