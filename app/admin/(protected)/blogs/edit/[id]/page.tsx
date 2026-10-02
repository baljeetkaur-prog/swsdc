"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import "./EditBlog.css";

interface BlogData {
  _id: string;
  blogName: string;
  slug: string;
  image: string;
  imagePublicId: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  shortDescription: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const editorRef = useRef<HTMLDivElement>(null);

  const [blog, setBlog] = useState<BlogData | null>(null);

  const [blogName, setBlogName] = useState("");
  const [slug, setSlug] = useState("");

  const [featuredImage, setFeaturedImage] =
    useState<File | null>(null);

  const [existingImage, setExistingImage] =
    useState("");

  const [existingImagePublicId, setExistingImagePublicId] =
    useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] =
    useState("");

  const [keywords, setKeywords] = useState("");
  const [shortDescription, setShortDescription] =
    useState("");

  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  /*
   * Generate slug
   */
  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  /*
   * Blog name change
   */
  function handleBlogNameChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    setBlogName(value);
    setSlug(generateSlug(value));
  }

  /*
   * Fetch blog
   *
   * Authentication is handled by the HTTP-only
   * adminToken cookie automatically.
   */
  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/blogs/id/${id}`,
          {
            method: "GET",
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
              "Failed to fetch blog"
          );
        }

        const fetchedBlog: BlogData =
          data.blog;

        setBlog(fetchedBlog);

        setBlogName(
          fetchedBlog.blogName
        );

        setSlug(fetchedBlog.slug);

        setExistingImage(
          fetchedBlog.image
        );

        setExistingImagePublicId(
          fetchedBlog.imagePublicId
        );

        setImagePreview(
          fetchedBlog.image
        );

        setMetaTitle(
          fetchedBlog.metaTitle
        );

        setMetaDescription(
          fetchedBlog.metaDescription
        );

        setKeywords(
          fetchedBlog.keywords.join(", ")
        );

        setShortDescription(
          fetchedBlog.shortDescription
        );

        setCategory(
          fetchedBlog.category
        );

        setTags(
          fetchedBlog.tags.join(", ")
        );

        setContent(
          fetchedBlog.content
        );

        /*
         * Load saved HTML into editor
         */
        if (editorRef.current) {
          editorRef.current.innerHTML =
            fetchedBlog.content;
        }
      } catch (error) {
        console.error(
          "Fetch blog error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch blog."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBlog();
    }
  }, [id, router]);

  /*
   * Keep editor HTML in state
   */
  function handleEditorInput() {
    if (!editorRef.current) return;

    setContent(
      editorRef.current.innerHTML
    );
  }

  /*
   * Execute editor command
   */
  function executeCommand(command: string) {
    editorRef.current?.focus();

    document.execCommand(
      command,
      false
    );

    handleEditorInput();
  }

  /*
   * Format block
   */
  function formatBlock(tag: string) {
    editorRef.current?.focus();

    document.execCommand(
      "formatBlock",
      false,
      tag
    );

    handleEditorInput();
  }

  /*
   * Insert link
   */
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

  /*
   * Featured image selection
   */
  function handleFeaturedImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] || null;

    setFeaturedImage(file);

    if (file) {
      const previewUrl =
        URL.createObjectURL(file);

      setImagePreview(previewUrl);
    } else {
      setImagePreview(existingImage);
    }
  }

  /*
   * Upload image to Cloudinary
   */
  async function uploadToCloudinary(
    file: File,
    folder: string
  ) {
    const timestamp = Math.floor(
      Date.now() / 1000
    );

    const paramsToSign = {
      timestamp,
      folder,
    };

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

    if (signatureResponse.status === 401) {
      router.push("/admin/login");
      throw new Error("Unauthorized");
    }

    if (!signatureResponse.ok) {
      throw new Error(
        signatureData.error ||
          "Failed to generate upload signature."
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

    const uploadResponse =
      await fetch(
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
    };
  }

  /*
   * Submit update
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!content.trim()) {
        setError(
          "Please write some blog content."
        );

        setSaving(false);
        return;
      }

      let imageUrl = existingImage;
      let imagePublicId =
        existingImagePublicId;

      /*
       * Only upload if a new image
       * has been selected
       */
      if (featuredImage) {
        setMessage(
          "Uploading new featured image..."
        );

        const uploadedImage =
          await uploadToCloudinary(
            featuredImage,
            "swsdc/blogs/featured"
          );

        imageUrl =
          uploadedImage.url;

        imagePublicId =
          uploadedImage.publicId;
      }

      setMessage("Updating blog...");

      const blogData = {
        blogName,
        slug,

        image: imageUrl,
        imagePublicId,

        metaTitle,
        metaDescription,

        keywords: keywords
          .split(",")
          .map((keyword) =>
            keyword.trim()
          )
          .filter(Boolean),

        shortDescription,

        category,

        tags: tags
          .split(",")
          .map((tag) =>
            tag.trim()
          )
          .filter(Boolean),

        content,
      };

      const response =
        await fetch(
          `/api/blogs/id/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              blogData
            ),
          }
        );

      const data =
        await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update blog"
        );
      }

      setMessage(
        "Blog updated successfully."
      );

      setTimeout(() => {
        router.push(
          "/admin/blogs"
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Update blog error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update blog."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="admin-edit-blog">
        <div className="admin-edit-loading">
          Loading blog...
        </div>
      </div>
    );
  }

  /*
   * Blog not found
   */
  if (!blog) {
    return (
      <div className="admin-edit-blog">
        <div className="admin-edit-loading">
          {error || "Blog not found."}
        </div>
      </div>
    );
  }

  return (
    <main className="admin-edit-blog">

      {/* Main Content */}
      <section className="admin-edit-blog-content">

        {/* Header */}
        <header className="admin-edit-blog-header">

          <div>
            <p className="admin-edit-blog-label">
              BLOG MANAGEMENT
            </p>

            <h1>Edit Blog</h1>

            <p>
              Update your blog content and
              SEO information.
            </p>
          </div>

          <button
            type="button"
            className="admin-back-btn"
            onClick={() =>
              router.push(
                "/admin/blogs"
              )
            }
          >
            ← Back to Blogs
          </button>

        </header>

        <form
          className="admin-blog-form"
          onSubmit={handleSubmit}
        >

          {/* Basic Information */}
          <div className="admin-form-section">

            <div className="admin-form-section-heading">
              <h2>
                Basic Information
              </h2>

              <p>
                Update the main information
                for this blog.
              </p>
            </div>

            <div className="admin-form-grid">

              <div className="admin-form-group">

                <label htmlFor="blog-name">
                  Blog Name *
                </label>

                <input
                  id="blog-name"
                  type="text"
                  value={blogName}
                  onChange={
                    handleBlogNameChange
                  }
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
                      generateSlug(
                        event.target.value
                      )
                    )
                  }
                  required
                />

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
                    setCategory(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

          </div>

          {/* Featured Image */}
          <div className="admin-form-section">

            <div className="admin-form-section-heading">
              <h2>
                Featured Image
              </h2>

              <p>
                Upload a new image only if
                you want to replace the
                current one.
              </p>
            </div>

            <div className="admin-form-grid">

              <div className="admin-form-group admin-full">

                <label htmlFor="featured-image">
                  Featured Image
                </label>

                <input
                  id="featured-image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFeaturedImageChange
                  }
                />

                {featuredImage ? (
                  <small>
                    New image selected:{" "}
                    {featuredImage.name}
                  </small>
                ) : (
                  <small>
                    Current featured image
                    will be kept.
                  </small>
                )}

              </div>

              {imagePreview && (
                <div className="admin-image-preview admin-full">

                  <p>
                    Featured Image Preview
                  </p>

                  <img
                    src={imagePreview}
                    alt="Blog featured image"
                  />

                </div>
              )}

            </div>

          </div>

          {/* SEO */}
          <div className="admin-form-section">

            <div className="admin-form-section-heading">
              <h2>SEO</h2>

              <p>
                Update the search engine
                information for this blog.
              </p>
            </div>

            <div className="admin-form-grid">

              <div className="admin-form-group">

                <label htmlFor="meta-title">
                  Meta Title *
                </label>

                <input
                  id="meta-title"
                  type="text"
                  value={metaTitle}
                  onChange={(event) =>
                    setMetaTitle(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="admin-form-group">

                <label htmlFor="keywords">
                  Keywords
                </label>

                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(event) =>
                    setKeywords(
                      event.target.value
                    )
                  }
                  placeholder="welding, training, career"
                />

                <small>
                  Separate keywords with commas.
                </small>

              </div>

              <div className="admin-form-group admin-full">

                <label htmlFor="meta-description">
                  Meta Description *
                </label>

                <textarea
                  id="meta-description"
                  rows={4}
                  value={metaDescription}
                  onChange={(event) =>
                    setMetaDescription(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

          </div>

          {/* Description */}
          <div className="admin-form-section">

            <div className="admin-form-section-heading">
              <h2>
                Blog Description
              </h2>

              <p>
                Short description shown in
                blog listings.
              </p>
            </div>

            <div className="admin-form-grid">

              <div className="admin-form-group admin-full">

                <label htmlFor="short-description">
                  Short Description *
                </label>

                <textarea
                  id="short-description"
                  rows={5}
                  value={shortDescription}
                  onChange={(event) =>
                    setShortDescription(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

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

            <div className="admin-form-grid">

              <div className="admin-form-group admin-full">

                <label htmlFor="tags">
                  Tags
                </label>

                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(event) =>
                    setTags(
                      event.target.value
                    )
                  }
                  placeholder="Welding, Training, Career"
                />

                <small>
                  Separate tags with commas.
                </small>

              </div>

            </div>

          </div>

          {/* Blog Content */}
          <div className="admin-form-section">

            <div className="admin-form-section-heading">
              <h2>
                Blog Content
              </h2>

              <p>
                Edit the main content of
                your blog.
              </p>
            </div>

            <div className="custom-blog-editor">

              {/* Toolbar */}
              <div className="custom-editor-toolbar">

                <select
                  defaultValue="p"
                  onChange={(event) =>
                    formatBlock(
                      event.target.value
                    )
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

                <button
                  type="button"
                  title="Bold"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    executeCommand(
                      "bold"
                    )
                  }
                >
                  <strong>B</strong>
                </button>

                <button
                  type="button"
                  title="Italic"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    executeCommand(
                      "italic"
                    )
                  }
                >
                  <em>I</em>
                </button>

                <button
                  type="button"
                  title="Underline"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    executeCommand(
                      "underline"
                    )
                  }
                >
                  <u>U</u>
                </button>

                <span className="editor-divider" />

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

                <button
                  type="button"
                  title="Align Left"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    executeCommand(
                      "justifyLeft"
                    )
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
                    executeCommand(
                      "justifyCenter"
                    )
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
                    executeCommand(
                      "justifyRight"
                    )
                  }
                >
                  ≡
                </button>

                <span className="editor-divider" />

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

                <button
                  type="button"
                  title="Blockquote"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    formatBlock(
                      "blockquote"
                    )
                  }
                >
                  ❝
                </button>

                <button
                  type="button"
                  title="Clear Formatting"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    executeCommand(
                      "removeFormat"
                    )
                  }
                >
                  Tx
                </button>

                <span className="editor-divider" />

                <button
                  type="button"
                  title="Undo"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    executeCommand(
                      "undo"
                    )
                  }
                >
                  ↶
                </button>

                <button
                  type="button"
                  title="Redo"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    executeCommand(
                      "redo"
                    )
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
                onInput={
                  handleEditorInput
                }
                data-placeholder="Write your blog content here..."
              />

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

          {/* Buttons */}
          <div className="admin-form-submit">

            <button
              type="button"
              className="admin-cancel-btn"
              onClick={() =>
                router.push(
                  "/admin/blogs"
                )
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-submit-blog-btn"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Blog"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
