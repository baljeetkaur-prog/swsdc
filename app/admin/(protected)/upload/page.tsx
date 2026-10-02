"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./AdminUpload.css";

export default function AdminUploadPage() {
  const router = useRouter();

  // Certificate fields
  const [certificateNumber, setCertificateNumber] =
    useState("");

  const [studentName, setStudentName] =
    useState("");

  const [fatherName, setFatherName] =
    useState("");

  const [motherName, setMotherName] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [courseName, setCourseName] =
    useState("");

  const [specialisation, setSpecialisation] =
    useState("");

  const [grade, setGrade] =
    useState("");

  const [durationFrom, setDurationFrom] =
    useState("");

  const [durationTo, setDurationTo] =
    useState("");

  const [issueDate, setIssueDate] =
    useState("");

  // PDF
  const [file, setFile] =
    useState<File | null>(null);

  // Profile image
  const [profileImage, setProfileImage] =
    useState("");

  const [profileImagePublicId, setProfileImagePublicId] =
    useState("");

  const [imageUploading, setImageUploading] =
    useState(false);

  // General state
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
   * Upload profile image to Cloudinary
   */
  async function uploadProfileImage(
    selectedFile: File
  ) {
    setMessage("");

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      setMessage(
        "Only JPG, PNG and WebP images are allowed."
      );

      return;
    }

    // Validate file size - 5MB
    const maxSize =
      5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setMessage(
        "Profile image must be less than 5MB."
      );

      return;
    }

    setImageUploading(true);

    try {
      const timestamp =
        Math.floor(Date.now() / 1000);

      const folder =
        "swsdc/certificates/profile";

      /*
       * Parameters that will be signed
       */
      const paramsToSign = {
        timestamp,
        folder,
      };

      /*
       * Get signature from our backend
       */
      const signatureResponse =
        await fetch(
          "/api/cloudinary-signature",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              paramsToSign,
            }),
          }
        );

      const signatureData =
        await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(
          signatureData.error ||
            "Failed to generate Cloudinary signature"
        );
      }

      /*
       * Upload image directly to Cloudinary
       */
      const cloudinaryFormData =
        new FormData();

      cloudinaryFormData.append(
        "file",
        selectedFile
      );

      cloudinaryFormData.append(
        "api_key",
        signatureData.apiKey
      );

      cloudinaryFormData.append(
        "timestamp",
        timestamp.toString()
      );

      cloudinaryFormData.append(
        "signature",
        signatureData.signature
      );

      cloudinaryFormData.append(
        "folder",
        folder
      );

      const cloudinaryResponse =
        await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: cloudinaryFormData,
          }
        );

      const cloudinaryData =
        await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(
          cloudinaryData.error?.message ||
            "Profile image upload failed"
        );
      }

      /*
       * Save Cloudinary values
       */
      setProfileImage(
        cloudinaryData.secure_url
      );

      setProfileImagePublicId(
        cloudinaryData.public_id
      );

      setMessage(
        "Profile image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      setMessage(
        "Failed to upload profile image."
      );

      setProfileImage("");
      setProfileImagePublicId("");
    } finally {
      setImageUploading(false);
    }
  }

  /*
   * Remove profile image
   */
  async function handleRemoveProfileImage() {
    if (!profileImagePublicId) {
      setProfileImage("");

      const imageInput =
        document.getElementById(
          "profile-image"
        ) as HTMLInputElement;

      if (imageInput) {
        imageInput.value = "";
      }

      return;
    }

    try {
      const response =
        await fetch(
          "/api/cloudinary-delete",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              publicId:
                profileImagePublicId,
              resourceType: "image",
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
            "Failed to remove profile image."
        );

        return;
      }

      setProfileImage("");
      setProfileImagePublicId("");

      const imageInput =
        document.getElementById(
          "profile-image"
        ) as HTMLInputElement;

      if (imageInput) {
        imageInput.value = "";
      }

      setMessage(
        "Profile image removed."
      );
    } catch (error) {
      console.error(
        "Remove profile image error:",
        error
      );

      setMessage(
        "Failed to remove profile image."
      );
    }
  }

  /*
   * Submit certificate
   */
  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");

    /*
     * Certificate PDF is required
     */
    if (!file) {
      setMessage(
        "Please select a PDF certificate."
      );

      return;
    }

    /*
     * Validate duration only when
     * both dates are entered
     */
    if (
      durationFrom &&
      durationTo &&
      new Date(durationFrom) >
        new Date(durationTo)
    ) {
      setMessage(
        "Duration From date cannot be after Duration To date."
      );

      return;
    }

    setLoading(true);

    try {
      const formData =
        new FormData();

      /*
       * Required fields
       */
      formData.append(
        "certificateNumber",
        certificateNumber
      );

      formData.append(
        "studentName",
        studentName
      );

      formData.append(
        "issueDate",
        issueDate
      );

      /*
       * Optional fields
       *
       * Only send them when they have
       * a value.
       */
      if (fatherName) {
        formData.append(
          "fatherName",
          fatherName
        );
      }

      if (motherName) {
        formData.append(
          "motherName",
          motherName
        );
      }

      if (dateOfBirth) {
        formData.append(
          "dateOfBirth",
          dateOfBirth
        );
      }

      if (address) {
        formData.append(
          "address",
          address
        );
      }

      if (courseName) {
        formData.append(
          "courseName",
          courseName
        );
      }

      if (specialisation) {
        formData.append(
          "specialisation",
          specialisation
        );
      }

      if (grade) {
        formData.append(
          "grade",
          grade
        );
      }

      if (durationFrom) {
        formData.append(
          "durationFrom",
          durationFrom
        );
      }

      if (durationTo) {
        formData.append(
          "durationTo",
          durationTo
        );
      }

      /*
       * Optional Cloudinary profile image
       */
      if (profileImage) {
        formData.append(
          "profileImage",
          profileImage
        );
      }

      if (profileImagePublicId) {
        formData.append(
          "profileImagePublicId",
          profileImagePublicId
        );
      }

      /*
       * Required PDF certificate
       */
      formData.append(
        "file",
        file
      );

      /*
       * Send everything to certificate API
       */
      const response =
        await fetch(
          "/api/certificates/upload",
          {
            method: "POST",
            body: formData,

            credentials: "include",
          }
        );

      const data =
        await response.json();

      /*
       * Unauthorized
       */
      if (
        response.status === 401
      ) {
        router.push("/admin/login");
        return;
      }

      /*
       * API error
       */
      if (!response.ok) {
        setMessage(
          data.message ||
            "Certificate upload failed."
        );

        return;
      }

      /*
       * Success
       */
      setMessage(
        "Certificate uploaded successfully."
      );

      /*
       * Reset all fields
       */
      setCertificateNumber("");
      setStudentName("");
      setFatherName("");
      setMotherName("");
      setDateOfBirth("");
      setAddress("");
      setCourseName("");
      setSpecialisation("");
      setGrade("");
      setDurationFrom("");
      setDurationTo("");
      setIssueDate("");

      setFile(null);

      setProfileImage("");
      setProfileImagePublicId("");

      /*
       * Clear PDF input
       */
      const fileInput =
        document.getElementById(
          "certificate-file"
        ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }

      /*
       * Clear profile image input
       */
      const imageInput =
        document.getElementById(
          "profile-image"
        ) as HTMLInputElement;

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (error) {
      console.error(
        "Certificate upload error:",
        error
      );

      setMessage(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-upload-page">

      {/* Header */}

      <div className="admin-upload-header">
        <p>ADMIN PANEL</p>

        <h1>
          Upload Certificate
        </h1>

        <span>
          Add a new certificate and
          student record.
        </span>
      </div>

      {/* Card */}

      <div className="admin-upload-card">

        <form
          onSubmit={handleSubmit}
          className="admin-upload-form"
        >

          <div className="admin-upload-grid">

            {/* Certificate Number */}

            <div className="admin-upload-field">
              <label htmlFor="certificateNumber">
                Certificate Number
              </label>

              <input
                id="certificateNumber"
                type="text"
                value={certificateNumber}
                onChange={(e) =>
                  setCertificateNumber(
                    e.target.value
                  )
                }
                placeholder="e.g. SWSDC-2026-001"
                required
              />
            </div>

            {/* Student Name */}

            <div className="admin-upload-field">
              <label htmlFor="studentName">
                Student Name
              </label>

              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) =>
                  setStudentName(
                    e.target.value
                  )
                }
                placeholder="Enter student name"
                required
              />
            </div>

            {/* Father's Name */}

            <div className="admin-upload-field">
              <label htmlFor="fatherName">
                Father's Name
              </label>

              <input
                id="fatherName"
                type="text"
                value={fatherName}
                onChange={(e) =>
                  setFatherName(
                    e.target.value
                  )
                }
                placeholder="Enter father's name"
              />
            </div>

            {/* Mother's Name */}

            <div className="admin-upload-field">
              <label htmlFor="motherName">
                Mother's Name
              </label>

              <input
                id="motherName"
                type="text"
                value={motherName}
                onChange={(e) =>
                  setMotherName(
                    e.target.value
                  )
                }
                placeholder="Enter mother's name"
              />
            </div>

            {/* Date of Birth */}

            <div className="admin-upload-field">
              <label htmlFor="dateOfBirth">
                Date of Birth
              </label>

              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
              />
            </div>

            {/* Profile Image */}

            <div className="admin-upload-field">
              <label htmlFor="profile-image">
                Student Profile Picture
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={async (e) => {
                  const selectedFile =
                    e.target.files?.[0];

                  if (!selectedFile) {
                    return;
                  }

                  await uploadProfileImage(
                    selectedFile
                  );
                }}
                disabled={
                  imageUploading ||
                  loading
                }
              />

              <small>
                JPG, PNG or WebP. Maximum
                size 5MB.
              </small>

              {imageUploading && (
                <p className="admin-upload-image-status">
                  Uploading profile image...
                </p>
              )}

              {profileImage && (
                <div className="admin-upload-image-preview">

                  <img
                    src={profileImage}
                    alt="Student profile preview"
                  />

                  <button
                    type="button"
                    onClick={
                      handleRemoveProfileImage
                    }
                    disabled={loading}
                  >
                    Remove
                  </button>

                </div>
              )}
            </div>

            {/* Address */}

            <div className="admin-upload-field admin-upload-field-full">
              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                placeholder="Enter student's complete address"
                rows={3}
              />
            </div>

            {/* Course Name */}

            <div className="admin-upload-field">
              <label htmlFor="courseName">
                Course Name
              </label>

              <input
                id="courseName"
                type="text"
                value={courseName}
                onChange={(e) =>
                  setCourseName(
                    e.target.value
                  )
                }
                placeholder="Enter course name"
              />
            </div>

            {/* Specialisation */}

            <div className="admin-upload-field">
              <label htmlFor="specialisation">
                Specialisation
              </label>

              <input
                id="specialisation"
                type="text"
                value={specialisation}
                onChange={(e) =>
                  setSpecialisation(
                    e.target.value
                  )
                }
                placeholder="e.g. MIG Welding"
              />
            </div>

            {/* Grade */}

            <div className="admin-upload-field">
              <label htmlFor="grade">
                Grade
              </label>

              <input
                id="grade"
                type="text"
                value={grade}
                onChange={(e) =>
                  setGrade(
                    e.target.value
                  )
                }
                placeholder="e.g. A+"
              />
            </div>

            {/* Duration From */}

            <div className="admin-upload-field">
              <label htmlFor="durationFrom">
                Duration From
              </label>

              <input
                id="durationFrom"
                type="date"
                value={durationFrom}
                onChange={(e) =>
                  setDurationFrom(
                    e.target.value
                  )
                }
              />
            </div>

            {/* Duration To */}

            <div className="admin-upload-field">
              <label htmlFor="durationTo">
                Duration To
              </label>

              <input
                id="durationTo"
                type="date"
                value={durationTo}
                onChange={(e) =>
                  setDurationTo(
                    e.target.value
                  )
                }
              />
            </div>

            {/* Issue Date */}

            <div className="admin-upload-field">
              <label htmlFor="issueDate">
                Issue Date
              </label>

              <input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) =>
                  setIssueDate(
                    e.target.value
                  )
                }
                required
              />
            </div>

            {/* Certificate PDF */}

            <div className="admin-upload-field">
              <label htmlFor="certificate-file">
                Certificate PDF
              </label>

              <input
                id="certificate-file"
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
                required
              />

              <small>
                Upload the student's
                certificate PDF.
              </small>
            </div>

          </div>

          {/* Submit */}

          <button
            type="submit"
            className="admin-upload-button"
            disabled={
              loading ||
              imageUploading
            }
          >
            {loading
              ? "Uploading..."
              : imageUploading
              ? "Uploading Image..."
              : "Upload Certificate"}
          </button>

          {/* Message */}

          {message && (
            <p className="admin-upload-message">
              {message}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}
