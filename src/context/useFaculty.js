import { useContext } from "react";
import { FacultyContext } from "./context";

/** Read/write access to the signed-in faculty member (see FacultyProvider). */
export function useFaculty() {
  const ctx = useContext(FacultyContext);
  if (!ctx) throw new Error("useFaculty must be used inside <FacultyProvider>");
  return ctx;
}
