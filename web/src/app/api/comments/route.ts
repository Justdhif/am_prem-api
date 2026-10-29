import { NextRequest, NextResponse } from "next/server";
import {
  getAllCommentsTree,
  createCommentInDb,
  formatRelativeTime,
  CommentNode,
} from "@/lib/commentsDb";
import { sendFonnteCommentNotification } from "@/lib/fonnte";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPage = searchParams.get("page");
    const rawLimit = searchParams.get("limit");

    const page = Math.max(1, rawPage ? parseInt(rawPage, 10) || 1 : 1);
    const limit = Math.max(1, rawLimit ? parseInt(rawLimit, 10) || 5 : 5);

    const fullTree = await getAllCommentsTree();

    const countAll = (nodes: CommentNode[]): number => {
      let count = 0;
      for (const node of nodes) {
        count += 1;
        if (node.replies && node.replies.length > 0) {
          count += countAll(node.replies);
        }
      }
      return count;
    };

    const totalRootComments = fullTree.length;
    const totalComments = countAll(fullTree);
    const totalPages = Math.max(1, Math.ceil(totalRootComments / limit));
    const validPage = Math.min(page, totalPages);

    const startIndex = (validPage - 1) * limit;
    const paginatedRoots = fullTree.slice(startIndex, startIndex + limit);

    const attachFormattedTime = (nodes: CommentNode[]): CommentNode[] => {
      return nodes.map((node) => ({
        ...node,
        formattedTime: formatRelativeTime(new Date(node.createdAt)),
        replies: attachFormattedTime(node.replies || []),
      }));
    };

    const formattedComments = attachFormattedTime(paginatedRoots);

    return NextResponse.json({
      success: true,
      page: validPage,
      limit,
      totalRootComments,
      totalComments,
      totalPages,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
      comments: formattedComments,
    });
  } catch (err: any) {
    console.error("[Comments GET] Error:", err?.message || err);
    return NextResponse.json(
      { success: false, message: "Gagal memuat komentar.", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawContent = (body.content || "").trim();

    if (!rawContent) {
      return NextResponse.json(
        { success: false, message: "Isi komentar tidak boleh kosong." },
        { status: 400 }
      );
    }

    if (rawContent.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Komentar maksimal 1000 karakter." },
        { status: 400 }
      );
    }

    const isAnonymous = Boolean(body.isAnonymous);
    let displayName = (body.name || "").trim();

    if (isAnonymous || !displayName) {
      displayName = "Anonim";
    } else if (displayName.length > 50) {
      displayName = displayName.substring(0, 50);
    }

    // Sanitasi sederhana
    const sanitizedContent = rawContent
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const created = await createCommentInDb({
      parentId: body.parentId || null,
      name: displayName,
      isAnonymous,
      content: sanitizedContent,
    });

    const avatarUrl = isAnonymous
      ? "https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true"
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=00e599&color=0d121f&bold=true`;

    // Kirim notifikasi WhatsApp via Fonnte secara aman
    try {
      await sendFonnteCommentNotification({
        name: displayName,
        isAnonymous,
        content: sanitizedContent,
        parentId: created.parentId,
        createdAt: created.createdAt,
      });
    } catch (notifErr: any) {
      console.warn("[Comments POST] Fonnte notif warning:", notifErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Komentar berhasil dipublikasikan!",
      data: {
        id: created.id,
        parentId: created.parentId,
        name: created.name,
        isAnonymous: created.isAnonymous,
        content: created.content,
        avatarUrl,
        createdAt: created.createdAt,
      },
    });
  } catch (err: any) {
    console.error("[Comments POST] Error:", err?.message || err);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim komentar.", error: err.message },
      { status: 500 }
    );
  }
}
