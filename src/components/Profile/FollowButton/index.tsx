import ENDPOINTS from "@/common/endpoints";
import { useApiMutation } from "@/services/hooks";
import { Button } from "@mantine/core";
import { UserPlus, UserMinus } from "@phosphor-icons/react";
import type { FC } from "react";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowStatusChange: (isFollowing: boolean) => void;
}

const FollowButton: FC<FollowButtonProps> = ({
  userId,
  isFollowing,
  onFollowStatusChange,
}) => {
  const { mutate: followUser, isPending: isFollowPending } = useApiMutation({
    url: `${ENDPOINTS.USERS}/${userId}/follow`,
    method: "post",
  });

  const { mutate: unfollowUser, isPending: isUnfollowPending } = useApiMutation({
    url: `${ENDPOINTS.USERS}/${userId}/unfollow`,
    method: "post",
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(
        {},
        {
          onSuccess: () => {
            onFollowStatusChange(false);
          },
          onError: (error) => {
            console.error("Error unfollowing user:", error);
          },
        }
      );
    } else {
      followUser(
        {},
        {
          onSuccess: () => {
            onFollowStatusChange(true);
          },
          onError: (error) => {
            console.error("Error following user:", error);
          },
        }
      );
    }
  };

  return (
    <Button
      onClick={handleFollowToggle}
      loading={isFollowPending || isUnfollowPending}
      variant={isFollowing ? "outline" : "filled"}
      color={isFollowing ? "gray" : "blue"}
      leftSection={
        isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />
      }
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
