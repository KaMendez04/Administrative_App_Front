import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cloudinaryService } from "../../services/Cloudinary/cloudinaryService";

export function useCloudinaryUpload() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => cloudinaryService.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cloudinary-gallery"] });
    },
  });
}
