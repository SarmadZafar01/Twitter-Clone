import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../common/LoadingSpinner";

const RightPanel = () => {
  const { data: suggesteduser, isLoading } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      const res = await fetch("/api/user/suggested");
      const data = await res.json();
      if (!res.ok) {
        throw Error(data.error || "Suggested users retrieval failed");
      }
      return data.suggestedUser; // Ensure we only return the array
    },
  });

  const { follow, ispending } = useFollow();

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* Loading skeletons */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {/* Suggested users */}
          {!isLoading &&
            suggesteduser?.length > 0 &&
            suggesteduser.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {ispending ? <LoadingSpinner /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}

          {!isLoading && suggesteduser?.length === 0 && (
            <p>No users to suggest</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
