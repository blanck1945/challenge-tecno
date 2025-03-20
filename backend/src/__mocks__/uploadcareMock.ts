export const base = jest.fn().mockImplementation((file, options) => {
  return Promise.resolve({
    file: 'mocked-file-uuid',
    originalFilename: 'test-file.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    isStored: true,
    isImage: true,
    imageInfo: {
      width: 800,
      height: 600,
      format: 'JPEG',
      colorMode: 'RGB',
    },
  });
});

export default {
  base,
};
