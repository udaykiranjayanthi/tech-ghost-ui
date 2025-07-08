import { useState, useEffect, type FC } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { LinkIcon, CheckCircleIcon } from "@phosphor-icons/react";
import styles from "./styles.module.scss";

type CopyLinkButtonProps = {
  copyText: string;
};

const CopyLinkButton: FC<CopyLinkButtonProps> = ({ copyText }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopyLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(copyText);
    setCopied(true);
  };

  return (
    <Tooltip label={copied ? "Copied!" : "Copy"} position="top" withArrow>
      <ActionIcon
        variant="subtle"
        color={copied ? "green" : "gray"}
        size="md"
        onClick={handleCopyLinkClick}
        className={styles.copyButton}
      >
        {copied ? (
          <CheckCircleIcon size={20} weight="fill" />
        ) : (
          <LinkIcon size={20} />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

export default CopyLinkButton;
