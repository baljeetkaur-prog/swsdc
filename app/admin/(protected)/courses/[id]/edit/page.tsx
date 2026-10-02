"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./EditCourses.css";

interface CurriculumItem {
  number: string;
  title: string;
}

interface Course {
  courseName: string;
  category: string;
  duration: string;
  keyFeatures: string[];
  description: string;
  curriculum: CurriculumItem[];
  mentor: {
    name: string;
    designation: string;
    about: string;
    image: string;
    imagePublicId?: string;
  };
  thumbnail: string;
  thumbnailPublicId?: string;
  video: string;
  videoPublicId?: string;
  slug: string;
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uploadToCloudinary(file: File, folder: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signatureResponse = await fetch(
    "/api/cloudinary-signature",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        paramsToSign,
      }),
    }
  );

  const signatureData = await signatureResponse.json();

  if (!signatureResponse.ok) {
    throw new Error(
      signatureData.error ||
        "Failed to generate upload signature."
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder);
  formData.append("signature", signatureData.signature);

  const uploadResponse = await fetch(
    "https://api.cloudinary.com/v1_1/jiestepq/auto/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const uploadData = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(
      uploadData.error?.message ||
        "Cloudinary upload failed."
    );
  }

  return {
    url: uploadData.secure_url,
    publicId: uploadData.public_id,
  };
}

async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video"
) {
  if (!publicId) return;

  const response = await fetch(
    "/api/cloudinary-delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        publicId,
        resourceType,
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Failed to delete old Cloudinary file."
    );
  }
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [keyFeatures, setKeyFeatures] =
    useState<string[]>([""]);
  const [description, setDescription] = useState("");

  const [curriculum, setCurriculum] =
    useState<CurriculumItem[]>([
      {
        number: "01",
        title: "",
      },
    ]);

  const [mentorName, setMentorName] = useState("");
  const [mentorDesignation, setMentorDesignation] =
    useState("");
  const [mentorAbout, setMentorAbout] = useState("");

  const [existingMentorImage, setExistingMentorImage] =
    useState("");
  const [
    existingMentorImagePublicId,
    setExistingMentorImagePublicId,
  ] = useState("");

  const [mentorImage, setMentorImage] =
    useState<File | null>(null);

  const [existingThumbnail, setExistingThumbnail] =
    useState("");
  const [
    existingThumbnailPublicId,
    setExistingThumbnailPublicId,
  ] = useState("");

  const [thumbnail, setThumbnail] =
    useState<File | null>(null);

  const [existingVideo, setExistingVideo] =
    useState("");
  const [
    existingVideoPublicId,
    setExistingVideoPublicId,
  ] = useState("");

  const [video, setVideo] = useState<File | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  async function fetchCourse() {
    try {
      const response = await fetch(
        `/api/courses/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message || "Failed to load course."
        );
        return;
      }

      const course: Course = data.course;

      setCourseName(course.courseName);
      setCategory(course.category);
      setDuration(course.duration);

      setKeyFeatures(
        course.keyFeatures?.length
          ? course.keyFeatures
          : [""]
      );

      setDescription(course.description);

      setCurriculum(
        course.curriculum?.length
          ? course.curriculum
          : [
              {
                number: "01",
                title: "",
              },
            ]
      );

      setMentorName(course.mentor.name);
      setMentorDesignation(
        course.mentor.designation
      );
      setMentorAbout(course.mentor.about);

      setExistingMentorImage(
        course.mentor.image
      );

      setExistingMentorImagePublicId(
        course.mentor.imagePublicId || ""
      );

      setExistingThumbnail(course.thumbnail);

      setExistingThumbnailPublicId(
        course.thumbnailPublicId || ""
      );

      setExistingVideo(course.video);

      setExistingVideoPublicId(
        course.videoPublicId || ""
      );
    } catch (error) {
      console.error(
        "Fetch course error:",
        error
      );

      setMessage("Failed to load course.");
    } finally {
      setLoading(false);
    }
  }

  function updateKeyFeature(
    index: number,
    value: string
  ) {
    const updated = [...keyFeatures];

    updated[index] = value;

    setKeyFeatures(updated);
  }

  function addKeyFeature() {
    setKeyFeatures([
      ...keyFeatures,
      "",
    ]);
  }

  function removeKeyFeature(index: number) {
    if (keyFeatures.length === 1) return;

    setKeyFeatures(
      keyFeatures.filter(
        (_, i) => i !== index
      )
    );
  }

  function updateCurriculum(
    index: number,
    field: "number" | "title",
    value: string
  ) {
    const updated = [...curriculum];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setCurriculum(updated);
  }

  function addCurriculum() {
    const nextNumber = String(
      curriculum.length + 1
    ).padStart(2, "0");

    setCurriculum([
      ...curriculum,
      {
        number: nextNumber,
        title: "",
      },
    ]);
  }

  function removeCurriculum(index: number) {
    if (curriculum.length === 1) return;

    setCurriculum(
      curriculum.filter(
        (_, i) => i !== index
      )
    );
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setSaving(true);

    let newMentorPublicId = "";
    let newThumbnailPublicId = "";
    let newVideoPublicId = "";

    try {
      const slug = generateSlug(courseName);

      let mentorImageUrl =
        existingMentorImage;

      let thumbnailUrl =
        existingThumbnail;

      let videoUrl =
        existingVideo;

      if (mentorImage) {
        setMessage(
          "Uploading new mentor image..."
        );

        const upload =
          await uploadToCloudinary(
            mentorImage,
            "swsdc/courses/mentors"
          );

        mentorImageUrl = upload.url;
        newMentorPublicId =
          upload.publicId;
      }

      if (thumbnail) {
        setMessage(
          "Uploading new course thumbnail..."
        );

        const upload =
          await uploadToCloudinary(
            thumbnail,
            "swsdc/courses/thumbnails"
          );

        thumbnailUrl = upload.url;
        newThumbnailPublicId =
          upload.publicId;
      }

      if (video) {
        setMessage(
          "Uploading new course video..."
        );

        const upload =
          await uploadToCloudinary(
            video,
            "swsdc/courses/videos"
          );

        videoUrl = upload.url;
        newVideoPublicId =
          upload.publicId;
      }

      setMessage("Updating course...");

      const response = await fetch(
        `/api/courses/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            courseName,
            category,
            duration,

            keyFeatures:
              keyFeatures.filter(
                (feature) =>
                  feature.trim() !== ""
              ),

            description,
            curriculum,

            mentor: {
              name: mentorName,
              designation:
                mentorDesignation,
              about: mentorAbout,
              image: mentorImageUrl,

              imagePublicId: mentorImage
                ? newMentorPublicId
                : existingMentorImagePublicId,
            },

            thumbnail: thumbnailUrl,

            thumbnailPublicId: thumbnail
              ? newThumbnailPublicId
              : existingThumbnailPublicId,

            video: videoUrl,

            videoPublicId: video
              ? newVideoPublicId
              : existingVideoPublicId,

            slug,
          }),
        }
      );

      const data =
        await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to update course."
        );
        return;
      }

      if (
        mentorImage &&
        existingMentorImagePublicId
      ) {
        await deleteFromCloudinary(
          existingMentorImagePublicId,
          "image"
        );
      }

      if (
        thumbnail &&
        existingThumbnailPublicId
      ) {
        await deleteFromCloudinary(
          existingThumbnailPublicId,
          "image"
        );
      }

      if (
        video &&
        existingVideoPublicId
      ) {
        await deleteFromCloudinary(
          existingVideoPublicId,
          "video"
        );
      }

      setMessage(
        "Course updated successfully."
      );

      if (mentorImage) {
        setExistingMentorImage(
          mentorImageUrl
        );

        setExistingMentorImagePublicId(
          newMentorPublicId
        );
      }

      if (thumbnail) {
        setExistingThumbnail(
          thumbnailUrl
        );

        setExistingThumbnailPublicId(
          newThumbnailPublicId
        );
      }

      if (video) {
        setExistingVideo(videoUrl);

        setExistingVideoPublicId(
          newVideoPublicId
        );
      }

      setMentorImage(null);
      setThumbnail(null);
      setVideo(null);

      const mentorInput =
        document.getElementById(
          "mentor-image"
        ) as HTMLInputElement;

      const thumbnailInput =
        document.getElementById(
          "course-thumbnail"
        ) as HTMLInputElement;

      const videoInput =
        document.getElementById(
          "course-video"
        ) as HTMLInputElement;

      if (mentorInput) {
        mentorInput.value = "";
      }

      if (thumbnailInput) {
        thumbnailInput.value = "";
      }

      if (videoInput) {
        videoInput.value = "";
      }
    } catch (error) {
      console.error(
        "Update course error:",
        error
      );

      if (newMentorPublicId) {
        await deleteFromCloudinary(
          newMentorPublicId,
          "image"
        );
      }

      if (newThumbnailPublicId) {
        await deleteFromCloudinary(
          newThumbnailPublicId,
          "image"
        );
      }

      if (newVideoPublicId) {
        await deleteFromCloudinary(
          newVideoPublicId,
          "video"
        );
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="edit-course-page">
        <div className="edit-course-loading">
          Loading course...
        </div>
      </main>
    );
  }

  return (
    <main className="edit-course-page">
      <section className="edit-course-content">

        <div className="edit-course-header">
          <div>
            <p className="edit-course-label">
              ADMIN PANEL
            </p>

            <h1>Edit Course</h1>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/courses"
              )
            }
          >
            ← Back to Courses
          </button>
        </div>

        {message && (
          <div className="edit-course-message">
            {message}
          </div>
        )}

        <form
          className="edit-course-form"
          onSubmit={handleSubmit}
        >

          {/* Course Information */}
          <section className="edit-course-section">
            <h2>Course Information</h2>

            <div className="edit-course-grid">

              <div className="edit-course-field">
                <label>
                  Course Name
                </label>

                <input
                  type="text"
                  value={courseName}
                  onChange={(e) =>
                    setCourseName(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="edit-course-field">
                <label>
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="edit-course-field">
                <label>
                  Duration
                </label>

                <input
                  type="text"
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="edit-course-field">
                <label>
                  Slug
                </label>

                <input
                  type="text"
                  value={generateSlug(
                    courseName
                  )}
                  readOnly
                />
              </div>

            </div>

            <div className="edit-course-field">
              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={6}
                required
              />
            </div>
          </section>

          {/* Key Features */}
          <section className="edit-course-section">
            <div className="edit-course-section-header">
              <h2>Key Features</h2>

              <button
                type="button"
                onClick={addKeyFeature}
              >
                + Add Feature
              </button>
            </div>

            {keyFeatures.map(
              (feature, index) => (
                <div
                  className="dynamic-row"
                  key={index}
                >
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      updateKeyFeature(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Enter key feature"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeKeyFeature(
                        index
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </section>

          {/* Curriculum */}
          <section className="edit-course-section">
            <div className="edit-course-section-header">
              <h2>Curriculum</h2>

              <button
                type="button"
                onClick={addCurriculum}
              >
                + Add Curriculum
              </button>
            </div>

            {curriculum.map(
              (item, index) => (
                <div
                  className="curriculum-row"
                  key={index}
                >
                  <input
                    className="curriculum-number"
                    type="text"
                    value={item.number}
                    onChange={(e) =>
                      updateCurriculum(
                        index,
                        "number",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updateCurriculum(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Curriculum title"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeCurriculum(
                        index
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </section>

          {/* Mentor */}
          <section className="edit-course-section">
            <h2>Mentor</h2>

            <div className="edit-course-grid">

              <div className="edit-course-field">
                <label>
                  Mentor Name
                </label>

                <input
                  type="text"
                  value={mentorName}
                  onChange={(e) =>
                    setMentorName(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="edit-course-field">
                <label>
                  Designation
                </label>

                <input
                  type="text"
                  value={
                    mentorDesignation
                  }
                  onChange={(e) =>
                    setMentorDesignation(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

            </div>

            <div className="edit-course-field">
              <label>
                About Mentor
              </label>

              <textarea
                value={mentorAbout}
                onChange={(e) =>
                  setMentorAbout(
                    e.target.value
                  )
                }
                rows={5}
                required
              />
            </div>

            <div className="media-preview">
              <p>
                Current Mentor Image
              </p>

              {existingMentorImage && (
                <img
                  src={
                    existingMentorImage
                  }
                  alt="Current mentor"
                />
              )}
            </div>

            <div className="edit-course-field">
              <label>
                Replace Mentor Image
              </label>

              <input
                id="mentor-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setMentorImage(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />
            </div>
          </section>

          {/* Thumbnail */}
          <section className="edit-course-section">
            <h2>Course Thumbnail</h2>

            <div className="media-preview">
              <p>
                Current Thumbnail
              </p>

              {existingThumbnail && (
                <img
                  src={
                    existingThumbnail
                  }
                  alt="Current thumbnail"
                />
              )}
            </div>

            <div className="edit-course-field">
              <label>
                Replace Thumbnail
              </label>

              <input
                id="course-thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setThumbnail(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />
            </div>
          </section>

          {/* Video */}
          <section className="edit-course-section">
            <h2>Course Video</h2>

            <div className="media-preview">
              <p>
                Current Video
              </p>

              {existingVideo && (
                <video
                  src={existingVideo}
                  controls
                />
              )}
            </div>

            <div className="edit-course-field">
              <label>
                Replace Course Video
              </label>

              <input
                id="course-video"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setVideo(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />
            </div>
          </section>

          {/* Submit */}
          <div className="edit-course-submit">
            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Updating Course..."
                : "Update Course"}
            </button>
          </div>

        </form>
      </section>
    </main>
  );
}