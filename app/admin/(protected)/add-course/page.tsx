"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./AddCourse.css";

interface CurriculumItem {
  number: string;
  title: string;
}

export default function AddCoursePage() {
  const router = useRouter();

  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [keyFeatures, setKeyFeatures] = useState<string[]>([""]);

  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([
    {
      number: "01",
      title: "",
    },
  ]);

  const [mentorName, setMentorName] = useState("");
  const [mentorDesignation, setMentorDesignation] = useState("");
  const [mentorAbout, setMentorAbout] = useState("");

  const [mentorImage, setMentorImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function addFeature() {
    setKeyFeatures([...keyFeatures, ""]);
  }

  function removeFeature(index: number) {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  }

  function updateFeature(index: number, value: string) {
    const updated = [...keyFeatures];
    updated[index] = value;
    setKeyFeatures(updated);
  }

  function addCurriculumItem() {
    const nextNumber = String(curriculum.length + 1).padStart(2, "0");

    setCurriculum([
      ...curriculum,
      {
        number: nextNumber,
        title: "",
      },
    ]);
  }

  function removeCurriculumItem(index: number) {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  }

  function updateCurriculum(
    index: number,
    field: keyof CurriculumItem,
    value: string
  ) {
    const updated = [...curriculum];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setCurriculum(updated);
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
      body: JSON.stringify({
        paramsToSign,
      }),
    }
  );

  const signatureData = await signatureResponse.json();

  if (!signatureResponse.ok) {
    throw new Error(
      signatureData.error || "Failed to generate upload signature."
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "api_key",
    signatureData.apiKey
  );
  formData.append(
    "timestamp",
    timestamp.toString()
  );
  formData.append(
    "folder",
    folder
  );
  formData.append(
    "signature",
    signatureData.signature
  );

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

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setMessage("");

  if (!mentorImage) {
    setMessage("Please select a mentor image.");
    return;
  }

  if (!thumbnail) {
    setMessage("Please select a course thumbnail.");
    return;
  }

  if (!video) {
    setMessage("Please select a course video.");
    return;
  }

  setLoading(true);

  try {
    const slug = generateSlug(courseName);

    setMessage("Uploading mentor image...");

    const mentorUpload = await uploadToCloudinary(
      mentorImage,
      "swsdc/courses/mentors"
    );

    setMessage("Uploading course thumbnail...");

    const thumbnailUpload = await uploadToCloudinary(
      thumbnail,
      "swsdc/courses/thumbnails"
    );

    setMessage("Uploading course video...");

    const videoUpload = await uploadToCloudinary(
      video,
      "swsdc/courses/videos"
    );

    setMessage("Saving course...");

    const response = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        courseName,
        category,
        duration,
        keyFeatures: keyFeatures.filter(
          (feature) => feature.trim() !== ""
        ),
        description,

        curriculum,

        mentor: {
          name: mentorName,
          designation: mentorDesignation,
          about: mentorAbout,
          image: mentorUpload.url,
          imagePublicId: mentorUpload.publicId,
        },

        thumbnail: thumbnailUpload.url,
        thumbnailPublicId: thumbnailUpload.publicId,

        video: videoUpload.url,
        videoPublicId: videoUpload.publicId,

        slug,
      }),
    });

    const data = await response.json();

    // Authentication failed
    if (response.status === 401) {
      router.push("/admin/login");
      return;
    }

    if (!response.ok) {
      setMessage(data.error || "Failed to create course.");
      return;
    }

    setMessage("Course added successfully.");

    // Reset form
    setCourseName("");
    setCategory("");
    setDuration("");
    setDescription("");

    setKeyFeatures([""]);

    setCurriculum([
      {
        number: "01",
        title: "",
      },
    ]);

    setMentorName("");
    setMentorDesignation("");
    setMentorAbout("");

    setMentorImage(null);
    setThumbnail(null);
    setVideo(null);

    const mentorInput = document.getElementById(
      "mentor-image"
    ) as HTMLInputElement;

    const thumbnailInput = document.getElementById(
      "course-thumbnail"
    ) as HTMLInputElement;

    const videoInput = document.getElementById(
      "course-video"
    ) as HTMLInputElement;

    if (mentorInput) mentorInput.value = "";
    if (thumbnailInput) thumbnailInput.value = "";
    if (videoInput) videoInput.value = "";
  } catch (error) {
    console.error("Create course error:", error);

    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="admin-course-page">
      <div className="admin-course-header">
        <p>ADMIN PANEL</p>
        <h1>Add Course</h1>
        <span>
          Add a new course and its complete details.
        </span>
      </div>

      <div className="admin-course-card">
        <form
          onSubmit={handleSubmit}
          className="admin-course-form"
        >
          {/* Course Information */}

          <div className="admin-course-section">
            <h2>Course Information</h2>

            <div className="admin-course-grid">
              <div className="admin-course-field">
                <label htmlFor="courseName">
                  Course Name
                </label>

                <input
                  id="courseName"
                  type="text"
                  value={courseName}
                  onChange={(e) =>
                    setCourseName(e.target.value)
                  }
                  placeholder="Enter course name"
                  required
                />
              </div>

              <div className="admin-course-field">
                <label htmlFor="category">
                  Course Category
                </label>

                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  placeholder="e.g. Welding"
                  required
                />
              </div>

              <div className="admin-course-field">
                <label htmlFor="duration">
                  Duration
                </label>

                <input
                  id="duration"
                  type="text"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  placeholder="e.g. 3 Months"
                  required
                />
              </div>
            </div>

            <div className="admin-course-field">
              <label htmlFor="description">
                Course Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Enter course description"
                rows={6}
                required
              />
            </div>
          </div>

          {/* Key Features */}

          <div className="admin-course-section">
            <div className="admin-course-section-heading">
              <h2>Key Features</h2>

              <button
                type="button"
                onClick={addFeature}
                className="admin-add-button"
              >
                + Add Feature
              </button>
            </div>

            <div className="admin-dynamic-list">
              {keyFeatures.map((feature, index) => (
                <div
                  className="admin-dynamic-row"
                  key={index}
                >
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      updateFeature(index, e.target.value)
                    }
                    placeholder={`Feature ${index + 1}`}
                    required
                  />

                  {keyFeatures.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(index)
                      }
                      className="admin-remove-button"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}

          <div className="admin-course-section">
            <div className="admin-course-section-heading">
              <h2>Curriculum</h2>

              <button
                type="button"
                onClick={addCurriculumItem}
                className="admin-add-button"
              >
                + Add Topic
              </button>
            </div>

            <div className="admin-curriculum-list">
              {curriculum.map((item, index) => (
                <div
                  className="admin-curriculum-row"
                  key={index}
                >
                  <input
                    type="text"
                    value={item.number}
                    onChange={(e) =>
                      updateCurriculum(
                        index,
                        "number",
                        e.target.value
                      )
                    }
                    className="curriculum-number"
                    placeholder="01"
                    required
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
                    placeholder="Enter curriculum topic"
                    required
                  />

                  {curriculum.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeCurriculumItem(index)
                      }
                      className="admin-remove-button"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mentor */}

          <div className="admin-course-section">
            <h2>Mentor Details</h2>

            <div className="admin-course-grid">
              <div className="admin-course-field">
                <label htmlFor="mentorName">
                  Mentor Name
                </label>

                <input
                  id="mentorName"
                  type="text"
                  value={mentorName}
                  onChange={(e) =>
                    setMentorName(e.target.value)
                  }
                  placeholder="Enter mentor name"
                  required
                />
              </div>

              <div className="admin-course-field">
                <label htmlFor="mentorDesignation">
                  Designation
                </label>

                <input
                  id="mentorDesignation"
                  type="text"
                  value={mentorDesignation}
                  onChange={(e) =>
                    setMentorDesignation(e.target.value)
                  }
                  placeholder="e.g. Senior Welding Instructor"
                  required
                />
              </div>
            </div>

            <div className="admin-course-field">
              <label htmlFor="mentorAbout">
                About Mentor
              </label>

              <textarea
                id="mentorAbout"
                value={mentorAbout}
                onChange={(e) =>
                  setMentorAbout(e.target.value)
                }
                placeholder="Write something about the mentor"
                rows={5}
                required
              />
            </div>

            <div className="admin-course-field">
              <label htmlFor="mentor-image">
                Mentor Image
              </label>

              <input
                id="mentor-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setMentorImage(
                    e.target.files?.[0] || null
                  )
                }
                required
              />
            </div>
          </div>

          {/* Course Media */}

          <div className="admin-course-section">
            <h2>Course Media</h2>

            <div className="admin-course-grid">
              <div className="admin-course-field">
                <label htmlFor="course-thumbnail">
                  Course Thumbnail
                </label>

                <input
                  id="course-thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnail(
                      e.target.files?.[0] || null
                    )
                  }
                  required
                />
              </div>

              <div className="admin-course-field">
                <label htmlFor="course-video">
                  Course Video
                </label>

                <input
                  id="course-video"
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setVideo(
                      e.target.files?.[0] || null
                    )
                  }
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="admin-course-submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Course"}
          </button>

          {message && (
            <p className="admin-course-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}