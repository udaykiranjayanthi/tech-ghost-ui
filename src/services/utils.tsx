import type { ErrorResponse } from "@/types";
import { notifications } from "@mantine/notifications";
import { WarningCircleIcon } from "@phosphor-icons/react";
import type { AxiosError } from "axios";
import { AUTO_CLOSE_TIME } from "@/common/constants";

export const displayAbsoluteDate = (date?: string) => {
  if (!date) return "-";

  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const displayDate = (inputDate?: Date | string): string => {
  if (!inputDate) return "-";

  const date = typeof inputDate === "string" ? new Date(inputDate) : inputDate;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds === 0) return "Now";
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };

  if (now.getFullYear() !== date.getFullYear()) {
    options.year = "2-digit"; // e.g., '22'
  }

  return date.toLocaleDateString(undefined, options); // uses user locale
};

export const handleError = ({
  error,
  useFallback = false,
}: {
  error?: AxiosError<ErrorResponse>;
  useFallback?: boolean;
}) => {
  const fallbackErrorMessage = "Something went wrong";
  const errorMessage = error?.response?.data?.message ?? fallbackErrorMessage;

  notifications.show({
    position: "top-center",
    withCloseButton: true,
    autoClose: AUTO_CLOSE_TIME,
    title: "Error",
    message: useFallback ? fallbackErrorMessage : errorMessage,
    color: "red",
    icon: <WarningCircleIcon size={36} />,
    className: "my-notification-class",
    loading: false,
  });
};
