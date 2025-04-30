import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const sendFrameToVPS = async (imagePath: string, model: string): Promise<string[]> => {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('model', model);

    const response = await axios.post('http://148.66.155.196:5050/mediapipe_detect', form, {
      headers: form.getHeaders(),
      timeout: 20000
    });

    return response.data?.commands || ['Error detecting'];
  } catch (error: any) {
    console.error('Error sending frame to VPS:', error.message);
    return ['Error detecting'];
  }
};
