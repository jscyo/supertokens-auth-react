import * as React from "react";
export default function PasswordlessAuthWrapper({
    children,
    requireAuth,
    onSessionExpired,
}: {
    children: React.ReactNode;
    requireAuth?: boolean;
    onSessionExpired?: () => void;
}): JSX.Element;