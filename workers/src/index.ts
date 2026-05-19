/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  JWT_SECRET: string;
}

// Utility: Hash SHA-1 for Cloudinary signature
async function sha1(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Utility: Hash SHA-256 for password
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Utility: Create JWT-like token (self-signed token)
async function signToken(username: string, secret: string): Promise<string> {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day validity
  const payload = `${username}:${expiry}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signature = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return btoa(`${payload}:${signature}`);
}

// Utility: Verify token
async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const decoded = atob(token);
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [username, expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr);
    if (Date.now() > expiry) return false;

    const payload = `${username}:${expiry}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const verifyBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const verifyArray = Array.from(new Uint8Array(verifyBuffer));
    const expectedSignature = verifyArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

// Authorization Helper
async function authorize(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  return await verifyToken(token, env.JWT_SECRET);
}

// Cloudinary image deletion helper
async function deleteFromCloudinary(publicId: string, env: Env) {
  if (!publicId || publicId.startsWith("unsplash_")) {
    // Skip actual Cloudinary deletion for unsplash placeholders
    return { result: "ok" };
  }
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureRaw = `public_id=${publicId}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
  const signature = await sha1(signatureRaw);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("api_key", env.CLOUDINARY_API_KEY);
  formData.append("signature", signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );
    return await response.json();
  } catch (err) {
    console.error("Cloudinary destroy failed:", err);
    return { result: "failed", error: String(err) };
  }
}

// Main fetch handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    };

    // Preflight check
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const pathParts = path.split("/").filter(Boolean); // ["api", "news", ...]

    // Basic Routing
    try {
      if (pathParts[0] !== "api") {
        return new Response(JSON.stringify({ error: "Not Found" }), {
          status: 404,
          headers: corsHeaders,
        });
      }

      // -------------------------------------------------------------
      // CATEGORIES ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "categories" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM categories").all();
        return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
      }

      // -------------------------------------------------------------
      // NEWS / ARTICLES ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "news") {
        // GET /api/news (list news with filter, search)
        if (pathParts.length === 2 && method === "GET") {
          const categorySlug = url.searchParams.get("category");
          const search = url.searchParams.get("q");
          const limitStr = url.searchParams.get("limit");
          const limit = limitStr ? parseInt(limitStr) : 20;

          let query = `
            SELECT n.*, c.name as category_name, c.slug as category_slug 
            FROM news n 
            LEFT JOIN categories c ON n.category_id = c.id 
            WHERE 1=1
          `;
          const params: any[] = [];

          if (categorySlug) {
            query += " AND c.slug = ?";
            params.push(categorySlug);
          }

          if (search) {
            query += " AND (n.title LIKE ? OR n.content LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
          }

          query += " ORDER BY n.created_at DESC LIMIT ?";
          params.push(limit);

          const { results } = await env.DB.prepare(query).bind(...params).all();
          return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
        }

        // POST /api/news (create news - Auth required)
        if (pathParts.length === 2 && method === "POST") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const body: any = await request.json();
          const { title, slug, content, image_url, cloudinary_id, category_id, author } = body;

          if (!title || !slug || !content || !author) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const info = await env.DB.prepare(
            `INSERT INTO news (title, slug, content, image_url, cloudinary_id, category_id, author) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(title, slug, content, image_url || null, cloudinary_id || null, category_id || null, author)
            .run();

          return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), {
            status: 201,
            headers: corsHeaders,
          });
        }

        // GET /api/news/:slug (get detail - increment views)
        if (pathParts.length === 3 && method === "GET") {
          const slug = pathParts[2];
          
          // Get the article
          const article: any = await env.DB.prepare(
            `SELECT n.*, c.name as category_name, c.slug as category_slug 
             FROM news n 
             LEFT JOIN categories c ON n.category_id = c.id 
             WHERE n.slug = ?`
          )
            .bind(slug)
            .first();

          if (!article) {
            return new Response(JSON.stringify({ error: "Article not found" }), {
              status: 404,
              headers: corsHeaders,
            });
          }

          // Increment view count in background
          await env.DB.prepare("UPDATE news SET views = views + 1 WHERE id = ?")
            .bind(article.id)
            .run();

          article.views += 1;

          return new Response(JSON.stringify(article), { status: 200, headers: corsHeaders });
        }

        // PUT /api/news/:id (update news - Auth required)
        if (pathParts.length === 3 && method === "PUT") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);
          const body: any = await request.json();
          const { title, slug, content, image_url, cloudinary_id, category_id, author } = body;

          // If the image is updated, we might want to delete the old image from Cloudinary, 
          // but let's keep it simple: if old cloudinary_id is provided and differs from the new one, delete it.
          const oldNews: any = await env.DB.prepare("SELECT cloudinary_id FROM news WHERE id = ?")
            .bind(id)
            .first();

          if (oldNews && oldNews.cloudinary_id && cloudinary_id && oldNews.cloudinary_id !== cloudinary_id) {
            // Delete old image
            await deleteFromCloudinary(oldNews.cloudinary_id, env);
          }

          await env.DB.prepare(
            `UPDATE news 
             SET title = ?, slug = ?, content = ?, image_url = ?, cloudinary_id = ?, category_id = ?, author = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`
          )
            .bind(title, slug, content, image_url || null, cloudinary_id || null, category_id || null, author, id)
            .run();

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        // DELETE /api/news/:id (delete news - Auth required)
        if (pathParts.length === 3 && method === "DELETE") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);

          // Fetch cloudinary_id first to delete from Cloudinary
          const newsItem: any = await env.DB.prepare("SELECT cloudinary_id FROM news WHERE id = ?")
            .bind(id)
            .first();

          if (newsItem && newsItem.cloudinary_id) {
            await deleteFromCloudinary(newsItem.cloudinary_id, env);
          }

          await env.DB.prepare("DELETE FROM news WHERE id = ?").bind(id).run();

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        // GET & POST /api/news/:news_id/comments
        if (pathParts.length === 4 && pathParts[3] === "comments") {
          const newsId = parseInt(pathParts[2]);

          if (method === "GET") {
            const { results } = await env.DB.prepare(
              "SELECT * FROM comments WHERE news_id = ? ORDER BY created_at DESC"
            )
              .bind(newsId)
              .all();
            return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
          }

          if (method === "POST") {
            const body: any = await request.json();
            const { author_name, comment_text } = body;

            if (!author_name || !comment_text) {
              return new Response(JSON.stringify({ error: "Name and comment text are required" }), {
                status: 400,
                headers: corsHeaders,
              });
            }

            const info = await env.DB.prepare(
              "INSERT INTO comments (news_id, author_name, comment_text) VALUES (?, ?, ?)"
            )
              .bind(newsId, author_name, comment_text)
              .run();

            return new Response(
              JSON.stringify({
                success: true,
                comment: {
                  id: info.meta.last_row_id,
                  news_id: newsId,
                  author_name,
                  comment_text,
                  created_at: new Date().toISOString(),
                },
              }),
              { status: 201, headers: corsHeaders }
            );
          }
        }
      }

      // -------------------------------------------------------------
      // ANNOUNCEMENTS ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "announcements") {
        if (pathParts.length === 2 && method === "GET") {
          const { results } = await env.DB.prepare(
            "SELECT * FROM announcements ORDER BY created_at DESC"
          ).all();
          return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
        }

        if (pathParts.length === 2 && method === "POST") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const { title, content } = (await request.json()) as any;
          if (!title || !content) {
            return new Response(JSON.stringify({ error: "Title and content are required" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const info = await env.DB.prepare(
            "INSERT INTO announcements (title, content) VALUES (?, ?)"
          )
            .bind(title, content)
            .run();

          return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), {
            status: 201,
            headers: corsHeaders,
          });
        }

        if (pathParts.length === 3 && method === "PUT") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);
          const { title, content } = (await request.json()) as any;

          await env.DB.prepare(
            "UPDATE announcements SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
          )
            .bind(title, content, id)
            .run();

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        if (pathParts.length === 3 && method === "DELETE") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);
          await env.DB.prepare("DELETE FROM announcements WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      }

      // -------------------------------------------------------------
      // EVENTS / AGENDA ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "events") {
        if (pathParts.length === 2 && method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM events ORDER BY date ASC").all();
          return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
        }

        if (pathParts.length === 2 && method === "POST") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const { title, description, date, location } = (await request.json()) as any;
          if (!title || !description || !date || !location) {
            return new Response(JSON.stringify({ error: "All fields are required" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const info = await env.DB.prepare(
            "INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)"
          )
            .bind(title, description, date, location)
            .run();

          return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), {
            status: 201,
            headers: corsHeaders,
          });
        }

        if (pathParts.length === 3 && method === "PUT") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);
          const { title, description, date, location } = (await request.json()) as any;

          await env.DB.prepare(
            "UPDATE events SET title = ?, description = ?, date = ?, location = ? WHERE id = ?"
          )
            .bind(title, description, date, location, id)
            .run();

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        if (pathParts.length === 3 && method === "DELETE") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);
          await env.DB.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      }

      // -------------------------------------------------------------
      // GURU / STAFF ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "staff") {
        if (pathParts.length === 2 && method === "GET") {
          const { results } = await env.DB.prepare(
            "SELECT * FROM staff ORDER BY order_weight ASC, id ASC"
          ).all();
          return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
        }

        if (pathParts.length === 2 && method === "POST") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const { name, role, photo_url, cloudinary_id, nip, order_weight } = (await request.json()) as any;
          if (!name || !role) {
            return new Response(JSON.stringify({ error: "Name and role are required" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const info = await env.DB.prepare(
            "INSERT INTO staff (name, role, photo_url, cloudinary_id, nip, order_weight) VALUES (?, ?, ?, ?, ?, ?)"
          )
            .bind(name, role, photo_url || null, cloudinary_id || null, nip || null, order_weight || 0)
            .run();

          return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), {
            status: 201,
            headers: corsHeaders,
          });
        }

        if (pathParts.length === 3 && method === "PUT") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);
          const { name, role, photo_url, cloudinary_id, nip, order_weight } = (await request.json()) as any;

          const oldStaff: any = await env.DB.prepare("SELECT cloudinary_id FROM staff WHERE id = ?")
            .bind(id)
            .first();

          if (oldStaff && oldStaff.cloudinary_id && cloudinary_id && oldStaff.cloudinary_id !== cloudinary_id) {
            await deleteFromCloudinary(oldStaff.cloudinary_id, env);
          }

          await env.DB.prepare(
            `UPDATE staff 
             SET name = ?, role = ?, photo_url = ?, cloudinary_id = ?, nip = ?, order_weight = ? 
             WHERE id = ?`
          )
            .bind(name, role, photo_url || null, cloudinary_id || null, nip || null, order_weight || 0, id)
            .run();

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        if (pathParts.length === 3 && method === "DELETE") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);

          const staffItem: any = await env.DB.prepare("SELECT cloudinary_id FROM staff WHERE id = ?")
            .bind(id)
            .first();

          if (staffItem && staffItem.cloudinary_id) {
            await deleteFromCloudinary(staffItem.cloudinary_id, env);
          }

          await env.DB.prepare("DELETE FROM staff WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      }

      // -------------------------------------------------------------
      // GALLERY ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "gallery") {
        if (pathParts.length === 2 && method === "GET") {
          const { results } = await env.DB.prepare(
            "SELECT * FROM gallery ORDER BY created_at DESC"
          ).all();
          return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
        }

        if (pathParts.length === 2 && method === "POST") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const { title, description, image_url, cloudinary_id } = (await request.json()) as any;
          if (!title || !image_url) {
            return new Response(JSON.stringify({ error: "Title and image url are required" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const info = await env.DB.prepare(
            "INSERT INTO gallery (title, description, image_url, cloudinary_id) VALUES (?, ?, ?, ?)"
          )
            .bind(title, description || null, image_url, cloudinary_id || null)
            .run();

          return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), {
            status: 201,
            headers: corsHeaders,
          });
        }

        if (pathParts.length === 3 && method === "DELETE") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const id = parseInt(pathParts[2]);

          const galleryItem: any = await env.DB.prepare("SELECT cloudinary_id FROM gallery WHERE id = ?")
            .bind(id)
            .first();

          if (galleryItem && galleryItem.cloudinary_id) {
            await deleteFromCloudinary(galleryItem.cloudinary_id, env);
          }

          await env.DB.prepare("DELETE FROM gallery WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      }

      // -------------------------------------------------------------
      // ADMIN & AUTH ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "admin") {
        // POST /api/admin/login
        if (pathParts[2] === "login" && method === "POST") {
          const { username, password } = (await request.json()) as any;
          if (!username || !password) {
            return new Response(JSON.stringify({ error: "Username and password required" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const passwordHash = await sha256(password);
          const admin: any = await env.DB.prepare(
            "SELECT * FROM admins WHERE username = ? AND password_hash = ?"
          )
            .bind(username, passwordHash)
            .first();

          if (!admin) {
            return new Response(JSON.stringify({ error: "Invalid username or password" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const token = await signToken(username, env.JWT_SECRET);
          return new Response(JSON.stringify({ success: true, token, username }), {
            status: 200,
            headers: corsHeaders,
          });
        }

        // GET /api/admin/stats (Auth required)
        if (pathParts[2] === "stats" && method === "GET") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const newsCount: any = await env.DB.prepare("SELECT COUNT(*) as count FROM news").first();
          const annCount: any = await env.DB.prepare("SELECT COUNT(*) as count FROM announcements").first();
          const eventCount: any = await env.DB.prepare("SELECT COUNT(*) as count FROM events").first();
          const staffCount: any = await env.DB.prepare("SELECT COUNT(*) as count FROM staff").first();
          const galleryCount: any = await env.DB.prepare("SELECT COUNT(*) as count FROM gallery").first();
          const viewsSum: any = await env.DB.prepare("SELECT SUM(views) as count FROM news").first();

          return new Response(
            JSON.stringify({
              news: newsCount?.count || 0,
              announcements: annCount?.count || 0,
              events: eventCount?.count || 0,
              staff: staffCount?.count || 0,
              gallery: galleryCount?.count || 0,
              views: viewsSum?.count || 0,
            }),
            { status: 200, headers: corsHeaders }
          );
        }

        // POST /api/admin/upload (Auth required - uploads to Cloudinary)
        if (pathParts[2] === "upload" && method === "POST") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const formData = await request.formData();
          const file = formData.get("file") as File;

          if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const timestamp = Math.floor(Date.now() / 1000).toString();
          const signatureRaw = `timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
          const signature = await sha1(signatureRaw);

          // Upload directly to Cloudinary using fetch
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append("file", file);
          cloudinaryFormData.append("timestamp", timestamp);
          cloudinaryFormData.append("api_key", env.CLOUDINARY_API_KEY);
          cloudinaryFormData.append("signature", signature);

          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: cloudinaryFormData,
            }
          );

          const result: any = await cloudinaryRes.json();

          if (result.error) {
            return new Response(JSON.stringify({ error: result.error.message }), {
              status: 500,
              headers: corsHeaders,
            });
          }

          // Return both URL and public_id (cloudinary_id)
          return new Response(
            JSON.stringify({
              url: result.secure_url,
              public_id: result.public_id,
            }),
            { status: 200, headers: corsHeaders }
          );
        }
      }

      // -------------------------------------------------------------
      // SCHOOL PROFILE ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "profile") {
        // GET /api/profile
        if (pathParts.length === 2 && method === "GET") {
          const profile = await env.DB.prepare("SELECT * FROM school_profile WHERE id = 1").first();
          if (!profile) {
            return new Response(JSON.stringify({ error: "Profile not found" }), {
              status: 404,
              headers: corsHeaders,
            });
          }
          return new Response(JSON.stringify(profile), { status: 200, headers: corsHeaders });
        }

        // PUT /api/profile (Auth required)
        if (pathParts.length === 2 && method === "PUT") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: corsHeaders,
            });
          }

          const body: any = await request.json();
          const {
            nama_sekolah, npsn, akreditasi, bentuk_pendidikan, status_sekolah,
            jenjang_pendidikan, sk_pendirian, kurikulum, alamat, sejarah, visi, misi, fasilitas,
            sambutan_nama, sambutan_jabatan, sambutan_foto, sambutan_judul, sambutan_isi
          } = body;

          if (!nama_sekolah || !npsn || !akreditasi || !sambutan_nama || !sambutan_isi) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          await env.DB.prepare(`
            UPDATE school_profile SET
              nama_sekolah = ?, npsn = ?, akreditasi = ?, bentuk_pendidikan = ?, status_sekolah = ?,
              jenjang_pendidikan = ?, sk_pendirian = ?, kurikulum = ?, alamat = ?, sejarah = ?,
              visi = ?, misi = ?, fasilitas = ?,
              sambutan_nama = ?, sambutan_jabatan = ?, sambutan_foto = ?, sambutan_judul = ?, sambutan_isi = ?
            WHERE id = 1
          `).bind(
            nama_sekolah, npsn, akreditasi, bentuk_pendidikan, status_sekolah,
            jenjang_pendidikan, sk_pendirian, kurikulum, alamat, sejarah, visi, misi, fasilitas,
            sambutan_nama, sambutan_jabatan, sambutan_foto, sambutan_judul, sambutan_isi
          ).run();

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      }

      // -------------------------------------------------------------
      // HERO SLIDES ENDPOINTS
      // -------------------------------------------------------------
      if (pathParts[1] === "slides") {
        // GET /api/slides — public
        if (pathParts.length === 2 && method === "GET") {
          const { results } = await env.DB.prepare(
            "SELECT * FROM hero_slides ORDER BY order_weight ASC"
          ).all();
          return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
        }

        // POST /api/slides — Auth required
        if (pathParts.length === 2 && method === "POST") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
          }
          const body: any = await request.json();
          const { image_url, cloudinary_id, badge, title, description, order_weight } = body;
          if (!image_url || !badge || !title || !description) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
          }
          const info = await env.DB.prepare(
            "INSERT INTO hero_slides (image_url, cloudinary_id, badge, title, description, order_weight) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(image_url, cloudinary_id || null, badge, title, description, order_weight || 0).run();
          return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), { status: 201, headers: corsHeaders });
        }

        // PUT /api/slides/:id — Auth required
        if (pathParts.length === 3 && method === "PUT") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
          }
          const id = parseInt(pathParts[2]);
          const body: any = await request.json();
          const { image_url, cloudinary_id, badge, title, description, order_weight } = body;
          if (!image_url || !badge || !title || !description) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
          }
          await env.DB.prepare(
            "UPDATE hero_slides SET image_url=?, cloudinary_id=?, badge=?, title=?, description=?, order_weight=? WHERE id=?"
          ).bind(image_url, cloudinary_id || null, badge, title, description, order_weight || 0, id).run();
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }

        // DELETE /api/slides/:id — Auth required
        if (pathParts.length === 3 && method === "DELETE") {
          if (!(await authorize(request, env))) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
          }
          const id = parseInt(pathParts[2]);
          const slide: any = await env.DB.prepare("SELECT cloudinary_id FROM hero_slides WHERE id=?").bind(id).first();
          if (slide?.cloudinary_id) {
            await deleteFromCloudinary(slide.cloudinary_id, env);
          }
          await env.DB.prepare("DELETE FROM hero_slides WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      }

      // If no endpoint matches
      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        status: 404,
        headers: corsHeaders,
      });

    } catch (error: any) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
