import { Request, Response } from 'express';
import { sendFrameToVPS } from '../services/vpsDetectionService';
import { generateAudio } from '../services/textToSpeechService';
import path from 'path';

export const processFrame = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoPath = (req as any).file?.path;
    const model = req.body.model || 'helmet-phone';

    if (!videoPath) {
      res.status(400).json({ message: 'No video uploaded' });
      return;
    }

    const detections = await sendFrameToVPS(videoPath, model);
    const audioUrl = await generateAudio(detections);

    res.status(200).json({
      commands: detections,
      audioUrl,
    });
  } catch (error) {
    console.error('Processing failed:', error);
    res.status(500).json({ message: 'Processing failed' });
  }
};
