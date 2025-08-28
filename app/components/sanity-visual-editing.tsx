import React from "react";
import { VisualEditing } from "@sanity/visual-editing/react-router";
import { DisablePreviewMode } from "./disable-preview-mode";

export function SanityVisualEditing() {
  return (
    <>
      <VisualEditing />
      <DisablePreviewMode />
    </>
  );
}
