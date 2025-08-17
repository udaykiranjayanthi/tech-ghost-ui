import ENDPOINTS from "@/common/endpoints";
import { useApiMutation } from "@/services/hooks";
import { handleError } from "@/services/utils";
import { ActionIcon, Tooltip } from "@mantine/core";
import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { useEffect, useState, type FC } from "react";

interface PostSaveProps {
  postId: string;
  saved?: boolean;
}

const PostSave: FC<PostSaveProps> = ({ postId, saved = false }) => {
  const [isSaved, setIsSaved] = useState(saved);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  const { mutate: savePost } = useApiMutation({
    url: `${ENDPOINTS.POSTS}/${postId}/save`,
    method: "post",
  });

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    savePost(
      {},
      {
        onSuccess: () => {
          setIsSaved((prev) => !prev);
        },
        onError: (error) => {
          handleError({ error, useFallback: true });
        },
      }
    );
  };

  return (
    <Tooltip label={isSaved ? "Saved!" : "Save"} position="top" withArrow>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="md"
        onClick={handleSaveClick}
      >
        <BookmarkSimpleIcon size={20} weight={isSaved ? "fill" : "regular"} />
      </ActionIcon>
    </Tooltip>
  );
};

export default PostSave;
