import ENDPOINTS from "@/common/endpoints";
import { useApiMutation } from "@/services/hooks";
import { Button } from "@mantine/core";
import { UserPlusIcon, UserMinusIcon } from "@phosphor-icons/react";
import { useEffect, useState, type FC } from "react";

interface FollowButtonProps {
  userId: string;
  following: boolean;
}

const FollowButton: FC<FollowButtonProps> = ({ userId, following }) => {
  const [isFollowing, setIsFollowing] = useState(following);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const { mutate: followUser, isPending: isFollowPending } = useApiMutation({
    url: `${ENDPOINTS.USERS}/${userId}/follow`,
    method: "post",
  });

  const handleFollowToggle = () => {
    followUser(
      {},
      {
        onSuccess: () => {
          setIsFollowing((prev) => !prev);
        },
        onError: (error) => {
          console.error(
            `Error ${isFollowing ? "unfollowinssg" : "following"} user:`,
            error
          );
        },
      }
    );
  };

  return (
    <Button
      onClick={handleFollowToggle}
      loading={isFollowPending}
      variant={isFollowing ? "outline" : "filled"}
      leftSection={
        isFollowing ? <UserMinusIcon size={16} /> : <UserPlusIcon size={16} />
      }
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
