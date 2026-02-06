import { useQuery } from "@tanstack/react-query";
import { cloudinaryService } from "../../services/Cloudinary/cloudinaryService";

export function useCloudinaryGallery() {
  return useQuery({
    queryKey: ["cloudinary-gallery"],
    queryFn: () => cloudinaryService.list(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}
