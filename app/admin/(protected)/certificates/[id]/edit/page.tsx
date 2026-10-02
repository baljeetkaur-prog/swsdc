"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import "./EditCertificate.css";

interface Certificate {
  _id: string;

  certificateNumber: string;
  studentName: string;

  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  address?: string;

  courseName?: string;
  specialisation?: string;

  grade?: string;

  duration?: {
    from?: string;
    to?: string;
  };

  issueDate: string;

  profileImage?: string;
  profileImagePublicId?: string;

  pdfFileId: string;
}

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const profileImageInputRef =
    useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* ================================
     CERTIFICATE FIELDS
  ================================ */

  const [
    certificateNumber,
    setCertificateNumber,
  ] = useState("");

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

  /* ================================
     PROFILE IMAGE
  ================================ */

  const [profileImage, setProfileImage] =
    useState("");

  const [
    profileImagePublicId,
    setProfileImagePublicId,
  ] = useState("");

  /* ================================
     PDF
  ================================ */

  const [
    existingPdfFileId,
    setExistingPdfFileId,
  ] = useState("");

  const [file, setFile] =
    useState<File | null>(null);

  /* ================================
     FETCH CERTIFICATE
  ================================ */

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  async function fetchCertificate() {
    try {
      const response =
        await fetch(
          `/api/certificates/${id}`,
          {
            method: "GET",
            credentials: "include",
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
            "Failed to load certificate."
        );

        return;
      }

      const certificate: Certificate =
        data.certificate;

      /* ================================
         BASIC INFORMATION
      ================================ */

      setCertificateNumber(
        certificate.certificateNumber || ""
      );

      setStudentName(
        certificate.studentName || ""
      );

      setFatherName(
        certificate.fatherName || ""
      );

      setMotherName(
        certificate.motherName || ""
      );

      setAddress(
        certificate.address || ""
      );

      setCourseName(
        certificate.courseName || ""
      );

      setSpecialisation(
        certificate.specialisation || ""
      );

      setGrade(
        certificate.grade || ""
      );

      /* ================================
         DATES
      ================================ */

      setDateOfBirth(
        certificate.dateOfBirth
          ? new Date(
              certificate.dateOfBirth
            )
              .toISOString()
              .split("T")[0]
          : ""
      );

      setDurationFrom(
        certificate.duration?.from
          ? new Date(
              certificate.duration.from
            )
              .toISOString()
              .split("T")[0]
          : ""
      );

      setDurationTo(
        certificate.duration?.to
          ? new Date(
              certificate.duration.to
            )
              .toISOString()
              .split("T")[0]
          : ""
      );

      setIssueDate(
        certificate.issueDate
          ? new Date(
              certificate.issueDate
            )
              .toISOString()
              .split("T")[0]
          : ""
      );

      /* ================================
         PROFILE IMAGE
      ================================ */

      setProfileImage(
        certificate.profileImage || ""
      );

      setProfileImagePublicId(
        certificate.profileImagePublicId || ""
      );

      /* ================================
         PDF
      ================================ */

      setExistingPdfFileId(
        certificate.pdfFileId || ""
      );
    } catch (error) {
      console.error(
        "Fetch certificate error:",
        error
      );

      setMessage(
        "Failed to load certificate."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================================
     UPLOAD PROFILE IMAGE
  ================================ */

  async function uploadProfileImage(
    selectedFile: File
  ) {
    try {
      setUploadingImage(true);
      setMessage("");

      /* ================================
         VALIDATE FILE
      ================================ */

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
          "Only JPG, PNG and WEBP images are allowed."
        );

        return;
      }

      if (
        selectedFile.size >
        5 * 1024 * 1024
      ) {
        setMessage(
          "Profile image must be less than 5MB."
        );

        return;
      }

      /* ================================
         OLD IMAGE
      ================================ */

      const oldProfileImagePublicId =
        profileImagePublicId;

      /* ================================
         CLOUDINARY SIGNATURE
      ================================ */

      const timestamp =
        Math.floor(
          Date.now() / 1000
        );

      const folder =
        "swsdc/certificates/profile";

      const signatureResponse =
        await fetch(
          "/api/cloudinary-signature",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              paramsToSign: {
                folder,
                timestamp,
              },
            }),
          }
        );

      const signatureData =
        await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(
          signatureData.error ||
            "Failed to generate Cloudinary signature."
        );
      }

      /* ================================
         UPLOAD TO CLOUDINARY
      ================================ */

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
            "Failed to upload profile image."
        );
      }

      /* ================================
         UPDATE STATE
      ================================ */

      setProfileImage(
        cloudinaryData.secure_url
      );

      setProfileImagePublicId(
        cloudinaryData.public_id
      );

      /* ================================
         DELETE OLD IMAGE
      ================================ */

      if (
        oldProfileImagePublicId &&
        oldProfileImagePublicId !==
          cloudinaryData.public_id
      ) {
        try {
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
                  oldProfileImagePublicId,
                resourceType: "image",
              }),
            }
          );
        } catch (error) {
          console.error(
            "Failed to delete old profile image:",
            error
          );
        }
      }

      setMessage(
        "Profile image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  /* ================================
     PROFILE IMAGE CHANGE
  ================================ */

  async function handleProfileImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    await uploadProfileImage(
      selectedFile
    );
  }

  /* ================================
     REMOVE PROFILE IMAGE
  ================================ */

  async function handleRemoveProfileImage() {
    if (!profileImagePublicId) {
      setProfileImage("");
      return;
    }

    try {
      setUploadingImage(true);
      setMessage("");

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

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove profile image."
        );
      }

      setProfileImage("");
      setProfileImagePublicId("");

      if (
        profileImageInputRef.current
      ) {
        profileImageInputRef.current.value =
          "";
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
        error instanceof Error
          ? error.message
          : "Failed to remove profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  /* ================================
     SUBMIT
  ================================ */

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");

    /* ================================
       REQUIRED FIELD VALIDATION
    ================================ */

    if (
      !certificateNumber.trim() ||
      !studentName.trim() ||
      !issueDate
    ) {
      setMessage(
        "Certificate number, student name and issue date are required."
      );

      return;
    }

    /* ================================
       DURATION VALIDATION
       
       Only validate if BOTH dates
       are provided.
    ================================ */

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

    setSaving(true);

    try {
      const formData =
        new FormData();

      /* ================================
         REQUIRED FIELDS
      ================================ */

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

      /* ================================
         OPTIONAL PERSONAL INFORMATION
      ================================ */

      if (fatherName.trim()) {
        formData.append(
          "fatherName",
          fatherName
        );
      }

      if (motherName.trim()) {
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

      if (address.trim()) {
        formData.append(
          "address",
          address
        );
      }

      /* ================================
         OPTIONAL COURSE INFORMATION
      ================================ */

      if (courseName.trim()) {
        formData.append(
          "courseName",
          courseName
        );
      }

      if (specialisation.trim()) {
        formData.append(
          "specialisation",
          specialisation
        );
      }

      if (grade.trim()) {
        formData.append(
          "grade",
          grade
        );
      }

      /* ================================
         OPTIONAL DURATION
      ================================ */

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

      /* ================================
         OPTIONAL PROFILE IMAGE
      ================================ */

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

      /* ================================
         OPTIONAL PDF
      ================================ */

      if (file) {
        formData.append(
          "file",
          file
        );
      }

      /* ================================
         UPDATE API
      ================================ */

      const response =
        await fetch(
          `/api/certificates/${id}`,
          {
            method: "PUT",
            credentials: "include",
            body: formData,
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
            "Failed to update certificate."
        );

        return;
      }

      setMessage(
        "Certificate updated successfully."
      );

      /* ================================
         UPDATE LOCAL PDF STATE
      ================================ */

      if (
        data.certificate?.pdfFileId
      ) {
        setExistingPdfFileId(
          data.certificate.pdfFileId
        );
      }

      setFile(null);

      const fileInput =
        document.getElementById(
          "certificate-file"
        ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Update certificate error:",
        error
      );

      setMessage(
        "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ================================
     LOADING
  ================================ */

  if (loading) {
    return (
      <main className="edit-certificate-page">
        <div className="edit-certificate-loading">
          Loading certificate...
        </div>
      </main>
    );
  }

  /* ================================
     UI
  ================================ */

  return (
    <main className="edit-certificate-page">
      <div className="edit-certificate-content">

        {/* ================================
            HEADER
        ================================ */}

        <div className="edit-certificate-header">
          <div>
            <p className="edit-certificate-label">
              ADMIN PANEL
            </p>

            <h1>
              Edit Certificate
            </h1>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/certificates"
              )
            }
          >
            ← Back to Certificates
          </button>
        </div>

        {/* ================================
            MESSAGE
        ================================ */}

        {message && (
          <div className="edit-certificate-message">
            {message}
          </div>
        )}

        {/* ================================
            FORM
        ================================ */}

        <form
          className="edit-certificate-form"
          onSubmit={handleSubmit}
        >

          {/* ================================
              PERSONAL INFORMATION
          ================================ */}

          <section className="edit-certificate-section">

            <h2>
              Personal Information
            </h2>

            <div className="edit-certificate-grid">

              <div className="edit-certificate-field">
                <label>
                  Certificate Number
                </label>

                <input
                  type="text"
                  value={
                    certificateNumber
                  }
                  onChange={(e) =>
                    setCertificateNumber(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Student Name
                </label>

                <input
                  type="text"
                  value={
                    studentName
                  }
                  onChange={(e) =>
                    setStudentName(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Father's Name
                </label>

                <input
                  type="text"
                  value={
                    fatherName
                  }
                  onChange={(e) =>
                    setFatherName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Mother's Name
                </label>

                <input
                  type="text"
                  value={
                    motherName
                  }
                  onChange={(e) =>
                    setMotherName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={
                    dateOfBirth
                  }
                  onChange={(e) =>
                    setDateOfBirth(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="edit-certificate-field edit-certificate-field-full">
                <label>
                  Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  rows={3}
                />
              </div>

            </div>

          </section>

          {/* ================================
              COURSE INFORMATION
          ================================ */}

          <section className="edit-certificate-section">

            <h2>
              Course Information
            </h2>

            <div className="edit-certificate-grid">

              <div className="edit-certificate-field">
                <label>
                  Course Name
                </label>

                <input
                  type="text"
                  value={
                    courseName
                  }
                  onChange={(e) =>
                    setCourseName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Specialisation
                </label>

                <input
                  type="text"
                  value={
                    specialisation
                  }
                  onChange={(e) =>
                    setSpecialisation(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Grade
                </label>

                <input
                  type="text"
                  value={grade}
                  onChange={(e) =>
                    setGrade(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Issue Date
                </label>

                <input
                  type="date"
                  value={
                    issueDate
                  }
                  onChange={(e) =>
                    setIssueDate(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

            </div>

          </section>

          {/* ================================
              COURSE DURATION
          ================================ */}

          <section className="edit-certificate-section">

            <h2>
              Course Duration
            </h2>

            <div className="edit-certificate-grid">

              <div className="edit-certificate-field">
                <label>
                  Duration From
                </label>

                <input
                  type="date"
                  value={
                    durationFrom
                  }
                  onChange={(e) =>
                    setDurationFrom(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="edit-certificate-field">
                <label>
                  Duration To
                </label>

                <input
                  type="date"
                  value={
                    durationTo
                  }
                  onChange={(e) =>
                    setDurationTo(
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

          </section>

          {/* ================================
              PROFILE IMAGE
          ================================ */}

          <section className="edit-certificate-section">

            <h2>
              Student Profile Image
            </h2>

            <div className="edit-certificate-profile-image">

              {profileImage ? (
                <div className="edit-certificate-profile-preview">

                  <img
                    src={profileImage}
                    alt="Student profile"
                  />

                  <button
                    type="button"
                    onClick={
                      handleRemoveProfileImage
                    }
                    disabled={
                      uploadingImage
                    }
                  >
                    {uploadingImage
                      ? "Removing..."
                      : "Remove Image"}
                  </button>

                </div>
              ) : (
                <div className="edit-certificate-no-image">
                  No profile image
                </div>
              )}

            </div>

            <div className="edit-certificate-field">

              <label>
                {profileImage
                  ? "Replace Profile Image"
                  : "Upload Profile Image"}
              </label>

              <input
                ref={
                  profileImageInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleProfileImageChange
                }
                disabled={
                  uploadingImage
                }
              />

              <small>
                JPG, PNG or WEBP. Maximum
                file size: 5MB.
              </small>

              {uploadingImage && (
                <small>
                  Uploading image...
                </small>
              )}

            </div>

          </section>

          {/* ================================
              PDF
          ================================ */}

          <section className="edit-certificate-section">

            <h2>
              Certificate PDF
            </h2>

            <div className="certificate-pdf-preview">

              <p>
                Current Certificate
              </p>

              {existingPdfFileId && (
                <a
                  href={`/api/certificates/file/${existingPdfFileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Current PDF
                </a>
              )}

            </div>

            <div className="edit-certificate-field">

              <label>
                Replace Certificate PDF
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
              />

              <small>
                Leave empty if you do not
                want to replace the
                existing PDF.
              </small>

            </div>

          </section>

          {/* ================================
              SUBMIT
          ================================ */}

          <div className="edit-certificate-submit">

            <button
              type="submit"
              disabled={
                saving ||
                uploadingImage
              }
            >
              {saving
                ? "Updating..."
                : "Update Certificate"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}