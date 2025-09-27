import Api from "../httpAPI";
import execError from "../execError";

export const fetchGallery = async (
  pageSize = 10,
  page = 1,
  fileName: string | null,
  mediaType: string | null,
  signal: AbortSignal
) => {
  try {
    const res = await Api.Gallery.fetchGallery(
      pageSize,
      page,
      fileName,
      mediaType as string,
      signal
    );
    const { data } = res;
    return data;
  } catch (error) {
    return execError(error);
  }
};

export const fileUpload = async (file: FormData) => {
  try {
    const { data } = await Api.Gallery.fileUpload(file);
    return data;
  } catch (error) {
    return execError(error);
  }
};
