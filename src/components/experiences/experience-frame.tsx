import type { ReactNode } from "react";

export type ExperiencePersonalization = {
  recipientName: string;
  senderName: string;
  message: string;
  photos: string[];
  videos: string[];
};

export type ExperienceProps = {
  personalization: ExperiencePersonalization;
  mode?: "demo" | "live";
};

export function ExperienceFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`dark relative flex min-h-[26rem] flex-col overflow-hidden rounded-3xl border border-border bg-night-wash shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
