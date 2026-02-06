import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cloudinaryService } from "../../services/Cloudinary/cloudinaryService";

export function useCloudinaryDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (publicId: string) => cloudinaryService.remove(publicId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cloudinary-gallery"] });
    },
  });
}
