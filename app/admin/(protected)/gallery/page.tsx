"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./AdminGallery.css";

interface GalleryItem {
  _id: string;
  type: "photo" | "video";
  src: string;
  publicId: string;
  resourceType: "image" | "video";
  createdAt: string;
}

export default function AdminGalleryPage() {
  const router = useRouter();

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  

  const [uploadType, setUploadType] = useState<
    "photo" | "video"
  >("photo");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] =
  useState<string[]>([]);

  async function fetchGallery() {
    try {
      const response = await fetch("/api/gallery");

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setGallery(data.gallery);
      }
    } catch (error) {
      console.error("Fetch gallery error:", error);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchGallery();
  }, []);

  async function uploadToCloudinary(
    selectedFile: File,
    folder: string
  ) {
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

    const signatureData =
      await signatureResponse.json();

    if (!signatureResponse.ok) {
      throw new Error(
        signatureData.error ||
          "Failed to generate upload signature."
      );
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    formData.append(
      "api_key",
      signatureData.apiKey
    );

    formData.append(
      "timestamp",
      timestamp.toString()
    );

    formData.append("folder", folder);

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

    const uploadData =
      await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(
        uploadData.error?.message ||
          "Cloudinary upload failed."
      );
    }

    return {
      url: uploadData.secure_url,
      publicId: uploadData.public_id,
      resourceType: uploadData.resource_type,
    };
  }

async function handleUpload() {
  if (files.length === 0) {
    setMessage("Please select at least one file.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    const folder =
      uploadType === "photo"
        ? "swsdc/gallery/photos"
        : "swsdc/gallery/videos";

    let uploadedCount = 0;

    for (const selectedFile of files) {
      uploadedCount++;

      setMessage(
        `Uploading ${uploadedCount} of ${files.length}...`
      );

      const upload = await uploadToCloudinary(
        selectedFile,
        folder
      );

      setMessage(
        `Saving ${uploadedCount} of ${files.length}...`
      );

      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: uploadType,
          src: upload.url,
          publicId: upload.publicId,
          resourceType: upload.resourceType,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to save ${selectedFile.name}.`
        );
      }
    }

    setMessage(
      uploadType === "photo"
        ? `${files.length} photo${
            files.length !== 1 ? "s" : ""
          } uploaded successfully.`
        : `${files.length} video${
            files.length !== 1 ? "s" : ""
          } uploaded successfully.`
    );

    setFiles([]);

    const fileInput =
      document.getElementById(
        "gallery-file"
      ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }

    await fetchGallery();
  } catch (error) {
    console.error(
      "Gallery upload error:",
      error
    );

    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}
function toggleSelection(id: string) {
  setSelectedItems((previous) =>
    previous.includes(id)
      ? previous.filter((itemId) => itemId !== id)
      : [...previous, id]
  );
}
async function handleDeleteSelected() {
  if (selectedItems.length === 0) {
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete ${selectedItems.length} selected item${
      selectedItems.length !== 1 ? "s" : ""
    }?`
  );

  if (!confirmed) {
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    for (const id of selectedItems) {
      const response = await fetch(
        `/api/gallery/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete gallery item."
        );
      }
    }

    setGallery((previous) =>
      previous.filter(
        (item) => !selectedItems.includes(item._id)
      )
    );

    setSelectedItems([]);

    setMessage(
      `${selectedItems.length} item${
        selectedItems.length !== 1 ? "s" : ""
      } deleted successfully.`
    );
  } catch (error) {
    console.error(
      "Delete selected gallery error:",
      error
    );

    setMessage(
      error instanceof Error
        ? error.message
        : "Failed to delete selected items."
    );
  } finally {
    setLoading(false);
  }
}
function toggleSelectAll() {
  if (selectedItems.length === gallery.length) {
    setSelectedItems([]);
  } else {
    setSelectedItems(
      gallery.map((item) => item._id)
    );
  }
}


  return (
    <main className="admin-gallery-page">
      <div className="admin-gallery-header">
        <p>ADMIN PANEL</p>

        <h1>Gallery</h1>

        <span>
          Upload and manage photos and videos
          displayed on the website gallery.
        </span>
      </div>

      {/* Upload Section */}

      <section className="admin-gallery-card">
        <h2>Upload Gallery Item</h2>

        <div className="admin-gallery-type-buttons">
          <button
  type="button"
  className={
    uploadType === "photo"
      ? "active"
      : ""
  }
  onClick={() =>
    setUploadType("photo")
  }
>
  Upload Photos
</button>

<button
  type="button"
  className={
    uploadType === "video"
      ? "active"
      : ""
  }
  onClick={() =>
    setUploadType("video")
  }
>
  Upload Videos
</button>
        </div>

        <div className="admin-gallery-field">
      <label htmlFor="gallery-file">
  {uploadType === "photo"
    ? "Select Photos"
    : "Select Videos"}
</label>

 <input
  id="gallery-file"
  type="file"
  multiple
  accept={
    uploadType === "photo"
      ? "image/*"
      : "video/*"
  }
  onChange={(e) =>
    setFiles(
      Array.from(e.target.files || [])
    )
  }
/>
        </div>

        <button
          type="button"
          className="admin-gallery-upload"
          onClick={handleUpload}
          disabled={loading}
        >
       {loading
  ? "Uploading..."
  : uploadType === "photo"
  ? "Upload Photos"
  : "Upload Videos"}
        </button>

        {message && (
          <p className="admin-gallery-message">
            {message}
          </p>
        )}
      </section>

      {/* Existing Gallery */}

      <section className="admin-gallery-list-section">
  <div className="admin-gallery-section-header">
  <div>
    <p>MANAGE MEDIA</p>

    <h2>Uploaded Gallery Items</h2>
  </div>

  <div className="admin-gallery-actions">
    <span>
      {selectedItems.length > 0
        ? `${selectedItems.length} selected`
        : `${gallery.length} item${
            gallery.length !== 1 ? "s" : ""
          }`}
    </span>

    {gallery.length > 0 && (
      <button
        type="button"
        className="admin-gallery-select-all"
        onClick={toggleSelectAll}
        disabled={loading}
      >
        {selectedItems.length === gallery.length
          ? "Deselect All"
          : "Select All"}
      </button>
    )}

    {selectedItems.length > 0 && (
      <button
        type="button"
        className="admin-gallery-delete-selected"
        onClick={handleDeleteSelected}
        disabled={loading}
      >
        {loading
          ? "Deleting..."
          : `Delete Selected (${selectedItems.length})`}
      </button>
    )}
  </div>
</div>

        {fetching ? (
          <p>Loading gallery...</p>
        ) : gallery.length === 0 ? (
          <p>
            No gallery items have been uploaded
            yet.
          </p>
        ) : (
          <div className="admin-gallery-grid">
            {gallery.map((item) => (
            <div
  className={`admin-gallery-item ${
    selectedItems.includes(item._id) ? "selected" : ""
  }`}
  key={item._id}
>
  <div
    className="admin-gallery-select"
    onClick={() => toggleSelection(item._id)}
  >
    <div className="admin-gallery-checkbox">
      <input
        type="checkbox"
        checked={selectedItems.includes(item._id)}
        onChange={() => toggleSelection(item._id)}
        onClick={(event) => event.stopPropagation()}
      />

      <span>
        {selectedItems.includes(item._id)
          ? "Selected"
          : "Select"}
      </span>
    </div>

    <div className="admin-gallery-preview">
      {item.type === "photo" ? (
        <img
          src={item.src}
          alt="SWSDC Gallery"
        />
      ) : (
        <video
          src={item.src}
          controls
          preload="metadata"
          playsInline
        />
      )}
    </div>
  </div>

  <div className="admin-gallery-item-footer">
    <span>
      {item.type === "photo" ? "Photo" : "Video"}
    </span>
  </div>
</div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}