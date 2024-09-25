import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await fetch(`/api/user/follow/${userId}`, {
          method: "POST",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "not able to follow");
        }
        toast.success("follow successfully");
        queryClient.invalidateQueries({ queryKey: ["suggestedUser"] });
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        return;
      } catch (error) {
        toast.error("unable to follow");
        throw new Error(error);
      }
    },
  });

  return { follow, isPending };
};
export default useFollow;
