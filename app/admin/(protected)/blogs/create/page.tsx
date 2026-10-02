"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import "./CreateBlog.css";

export default function CreateBlogPage() {
  const router = useRouter();

  const [blogName, setBlogName] = useState("");
  const [slug, setSlug] = useState("");
const [featuredImage, setFeaturedImage] =
  useState<File | null>(null);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [keywords, setKeywords] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const [content, setContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleBlogNameChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    setBlogName(value);

    // Automatically generate slug
    setSlug(generateSlug(value));
  }
function handleEditorInput() {
  if (!editorRef.current) return;

  setContent(editorRef.current.innerHTML);
}

function executeCommand(command: string) {
  editorRef.current?.focus();

  document.execCommand(command, false);

  handleEditorInput();
}

function formatBlock(tag: string) {
  editorRef.current?.focus();

  document.execCommand("formatBlock", false, tag);

  handleEditorInput();
}

function insertLink() {
  editorRef.current?.focus();

  const url = window.prompt(
    "Enter URL:",
    "https://"
  );

  if (!url) return;

  document.execCommand(
    "createLink",
    false,
    url
  );

  handleEditorInput();
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
async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setLoading(true);
  setMessage("");
  setError("");

  try {
    if (!featuredImage) {
      setError("Please select a featured image.");
      setLoading(false);
      return;
    }

    if (!content.trim()) {
      setError("Please write some blog content.");
      setLoading(false);
      return;
    }

    // Upload featured image
    setMessage("Uploading featured image...");

    const featuredImageUpload =
      await uploadToCloudinary(
        featuredImage,
        "swsdc/blogs/featured"
      );

    // Save blog
    setMessage("Saving blog...");

    const blogData = {
      blogName,
      slug,

      image: featuredImageUpload.url,
      imagePublicId:
        featuredImageUpload.publicId,

      metaTitle,
      metaDescription,

      keywords: keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),

      shortDescription,

      category,

      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),

      content,
    };

    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    const data = await response.json();

    if (response.status === 401) {
      router.push("/admin/login");
      return;
    }

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create blog"
      );
    }

    setMessage("Blog created successfully.");

    setTimeout(() => {
      router.push("/admin/blogs");
    }, 1000);
  } catch (error) {
    console.error("Create blog error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to create blog."
    );
  } finally {
    setLoading(false);
  }
}

  function handleLogout() {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  }

return (
  <div className="admin-create-blog">
        <div className="admin-create-blog-header">
          <div>
            <p className="admin-create-blog-label">
              ADMIN PANEL
            </p>

            <h1>Create Blog</h1>

            <p>
              Add a new blog post to your website.
            </p>
          </div>

          <button
            type="button"
            className="admin-back-btn"
            onClick={() =>
              router.push("/admin/blogs")
            }
          >
            ← Back to Blogs
          </button>
        </div>

        <form
          className="admin-blog-form"
          onSubmit={handleSubmit}
        >
          {/* Basic Information */}

          <div className="admin-form-section">
            <div className="admin-form-section-heading">
              <h2>Basic Information</h2>
              <p>
                Enter the main information about your blog.
              </p>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group admin-full">
                <label htmlFor="blogName">
                  Blog Name *
                </label>

                <input
                  id="blogName"
                  type="text"
                  value={blogName}
                  onChange={handleBlogNameChange}
                  placeholder="Enter blog name"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="slug">
                  Slug *
                </label>

                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      generateSlug(event.target.value)
                    )
                  }
                  placeholder="blog-url-slug"
                  required
                />

                <small>
                  This will be used in the blog URL.
                </small>
              </div>

              <div className="admin-form-group">
                <label htmlFor="category">
                  Category *
                </label>

                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  placeholder="Education"
                  required
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}

         {/* Featured Image */}

<div className="admin-form-section">
  <div className="admin-form-section-heading">
    <h2>Featured Image</h2>

    <p>
      Upload the main image for this blog.
    </p>
  </div>

  <div className="admin-form-grid">
    <div className="admin-form-group admin-full">
      <label htmlFor="featured-image">
        Featured Image *
      </label>

      <input
        id="featured-image"
        type="file"
        accept="image/*"
        onChange={(event) => {
          setFeaturedImage(
            event.target.files?.[0] || null
          );
        }}
        required
      />

      {featuredImage && (
        <small>
          Selected: {featuredImage.name}
        </small>
      )}
    </div>

    {featuredImage && (
      <div className="admin-image-preview admin-full">
        <p>Preview</p>

        <img
          src={URL.createObjectURL(featuredImage)}
          alt="Featured blog preview"
        />
      </div>
    )}
  </div>
</div>

          {/* SEO */}

          <div className="admin-form-section">
            <div className="admin-form-section-heading">
              <h2>SEO Information</h2>
              <p>
                Add search engine information for this blog.
              </p>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group admin-full">
                <label htmlFor="metaTitle">
                  Meta Title *
                </label>

                <input
                  id="metaTitle"
                  type="text"
                  value={metaTitle}
                  onChange={(event) =>
                    setMetaTitle(event.target.value)
                  }
                  placeholder="Enter SEO meta title"
                  required
                />
              </div>

              <div className="admin-form-group admin-full">
                <label htmlFor="metaDescription">
                  Meta Description *
                </label>

                <textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(event) =>
                    setMetaDescription(event.target.value)
                  }
                  placeholder="Enter SEO meta description"
                  rows={4}
                  required
                />
              </div>

              <div className="admin-form-group admin-full">
                <label htmlFor="keywords">
                  Keywords
                </label>

                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(event) =>
                    setKeywords(event.target.value)
                  }
                  placeholder="welding course, welding training, ITI welding"
                />

                <small>
                  Separate keywords with commas.
                </small>
              </div>
            </div>
          </div>

          {/* Blog Description */}

          <div className="admin-form-section">
            <div className="admin-form-section-heading">
              <h2>Blog Description</h2>
              <p>
                Add a short description shown on blog cards.
              </p>
            </div>

            <div className="admin-form-group">
              <label htmlFor="shortDescription">
                Short Description *
              </label>

              <textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(event) =>
                  setShortDescription(event.target.value)
                }
                placeholder="Write a short description for the blog..."
                rows={5}
                required
              />
            </div>
          </div>

          {/* Tags */}

          <div className="admin-form-section">
            <div className="admin-form-section-heading">
              <h2>Tags</h2>
              <p>
                Add tags related to this blog.
              </p>
            </div>

            <div className="admin-form-group">
              <label htmlFor="tags">
                Tags
              </label>

              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(event) =>
                  setTags(event.target.value)
                }
                placeholder="welding, career, training"
              />

              <small>
                Separate tags with commas.
              </small>
            </div>
          </div>

          {/* Content */}

        {/* Content */}

<div className="admin-form-section">
  <div className="admin-form-section-heading">
    <h2>Blog Content</h2>

    <p>
      Write the complete content of your blog.
    </p>
  </div>

  <div className="admin-form-group">
    <label>
      Content *
    </label>

    <div className="custom-blog-editor">

      {/* Toolbar */}

      <div className="custom-editor-toolbar">

        {/* Heading */}

      <select
  defaultValue="p"
  onChange={(event) =>
    formatBlock(event.target.value)
  }
  className="editor-format-select"
>
  <option value="p">
    Paragraph
  </option>

  <option value="h1">
    Heading 1
  </option>

  <option value="h2">
    Heading 2
  </option>

  <option value="h3">
    Heading 3
  </option>

  <option value="h4">
    Heading 4
  </option>

  <option value="h5">
    Heading 5
  </option>

  <option value="h6">
    Heading 6
  </option>
</select>

        <span className="editor-divider" />

        {/* Bold */}

        <button
          type="button"
          title="Bold"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("bold")
          }
        >
          <strong>B</strong>
        </button>

        {/* Italic */}

        <button
          type="button"
          title="Italic"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("italic")
          }
        >
          <em>I</em>
        </button>

        {/* Underline */}

        <button
          type="button"
          title="Underline"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("underline")
          }
        >
          <u>U</u>
        </button>

        <span className="editor-divider" />

        {/* Bullet List */}

        <button
          type="button"
          title="Bullet List"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand(
              "insertUnorderedList"
            )
          }
        >
          • List
        </button>

        {/* Numbered List */}

        <button
          type="button"
          title="Numbered List"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand(
              "insertOrderedList"
            )
          }
        >
          1. List
        </button>

        <span className="editor-divider" />

        {/* Alignment */}

        <button
          type="button"
          title="Align Left"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("justifyLeft")
          }
        >
          ≡
        </button>

        <button
          type="button"
          title="Align Center"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("justifyCenter")
          }
        >
          ☰
        </button>

        <button
          type="button"
          title="Align Right"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("justifyRight")
          }
        >
          ≡
        </button>

        <span className="editor-divider" />

        {/* Link */}

        <button
          type="button"
          title="Insert Link"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={insertLink}
        >
          🔗
        </button>

        {/* Blockquote */}

        <button
          type="button"
          title="Blockquote"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            formatBlock("blockquote")
          }
        >
          ❝
        </button>

        {/* Clear formatting */}

        <button
          type="button"
          title="Clear Formatting"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("removeFormat")
          }
        >
          Tx
        </button>

        <span className="editor-divider" />

        {/* Undo */}

        <button
          type="button"
          title="Undo"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("undo")
          }
        >
          ↶
        </button>

        {/* Redo */}

        <button
          type="button"
          title="Redo"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            executeCommand("redo")
          }
        >
          ↷
        </button>
      </div>

      {/* Editor */}

      <div
        ref={editorRef}
        className="custom-editor-content"
        contentEditable
        suppressContentEditableWarning
        onInput={handleEditorInput}
        data-placeholder="Write your blog content here..."
      />

    </div>
  </div>
</div>

          {/* Messages */}

          {error && (
            <div className="admin-form-error">
              {error}
            </div>
          )}

          {message && (
            <div className="admin-form-success">
              {message}
            </div>
          )}

          {/* Submit */}

          <div className="admin-form-submit">
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={() =>
                router.push("/admin/blogs")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-submit-blog-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Blog..."
                : "Create Blog"}
            </button>
          </div>
        </form>
  </div>
);
}