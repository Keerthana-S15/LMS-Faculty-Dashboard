import { useMemo, useState } from "react";
import { faculty as seedFaculty } from "../data/mockData";
import { FacultyContext } from "./context";

/**
 * Single source of truth for the signed-in faculty member. The Profile page
 * writes here; the Topbar, Sidebar and Dashboard read from it, so an edit or
 * a new photo shows up everywhere at once and survives navigation.
 *
 * Seeded from mockData. When the backend is ready, load it here:
 *   useEffect(() => { getFaculty().then(setProfile); }, []);
 * and make updateProfile / updatePhoto call the PUT endpoints.
 * Consumers read it through the useFaculty() hook.
 */
export function FacultyProvider({ children }) {
  const [profile, setProfile] = useState(() => ({ ...seedFaculty }));
  const [photo, setPhoto] = useState(seedFaculty.avatar);

  const value = useMemo(
    () => ({
      profile,
      photo,
      updateProfile: setProfile,
      updatePhoto: setPhoto,
    }),
    [profile, photo]
  );

  return <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>;
}
