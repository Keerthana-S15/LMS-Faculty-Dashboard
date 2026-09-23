import { useCallback, useEffect, useMemo, useState } from "react";
import facultyAvatar from "../assets/faculty-avatar.jpg";
import { facultyApi } from "../api";
import { errorMessage } from "../api/client";
import { FacultyContext } from "./context";

/**
 * Single source of truth for the signed-in faculty member, loaded from
 * GET /api/faculty/profile. The Profile page saves through updateProfile
 * (PUT), and the Topbar, Sidebar and Dashboard read from here, so an edit or
 * a new photo shows up everywhere at once and survives navigation.
 *
 * The bundled avatar is used whenever the record has no avatar URL of its own.
 */
const EMPTY = {
  name: "",
  role: "Faculty",
  department: "",
  college: "",
  email: "",
  phone: "",
  location: "",
  employeeId: "",
  joinDate: "",
  qualification: "",
  designation: "",
  experience: "",
  teachingSince: "",
  about: "",
  avatar: "",
  stats: { liveClassesConducted: 0, publishedMaterials: 0 },
};

export function FacultyProvider({ children }) {
  const [profile, setProfile] = useState(EMPTY);
  const [photo, setPhoto] = useState(facultyAvatar);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await facultyApi.get({ signal });
      if (!data) return;
      setProfile(data);
      setPhoto(data.avatar || facultyAvatar);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(errorMessage(err, "Couldn't load your profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  /** Persists profile edits; throws so the page can show field errors. */
  const updateProfile = useCallback(async (next) => {
    const saved = await facultyApi.update({
      name: next.name,
      email: next.email,
      phone: next.phone,
      location: next.location,
      department: next.department,
      college: next.college,
      qualification: next.qualification,
      designation: next.designation,
      experience: next.experience,
      teachingSince: next.teachingSince,
      joinDate: next.joinDate,
      about: next.about,
    });
    setProfile(saved);
    if (saved.avatar) setPhoto(saved.avatar);
    return saved;
  }, []);

  /**
   * Photo changes stay client-side: the picked file becomes an object URL.
   * Point this at an upload endpoint when file storage is added, then save the
   * returned URL with facultyApi.update({ avatar }).
   */
  const updatePhoto = useCallback((url) => setPhoto(url || facultyAvatar), []);

  const value = useMemo(
    () => ({ profile, photo, loading, error, updateProfile, updatePhoto, reload: () => load() }),
    [profile, photo, loading, error, updateProfile, updatePhoto, load]
  );

  return <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>;
}
