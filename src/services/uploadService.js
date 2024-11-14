import axios from 'axios';

export const getUploadUrl = async (fileName, fileType) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/upload-url`, {
        params: { fileName, fileType },
    });
    return response.data.uploadURL;
};

export const uploadFileToS3 = async (uploadURL, file) => {
    await axios.put(uploadURL, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};
