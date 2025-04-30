import { Request, Response } from 'express';
import { sendFrameToVPS } from '../services/vpsDetectionService';
import { generateAudio } from '../services/textToSpeechService';

export const processFrame = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const videoPath = req.file?.path;

    if (!videoPath) {
      res.status(400).json({ message: 'No video file provided' });
      return;
    }

    const detections = await sendFrameToVPS(videoPath);
    const audioUrl = await generateAudio(detections);

    res.json({
      commands: detections,
      audioUrl,
    });
  } catch (error) {
    console.error('Processing failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
