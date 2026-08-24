"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Article,
  Check,
  CloudArrowUp,
  Database,
  Eye,
  FileText,
  Gear,
  ImageSquare,
  ListBullets,
  MagnifyingGlass,
  Monitor,
  Plus,
  Quotes,
  SignIn,
  SignOut,
  Sparkle,
  SquaresFour,
  TextB,
  TextH,
  TextItalic,
  Trash,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  FormEvent,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { culturalEvents } from "@/data/cultural-events";
import { restaurants } from "@/data/restaurants";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

type AdminView = "overview" | "editor" | "objects" | "media" | "settings";
type AccessMode = "checking" | "local" | "signed-out" | "forbidden" | "authorized";
type ArticleStatus = "draft" | "review" | "scheduled" | "published";

type LibraryItem = {
  id: string;
  type: "Kultur" | "Mat";
  title: string;
  category: string;
  area: string;
  meta: string;
  description: string;
  sourceLabel: string;
};

type EditorialDraft = {
  id: string;
  title: string;
  kicker: string;
  slug: string;
  dek: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  status: ArticleStatus;
  publishAt: string;
  selectedItems: string[];
  updatedAt: string;
};

type Notice = { tone: "success" | "warning"; message: string } | null;

const LOCAL_DRAFTS_KEY = "staden:admin-editorial-drafts:v1";
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const starterDraft: EditorialDraft = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "Takbarerna som förlänger Göteborgskvällen",
  kicker: "STADEN väljer · Mat",
  slug: "takbarerna-som-forlanger-goteborgskvallen",
  dek: "Från älvutsikt till gömda terrasser — sex höjdlägen för en lång sensommarkväll.",
  body:
    "## Börja ovanför Brunnsparken\n\nGöteborg blir en annan stad några våningar upp. Här samlar redaktionen platser där utsikten är mer än en kuliss och maten är värd resan i sig.\n\n> Gå strax före solnedgång och lämna plats för en spontan omväg.\n\n- Boka bord när vädret är klart\n- Kontrollera terrassens öppettider samma dag\n- Spara två alternativ i samma stadsdel",
  imageUrl: "/media/guide-takbarer-goteborg.png",
  imageAlt: "Kvällsljus över en takbar i centrala Göteborg",
  imageCaption: "Göteborg från ovan. Foto: STADENs bildbank.",
  status: "draft",
  publishAt: "2026-08-27T16:00",
  selectedItems: ["restaurant:johanna-rooftop", "restaurant:above"],
  updatedAt: new Date().toISOString(),
};

const navigation: Array<{
  id: AdminView;
  label: string;
  shortLabel: string;
  icon: typeof SquaresFour;
}> = [
  { id: "overview", label: "Översikt", shortLabel: "Översikt", icon: SquaresFour },
  { id: "editor", label: "Redaktion", shortLabel: "Skriv", icon: Article },
  { id: "objects", label: "Objektbank", shortLabel: "Objekt", icon: Database },
  { id: "media", label: "Media", shortLabel: "Media", icon: ImageSquare },
  { id: "settings", label: "Inställningar", shortLabel: "System", icon: Gear },
];

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function isEditorialDraft(value: unknown): value is EditorialDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<EditorialDraft>;
  return (
    typeof draft.id === "string" &&
    typeof draft.title === "string" &&
    typeof draft.body === "string" &&
    Array.isArray(draft.selectedItems)
  );
}

function loadLocalDrafts() {
  try {
    const stored = window.localStorage.getItem(LOCAL_DRAFTS_KEY);
    if (!stored) return [starterDraft];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(isEditorialDraft)
      ? parsed
      : [starterDraft];
  } catch {
    return [starterDraft];
  }
}

function saveLocalDrafts(drafts: EditorialDraft[]) {
  window.localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(drafts));
}

function safeUploadName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLocaleLowerCase("sv-SE") ?? "jpg";
  const base = fileName.replace(/\.[^.]+$/, "");
  return `${slugify(base) || "bild"}.${extension.replace(/[^a-z0-9]/g, "")}`;
}

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Nyss";
  }
}

function toLocalDateTimeInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

async function loadRemoteDrafts() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("editorial_posts")
    .select(`
      id,
      title,
      kicker,
      slug,
      dek,
      body_markdown,
      hero_image_url,
      image_alt,
      image_caption,
      status,
      publish_at,
      updated_at,
      editorial_post_items ( item_type, item_id, position )
    `)
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    kicker: row.kicker,
    slug: row.slug,
    dek: row.dek,
    body: row.body_markdown,
    imageUrl: row.hero_image_url ?? "",
    imageAlt: row.image_alt,
    imageCaption: row.image_caption ?? "",
    status: row.status as ArticleStatus,
    publishAt: toLocalDateTimeInput(row.publish_at),
    selectedItems: [...(row.editorial_post_items ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((item) => `${item.item_type}:${item.item_id}`),
    updatedAt: row.updated_at,
  })) satisfies EditorialDraft[];
}

function InlineMarkdown({ text }: { text: string }) {
  const fragments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return fragments.map((fragment, index) => {
    if (fragment.startsWith("**") && fragment.endsWith("**")) {
      return <strong key={`${fragment}-${index}`}>{fragment.slice(2, -2)}</strong>;
    }
    if (fragment.startsWith("*") && fragment.endsWith("*")) {
      return <em key={`${fragment}-${index}`}>{fragment.slice(1, -1)}</em>;
    }
    return fragment;
  });
}

function MarkdownPreview({ body }: { body: string }) {
  const lines = body.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`list-${nodes.length}`}>
        {listItems.map((item) => (
          <li key={item}><InlineMarkdown text={item} /></li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      return;
    }
    flushList();
    if (!line.trim()) return;
    if (line.startsWith("## ")) {
      nodes.push(<h2 key={index}><InlineMarkdown text={line.slice(3)} /></h2>);
    } else if (line.startsWith("# ")) {
      nodes.push(<h2 key={index}><InlineMarkdown text={line.slice(2)} /></h2>);
    } else if (line.startsWith("> ")) {
      nodes.push(<blockquote key={index}><InlineMarkdown text={line.slice(2)} /></blockquote>);
    } else {
      nodes.push(<p key={index}><InlineMarkdown text={line} /></p>);
    }
  });
  flushList();

  return <div className="admin-story-body">{nodes}</div>;
}

export function AdminWorkspace() {
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [accessMode, setAccessMode] = useState<AccessMode>("checking");
  const [authPanelOpen, setAuthPanelOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [drafts, setDrafts] = useState<EditorialDraft[]>([starterDraft]);
  const [draft, setDraft] = useState<EditorialDraft>(starterDraft);
  const [search, setSearch] = useState("");
  const [objectFilter, setObjectFilter] = useState<"Alla" | "Kultur" | "Mat">("Alla");
  const [notice, setNotice] = useState<Notice>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const adminCanvasRef = useRef<HTMLDivElement>(null);
  const authDialogRef = useRef<HTMLElement>(null);
  const authTriggerRef = useRef<HTMLButtonElement | null>(null);
  const hasChangedAdminViewRef = useRef(false);
  const deferredSearch = useDeferredValue(search);

  const library = useMemo<LibraryItem[]>(() => {
    const culture: LibraryItem[] = culturalEvents.map((event) => ({
      id: `culture:${event.id}`,
      type: "Kultur",
      title: event.title,
      category: event.category,
      area: event.area,
      meta: [event.dateLabel, event.time, event.venue].filter(Boolean).join(" · "),
      description: event.description,
      sourceLabel: event.sourceLabel,
    }));
    const food: LibraryItem[] = restaurants.map((restaurant) => ({
      id: `restaurant:${restaurant.id}`,
      type: "Mat",
      title: restaurant.name,
      category: restaurant.cuisine,
      area: restaurant.area,
      meta: [restaurant.format, "€".repeat(restaurant.priceTier)].join(" · "),
      description: restaurant.description,
      sourceLabel: restaurant.sourceLabel,
    }));
    return [...culture, ...food];
  }, []);

  const libraryById = useMemo(
    () => new Map(library.map((item) => [item.id, item])),
    [library],
  );

  const filteredLibrary = useMemo(() => {
    const query = deferredSearch.trim().toLocaleLowerCase("sv-SE");
    return library.filter((item) => {
      if (objectFilter !== "Alla" && item.type !== objectFilter) return false;
      if (!query) return true;
      return [item.title, item.category, item.area, item.description]
        .join(" ")
        .toLocaleLowerCase("sv-SE")
        .includes(query);
    });
  }, [deferredSearch, library, objectFilter]);

  const selectedObjects = draft.selectedItems
    .map((id) => libraryById.get(id))
    .filter((item): item is LibraryItem => Boolean(item));

  useEffect(() => {
    let live = true;
    const initializeWorkspace = async () => {
      await Promise.resolve();
      if (!live) return;

      const localDrafts = loadLocalDrafts();
      setDrafts(localDrafts);
      setDraft(localDrafts[0] ?? starterDraft);

      const isLocal = ["127.0.0.1", "localhost"].includes(window.location.hostname);
      if (!isSupabaseConfigured) {
        setAccessMode(isLocal ? "local" : "signed-out");
        return;
      }

      const { data, error } = await getSupabaseBrowserClient().auth.getUser();
      if (!live) return;
      if (!error && data.user?.app_metadata?.role === "admin") {
        setAccessMode("authorized");
        try {
          const remoteDrafts = await loadRemoteDrafts();
          if (!live || remoteDrafts.length === 0) return;
          const remoteIds = new Set(remoteDrafts.map((item) => item.id));
          const mergedDrafts = [
            ...remoteDrafts,
            ...localDrafts.filter((item) => !remoteIds.has(item.id)),
          ];
          setDrafts(mergedDrafts);
          setDraft(mergedDrafts[0]);
        } catch {
          setNotice({
            tone: "warning",
            message: "Adminsessionen är giltig, men molnutkasten kunde inte hämtas.",
          });
        }
      } else if (data.user) {
        setAccessMode(isLocal ? "local" : "forbidden");
      } else {
        setAccessMode(isLocal ? "local" : "signed-out");
      }
    };

    void initializeWorkspace();

    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!authPanelOpen) return;

    const previousOverflow = document.body.style.overflow;
    const focusReturnTarget = authTriggerRef.current;
    const focusFrame = window.requestAnimationFrame(() => {
      authDialogRef.current?.querySelector<HTMLInputElement>('input[type="email"]')?.focus();
    });

    function handleAuthDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setAuthPanelOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = authDialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleAuthDialogKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleAuthDialogKeyDown);
      focusReturnTarget?.focus();
    };
  }, [authPanelOpen]);

  useEffect(() => {
    const activeLabel = navigation.find((item) => item.id === activeView)?.label ?? "Redaktionen";
    document.title = `${activeLabel} — STADEN Redaktionen`;

    if (!hasChangedAdminViewRef.current) {
      hasChangedAdminViewRef.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    const focusFrame = window.requestAnimationFrame(() => {
      adminCanvasRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [activeView]);

  const selectAdminView = (view: AdminView) => {
    setActiveView(view);
  };

  const openAuthPanel = (trigger: HTMLButtonElement) => {
    authTriggerRef.current = trigger;
    setAuthPanelOpen(true);
  };

  const updateDraft = <Key extends keyof EditorialDraft>(
    key: Key,
    value: EditorialDraft[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateTitle = (title: string) => {
    setDraft((current) => ({
      ...current,
      title,
      slug: current.slug === slugify(current.title) || !current.slug
        ? slugify(title)
        : current.slug,
    }));
  };

  const addObject = (item: LibraryItem) => {
    if (draft.selectedItems.includes(item.id)) return;
    updateDraft("selectedItems", [...draft.selectedItems, item.id]);
    setNotice({ tone: "success", message: `${item.title} lades till i urvalet.` });
  };

  const removeObject = (id: string) => {
    updateDraft("selectedItems", draft.selectedItems.filter((itemId) => itemId !== id));
  };

  const moveObject = (index: number, direction: -1 | 1) => {
    const next = [...draft.selectedItems];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateDraft("selectedItems", next);
  };

  const insertFormatting = (prefix: string, suffix = "") => {
    const field = bodyRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = draft.body.slice(start, end);
    const replacement = `${prefix}${selected || "Text"}${suffix}`;
    updateDraft("body", `${draft.body.slice(0, start)}${replacement}${draft.body.slice(end)}`);
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "Text").length);
    });
  };

  const handleImage = (file: File | undefined) => {
    setNotice(null);
    if (!file) return;
    if (!IMAGE_TYPES.has(file.type)) {
      setNotice({ tone: "warning", message: "Välj JPEG, PNG, WebP eller AVIF." });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setNotice({ tone: "warning", message: "Bilden får vara högst 5 MB." });
      return;
    }
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (!draft.imageAlt) updateDraft("imageAlt", file.name.replace(/[-_]/g, " ").replace(/\.[^.]+$/, ""));
  };

  const persistLocalDraft = (nextDraft: EditorialDraft) => {
    const persistedDraft = {
      ...nextDraft,
      imageUrl: imagePreview.startsWith("blob:") ? nextDraft.imageUrl : nextDraft.imageUrl,
    };
    const nextDrafts = [
      persistedDraft,
      ...drafts.filter((item) => item.id !== persistedDraft.id),
    ].slice(0, 30);
    setDrafts(nextDrafts);
    saveLocalDrafts(nextDrafts);
  };

  const saveDraft = async (statusOverride?: ArticleStatus) => {
    setNotice(null);
    if (!draft.title.trim() || !draft.body.trim()) {
      setNotice({ tone: "warning", message: "Rubrik och brödtext behöver fyllas i." });
      return;
    }
    if ((imagePreview || draft.imageUrl) && !draft.imageAlt.trim()) {
      setNotice({ tone: "warning", message: "Skriv en alt-text för huvudbilden." });
      return;
    }

    setSaving(true);
    const nextDraft: EditorialDraft = {
      ...draft,
      status: statusOverride ?? draft.status,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (accessMode !== "authorized") {
        persistLocalDraft(nextDraft);
        setDraft(nextDraft);
        setNotice({ tone: "success", message: "Utkastet sparades lokalt i den här webbläsaren." });
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || userData.user?.app_metadata?.role !== "admin") {
        throw new Error("Din session saknar adminbehörighet.");
      }

      let imageUrl = nextDraft.imageUrl;
      let imagePath: string | null = null;
      if (imageFile) {
        imagePath = `${userData.user.id}/${crypto.randomUUID()}-${safeUploadName(imageFile.name)}`;
        const { error: uploadError } = await supabase.storage
          .from("editorial-media")
          .upload(imagePath, imageFile, {
            cacheControl: "3600",
            contentType: imageFile.type,
            upsert: false,
          });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from("editorial-media").getPublicUrl(imagePath).data.publicUrl;
      }

      const publishAt = nextDraft.status === "published" && !nextDraft.publishAt
        ? new Date().toISOString()
        : nextDraft.publishAt
          ? new Date(nextDraft.publishAt).toISOString()
          : null;

      const { data: post, error: postError } = await supabase
        .from("editorial_posts")
        .upsert({
          id: nextDraft.id,
          slug: nextDraft.slug,
          title: nextDraft.title,
          kicker: nextDraft.kicker,
          dek: nextDraft.dek,
          body_markdown: nextDraft.body,
          hero_image_url: imageUrl || null,
          hero_image_path: imagePath,
          image_alt: nextDraft.imageAlt,
          image_caption: nextDraft.imageCaption || null,
          status: nextDraft.status,
          publish_at: publishAt,
          created_by: userData.user.id,
          updated_at: nextDraft.updatedAt,
        }, { onConflict: "id" })
        .select("id")
        .single();
      if (postError) throw postError;

      const { error: deleteError } = await supabase
        .from("editorial_post_items")
        .delete()
        .eq("post_id", post.id);
      if (deleteError) throw deleteError;

      if (nextDraft.selectedItems.length > 0) {
        const { error: itemsError } = await supabase
          .from("editorial_post_items")
          .insert(nextDraft.selectedItems.map((itemId, position) => {
            const [itemType, ...idParts] = itemId.split(":");
            return {
              post_id: post.id,
              item_type: itemType,
              item_id: idParts.join(":"),
              position,
            };
          }));
        if (itemsError) throw itemsError;
      }

      const saved = { ...nextDraft, imageUrl };
      persistLocalDraft(saved);
      setDraft(saved);
      setImageFile(null);
      setImagePreview("");
      setNotice({
        tone: "success",
        message: saved.status === "published"
          ? "Inlägget är publicerat via Supabase."
          : "Utkastet synkroniserades med Supabase.",
      });
    } catch (error) {
      setNotice({
        tone: "warning",
        message: error instanceof Error ? error.message : "Kunde inte spara inlägget.",
      });
    } finally {
      setSaving(false);
    }
  };

  const createDraft = () => {
    const fresh: EditorialDraft = {
      ...starterDraft,
      id: crypto.randomUUID(),
      title: "",
      kicker: "STADEN väljer · Göteborg",
      slug: "",
      dek: "",
      body: "## Sätt scenen\n\nBörja skriva här.",
      imageUrl: "",
      imageAlt: "",
      imageCaption: "",
      status: "draft",
      publishAt: "",
      selectedItems: [],
      updatedAt: new Date().toISOString(),
    };
    setDraft(fresh);
    setImageFile(null);
    setImagePreview("");
    setNotice(null);
    selectAdminView("editor");
  };

  const openDraft = (item: EditorialDraft) => {
    setDraft(item);
    setImageFile(null);
    setImagePreview("");
    setNotice(null);
    selectAdminView("editor");
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase-miljövariablerna saknas.");
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user?.app_metadata?.role !== "admin") {
        await supabase.auth.signOut();
        setAccessMode("forbidden");
        throw new Error("Kontot saknar rollen admin i app_metadata.");
      }
      setAccessMode("authorized");
      const remoteDrafts = await loadRemoteDrafts();
      if (remoteDrafts.length > 0) {
        const localDrafts = loadLocalDrafts();
        const remoteIds = new Set(remoteDrafts.map((item) => item.id));
        const mergedDrafts = [
          ...remoteDrafts,
          ...localDrafts.filter((item) => !remoteIds.has(item.id)),
        ];
        setDrafts(mergedDrafts);
        setDraft(mergedDrafts[0]);
      }
      setAuthPanelOpen(false);
      setPassword("");
      setNotice({ tone: "success", message: "Adminsessionen är ansluten till Supabase." });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Inloggningen misslyckades.");
    } finally {
      setAuthBusy(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) await getSupabaseBrowserClient().auth.signOut();
    const isLocal = ["127.0.0.1", "localhost"].includes(window.location.hostname);
    setAccessMode(isLocal ? "local" : "signed-out");
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <section className="admin-title-row">
        <div>
          <p className="admin-kicker">Redaktionen · 23 augusti 2026</p>
          <h1>God morgon,<br /><em>Göteborg väntar.</em></h1>
        </div>
        <p className="admin-title-row__intro">
          Samla stadens råmaterial, välj vad som förtjänar en berättelse och publicera med ett redaktionellt öga.
        </p>
      </section>

      <section className="admin-stat-grid" aria-label="Innehållsöversikt">
        <article className="admin-stat admin-stat--signal">
          <span>01 · Redaktion</span>
          <strong>{drafts.length.toString().padStart(2, "0")}</strong>
          <p>Aktiva utkast i arbetsytan</p>
          <button type="button" onClick={createDraft}>Nytt inlägg <ArrowRight size={18} /></button>
        </article>
        <article className="admin-stat admin-stat--paper">
          <span>02 · Kultur</span>
          <strong>{culturalEvents.length}</strong>
          <p>Objekt redo för kurering</p>
          <button type="button" onClick={() => { setObjectFilter("Kultur"); selectAdminView("objects"); }}>Öppna objektbank <ArrowRight size={18} /></button>
        </article>
        <article className="admin-stat admin-stat--ink">
          <span>03 · Mat</span>
          <strong>{restaurants.length}</strong>
          <p>Restauranger i katalogen</p>
          <button type="button" onClick={() => { setObjectFilter("Mat"); selectAdminView("objects"); }}>Utforska restauranger <ArrowRight size={18} /></button>
        </article>
      </section>

      <section className="admin-recent">
        <div className="admin-section-head">
          <div>
            <p className="admin-kicker">På redaktionsbordet</p>
            <h2>Senast arbetat med</h2>
          </div>
          <button type="button" className="admin-text-button" onClick={() => selectAdminView("editor")}>Öppna redaktionen <ArrowRight size={16} /></button>
        </div>
        <div className="admin-draft-list">
          {drafts.slice(0, 4).map((item, index) => (
            <button type="button" className="admin-draft-row" key={item.id} onClick={() => openDraft(item)}>
              <span>{(index + 1).toString().padStart(2, "0")}</span>
              <span><strong>{item.title || "Namnlöst utkast"}</strong><small>{item.kicker}</small></span>
              <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
              <time>{formatTime(item.updatedAt)}</time>
              <ArrowRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const renderObjectSearch = (compact = false) => (
    <section className={`admin-object-search${compact ? " is-compact" : ""}`}>
      <div className="admin-section-head">
        <div>
          <p className="admin-kicker">STADENs katalog</p>
          <h2>{compact ? "Bygg ditt urval" : "Hitta objekt till berättelsen"}</h2>
        </div>
        <span className="admin-count">{filteredLibrary.length} träffar</span>
      </div>
      <div className="admin-search-controls">
        <label className="admin-search-field">
          <MagnifyingGlass size={20} aria-hidden="true" />
          <span className="sr-only">Sök objekt</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Sök restaurang, scen, område…"
          />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Rensa sökning"><X size={17} /></button>}
        </label>
        <div className="admin-filter-group" aria-label="Filtrera objekttyp">
          {(["Alla", "Kultur", "Mat"] as const).map((filter) => (
            <button
              type="button"
              key={filter}
              aria-pressed={objectFilter === filter}
              onClick={() => setObjectFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-object-results">
        {filteredLibrary.slice(0, compact ? 6 : 18).map((item) => {
          const isSelected = draft.selectedItems.includes(item.id);
          return (
            <article className="admin-object-row" key={item.id}>
              <span className={`admin-object-type admin-object-type--${item.type.toLocaleLowerCase("sv-SE")}`}>{item.type}</span>
              <div>
                <p>{item.category} · {item.area}</p>
                <h3>{item.title}</h3>
                <span>{item.meta}</span>
                {!compact && <small>{item.description}</small>}
              </div>
              <button
                type="button"
                className={isSelected ? "is-selected" : ""}
                onClick={() => isSelected ? removeObject(item.id) : addObject(item)}
                aria-label={isSelected ? `Ta bort ${item.title}` : `Lägg till ${item.title}`}
              >
                {isSelected ? <Check size={18} weight="bold" /> : <Plus size={18} />}
                <span>{isSelected ? "Vald" : "Lägg till"}</span>
              </button>
            </article>
          );
        })}
        {filteredLibrary.length === 0 && (
          <div className="admin-empty"><MagnifyingGlass size={28} /><p>Inga objekt matchar sökningen.</p></div>
        )}
      </div>
    </section>
  );

  const renderEditor = () => (
    <div className="admin-editor-view">
      <header className="admin-editor-head">
        <div>
          <p className="admin-kicker">Redaktion · Ny berättelse</p>
          <h1>Komponera ett<br /><em>inlägg.</em></h1>
        </div>
        <div className="admin-editor-action-stack">
        <div className="admin-editor-actions">
          <label>
            <span>Status</span>
            <select value={draft.status} onChange={(event) => updateDraft("status", event.target.value as ArticleStatus)}>
              <option value="draft">Utkast</option>
              <option value="review">För granskning</option>
              <option value="scheduled">Schemalagd</option>
              <option value="published" disabled>Publicerad · endast via Publicera</option>
            </select>
          </label>
          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => void saveDraft(draft.status === "published" ? "draft" : draft.status)}
            disabled={saving}
          >
            <FileText size={18} /> {saving ? "Sparar…" : "Spara utkast"}
          </button>
          <button
            type="button"
            className="admin-primary-button"
            onClick={() => void saveDraft("published")}
            disabled={saving || accessMode !== "authorized"}
            title={accessMode !== "authorized" ? "Logga in med en Supabase-adminroll för att publicera" : undefined}
          >
            <CloudArrowUp size={19} /> Publicera
          </button>
        </div>
        {accessMode !== "authorized" ? (
          <p className="admin-publish-note">
            Publicering kräver en ansluten Supabase-admin. Utkast kan fortfarande sparas lokalt.
          </p>
        ) : null}
        </div>
      </header>

      {notice && (
        <div className={`admin-notice admin-notice--${notice.tone}`} role="status">
          {notice.tone === "success" ? <Check size={18} weight="bold" /> : <WarningCircle size={18} />}
          <span>{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Stäng meddelande"><X size={17} /></button>
        </div>
      )}

      <div className="admin-composer-grid">
        <div className="admin-composer-fields">
          <section className="admin-field-section">
            <div className="admin-field-section__head"><span>01</span><h2>Berättelsen</h2></div>
            <label className="admin-field">
              <span>Överrubrik</span>
              <input value={draft.kicker} onChange={(event) => updateDraft("kicker", event.target.value)} maxLength={80} />
            </label>
            <label className="admin-field admin-field--title">
              <span>Rubrik</span>
              <textarea value={draft.title} onChange={(event) => updateTitle(event.target.value)} rows={3} maxLength={120} placeholder="Sätt en rubrik som öppnar staden" />
              <small>{draft.title.length}/120</small>
            </label>
            <label className="admin-field">
              <span>Ingress</span>
              <textarea value={draft.dek} onChange={(event) => updateDraft("dek", event.target.value)} rows={3} maxLength={240} placeholder="Varför ska någon läsa vidare?" />
            </label>
            <label className="admin-field">
              <span>Slug</span>
              <div className="admin-slug"><span>/redaktion/</span><input value={draft.slug} onChange={(event) => updateDraft("slug", slugify(event.target.value))} /></div>
            </label>
          </section>

          <section className="admin-field-section">
            <div className="admin-field-section__head"><span>02</span><h2>Text</h2></div>
            <div className="admin-editor-toolbar" aria-label="Textformatering">
              <button type="button" onClick={() => insertFormatting("## ")} aria-label="Rubrik"><TextH size={18} /></button>
              <button type="button" onClick={() => insertFormatting("**", "**")} aria-label="Fetstil"><TextB size={18} /></button>
              <button type="button" onClick={() => insertFormatting("*", "*")} aria-label="Kursiv"><TextItalic size={18} /></button>
              <button type="button" onClick={() => insertFormatting("> ")} aria-label="Citat"><Quotes size={18} /></button>
              <button type="button" onClick={() => insertFormatting("- ")} aria-label="Punktlista"><ListBullets size={18} /></button>
              <span>Markdown · sparas när du väljer Spara utkast</span>
            </div>
            <label className="admin-field">
              <span className="sr-only">Brödtext</span>
              <textarea ref={bodyRef} className="admin-body-editor" value={draft.body} onChange={(event) => updateDraft("body", event.target.value)} rows={16} spellCheck="true" />
            </label>
          </section>

          <section className="admin-field-section">
            <div className="admin-field-section__head"><span>03</span><h2>Huvudbild</h2></div>
            <div className="admin-upload-zone">
              <ImageSquare size={32} />
              <div><strong>Dra in känslan</strong><span>JPEG, PNG, WebP eller AVIF · max 5 MB</span></div>
              <label className="admin-upload-button"><UploadSimple size={18} /> Välj bild<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => handleImage(event.target.files?.[0])} /></label>
            </div>
            <div className="admin-media-fields">
              <label className="admin-field"><span>Alt-text</span><input value={draft.imageAlt} onChange={(event) => updateDraft("imageAlt", event.target.value)} placeholder="Beskriv motivet för skärmläsare" /></label>
              <label className="admin-field"><span>Bildtext / källa</span><input value={draft.imageCaption} onChange={(event) => updateDraft("imageCaption", event.target.value)} placeholder="Fotograf eller källa" /></label>
            </div>
          </section>

          <section className="admin-field-section">
            <div className="admin-field-section__head"><span>04</span><h2>Publicering</h2></div>
            <div className="admin-media-fields">
              <label className="admin-field"><span>Datum och tid</span><input type="datetime-local" value={draft.publishAt} onChange={(event) => updateDraft("publishAt", event.target.value)} /></label>
              <div className="admin-field admin-field--static">
                <span>Kanal</span>
                <strong>Startsidan + Redaktion</strong>
                <small>Fler kanaler kopplas efter nästa databasversion.</small>
              </div>
            </div>
          </section>
        </div>

        <aside className="admin-preview-panel">
          <div className="admin-preview-panel__head"><span><Eye size={17} /> Liveförhandsvisning</span><span>Mobil · Artikel</span></div>
          <article className="admin-story-preview">
            <div className="admin-story-preview__image">
              {(imagePreview || draft.imageUrl) ? (
                <Image src={imagePreview || draft.imageUrl} alt={draft.imageAlt || "Förhandsvisning"} fill sizes="(max-width: 900px) 100vw, 420px" unoptimized />
              ) : (
                <div className="admin-image-empty"><ImageSquare size={42} /><span>Huvudbild</span></div>
              )}
            </div>
            <div className="admin-story-preview__copy">
              <p>{draft.kicker || "STADEN väljer"}</p>
              <h2>{draft.title || "Din rubrik kommer att leva här"}</h2>
              <p>{draft.dek || "En kort ingress gör läsaren nyfiken på resten av berättelsen."}</p>
              {draft.imageCaption && <small>{draft.imageCaption}</small>}
              <MarkdownPreview body={draft.body} />
            </div>
            {selectedObjects.length > 0 && (
              <div className="admin-story-preview__objects">
                <span>I DEN HÄR GUIDEN · {selectedObjects.length}</span>
                {selectedObjects.slice(0, 3).map((item, index) => (
                  <div key={item.id}><strong>{(index + 1).toString().padStart(2, "0")}</strong><span><b>{item.title}</b><small>{item.category} · {item.area}</small></span></div>
                ))}
              </div>
            )}
          </article>

          <div className="admin-selected-panel">
            <div><span>Objekt i inlägget</span><strong>{selectedObjects.length.toString().padStart(2, "0")}</strong></div>
            {selectedObjects.map((item, index) => (
              <div className="admin-selected-item" key={item.id}>
                <span>{(index + 1).toString().padStart(2, "0")}</span>
                <p><strong>{item.title}</strong><small>{item.type} · {item.area}</small></p>
                <button type="button" onClick={() => moveObject(index, -1)} disabled={index === 0} aria-label={`Flytta ${item.title} upp`}><ArrowUp size={15} /></button>
                <button type="button" onClick={() => moveObject(index, 1)} disabled={index === selectedObjects.length - 1} aria-label={`Flytta ${item.title} ned`}><ArrowDown size={15} /></button>
                <button type="button" onClick={() => removeObject(item.id)} aria-label={`Ta bort ${item.title}`}><Trash size={15} /></button>
              </div>
            ))}
            {selectedObjects.length === 0 && <p className="admin-selected-empty">Sök och lägg till platser, restauranger eller evenemang.</p>}
          </div>
        </aside>
      </div>

      {renderObjectSearch(true)}
    </div>
  );

  const renderMedia = () => {
    const assets = [
      { src: "/media/guide-takbarer-goteborg.png", label: "Takbarer i Göteborg", type: "Mat · Guide" },
      { src: "/media/guide-barnfamilj-goteborg.png", label: "Mat för barnfamiljer", type: "Mat · Guide" },
      { src: "/media/guide-forsta-dejten-goteborg.png", label: "Första dejten", type: "Mat · Guide" },
      { src: "/media/jazz-under-traden.png", label: "Jazz under träden", type: "Kultur · Evenemang" },
    ];
    return (
      <div className="admin-media-view">
        <div className="admin-title-row admin-title-row--compact">
          <div><p className="admin-kicker">Bildbank</p><h1>Media med<br /><em>en blick.</em></h1></div>
          <label className="admin-primary-button"><UploadSimple size={19} /> Ladda upp<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => handleImage(event.target.files?.[0])} /></label>
        </div>
        <div className="admin-media-grid">
          {assets.map((asset, index) => (
            <article key={asset.src}>
              <div><Image src={asset.src} alt={asset.label} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
              <span>{(index + 1).toString().padStart(2, "0")} · {asset.type}</span>
              <h2>{asset.label}</h2>
              <button type="button" onClick={() => { updateDraft("imageUrl", asset.src); updateDraft("imageAlt", asset.label); selectAdminView("editor"); }}>Använd i inlägg <ArrowRight size={16} /></button>
            </article>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="admin-settings-view">
      <div className="admin-title-row admin-title-row--compact">
        <div><p className="admin-kicker">System</p><h1>Publicera<br /><em>med kontroll.</em></h1></div>
      </div>
      <div className="admin-settings-grid">
        <section>
          <div className="admin-setting-icon"><Database size={25} /></div>
          <p className="admin-kicker">Databas & auth</p>
          <h2>Supabase</h2>
          <p>Projektet är kopplat till <code>rucwlpzrumxejvhwazat</code>. Tabellen, lagringen och adminrollen skyddas av RLS.</p>
          <div className="admin-health-row"><span className={isSupabaseConfigured ? "is-ok" : ""} />{isSupabaseConfigured ? "Publik anslutning konfigurerad" : "Miljövariabler saknas"}</div>
          {accessMode === "authorized" ? (
            <button type="button" className="admin-secondary-button" onClick={() => void signOut()}><SignOut size={18} /> Logga ut</button>
          ) : (
            <button type="button" className="admin-secondary-button" onClick={(event) => openAuthPanel(event.currentTarget)}><SignIn size={18} /> Anslut admin</button>
          )}
        </section>
        <section>
          <div className="admin-setting-icon"><Monitor size={25} /></div>
          <p className="admin-kicker">Förhandsläge</p>
          <h2>Lokal arbetsyta</h2>
          <p>På localhost kan redaktionen testas utan molnskrivning. Utkast sparas endast i den här webbläsaren; publicering är avstängd.</p>
          <div className="admin-health-row"><span className={accessMode === "local" ? "is-warn" : "is-ok"} />{accessMode === "local" ? "Lokalt läge aktivt" : "Supabase-läge aktivt"}</div>
        </section>
        <section>
          <div className="admin-setting-icon"><Sparkle size={25} /></div>
          <p className="admin-kicker">Automation</p>
          <h2>Daglig kurering</h2>
          <p>Redaktionen är förberedd för inkommande objekt. AI-förslag ska landa som granskningsbara utkast — aldrig självpubliceras.</p>
          <div className="admin-health-row"><span className="is-warn" />Kö väntar på automation</div>
        </section>
      </div>
    </div>
  );

  const view = activeView === "overview"
    ? renderOverview()
    : activeView === "editor"
      ? renderEditor()
      : activeView === "objects"
        ? <div className="admin-library-view">{renderObjectSearch()}</div>
        : activeView === "media"
          ? renderMedia()
          : renderSettings();
  const activeViewLabel = navigation.find((item) => item.id === activeView)?.label ?? "Redaktionen";
  const accessLabel = accessMode === "authorized" ? "Supabase adminläge" : "Lokalt förhandsläge";

  const mustSignIn = accessMode === "signed-out" || accessMode === "forbidden";

  if (accessMode === "checking") {
    return (
      <main className="admin-access-screen">
        <Link href="/" className="admin-access-brand">STADEN <span>/ REDAKTION</span></Link>
        <div className="admin-access-loader"><span /><p>Kontrollerar adminåtkomst</p></div>
      </main>
    );
  }

  if (mustSignIn) {
    return (
      <main className="admin-access-screen">
        <Link href="/" className="admin-access-brand">STADEN <span>/ REDAKTION</span></Link>
        <section className="admin-login-card">
          <p className="admin-kicker">Skyddad arbetsyta</p>
          <h1>Staden börjar<br /><em>här inne.</em></h1>
          <p>Logga in med ett konto som har adminroll i Supabase för att öppna redaktionen.</p>
          {accessMode === "forbidden" && <div className="admin-login-warning"><WarningCircle size={18} />Kontot saknar adminbehörighet.</div>}
          <form onSubmit={handleSignIn}>
            <label><span>E-post</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label><span>Lösenord</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label>
            {authError && <p className="admin-auth-error" role="alert">{authError}</p>}
            <button type="submit" className="admin-primary-button" disabled={authBusy}>{authBusy ? "Kontrollerar…" : "Öppna redaktionen"}<ArrowRight size={18} /></button>
          </form>
          <Link href="/"><ArrowLeft size={17} /> Tillbaka till STADEN</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar" aria-hidden={authPanelOpen || undefined} inert={authPanelOpen ? true : undefined}>
        <div className="admin-brand"><Link href="/">STADEN</Link><span>/ REDAKTION</span></div>
        <nav aria-label="Adminnavigation">
          {navigation.map(({ id, label, icon: Icon }, index) => (
            <button key={id} type="button" className={activeView === id ? "is-active" : ""} onClick={() => selectAdminView(id)} aria-current={activeView === id ? "page" : undefined}>
              <span>{(index + 1).toString().padStart(2, "0")}</span><Icon size={19} /><strong>{label}</strong>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <div className={`admin-access-badge admin-access-badge--${accessMode}`}><span />{accessMode === "authorized" ? "Supabase · Admin" : "Lokalt förhandsläge"}</div>
          {accessMode === "local" ? (
            <button type="button" onClick={(event) => openAuthPanel(event.currentTarget)}><SignIn size={17} /> Anslut admin</button>
          ) : (
            <button type="button" onClick={() => void signOut()}><SignOut size={17} /> Logga ut</button>
          )}
          <Link href="/"><ArrowLeft size={17} /> Öppna STADEN</Link>
        </div>
      </aside>

      <header className="admin-mobile-head" aria-hidden={authPanelOpen || undefined} inert={authPanelOpen ? true : undefined}>
        <div className="admin-brand"><Link href="/">STADEN</Link><span>/ REDAKTION</span></div>
        <span className={`admin-mobile-status admin-mobile-status--${accessMode}`} aria-hidden="true" />
        <span className="sr-only" role="status">{accessLabel}</span>
      </header>

      <div
        ref={adminCanvasRef}
        className="admin-canvas"
        role="region"
        aria-label={activeViewLabel}
        aria-hidden={authPanelOpen || undefined}
        inert={authPanelOpen ? true : undefined}
        tabIndex={-1}
      >
        <span className="sr-only" role="status" aria-live="polite">Visar {activeViewLabel}</span>
        {view}
      </div>

      <nav className="admin-mobile-nav" aria-label="Adminnavigation mobil" aria-hidden={authPanelOpen || undefined} inert={authPanelOpen ? true : undefined}>
        {navigation.map(({ id, shortLabel, icon: Icon }) => (
          <button type="button" key={id} className={activeView === id ? "is-active" : ""} onClick={() => selectAdminView(id)} aria-current={activeView === id ? "page" : undefined}><Icon size={20} /><span>{shortLabel}</span></button>
        ))}
      </nav>

      {authPanelOpen && (
        <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setAuthPanelOpen(false); }}>
          <section ref={authDialogRef} className="admin-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-auth-title" tabIndex={-1}>
            <button type="button" className="admin-dialog-close" onClick={() => setAuthPanelOpen(false)} aria-label="Stäng"><X size={20} /></button>
            <p className="admin-kicker">Supabase · Säker publicering</p>
            <h2 id="admin-auth-title">Anslut din adminsession.</h2>
            <p>UI-kontrollen hjälper redaktören, men RLS och rollen i <code>app_metadata</code> avgör alltid om data får skrivas.</p>
            <form onSubmit={handleSignIn}>
              <label><span>E-post</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label><span>Lösenord</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label>
              {authError && <p className="admin-auth-error" role="alert">{authError}</p>}
              <button type="submit" className="admin-primary-button" disabled={authBusy}>{authBusy ? "Kontrollerar…" : "Anslut Supabase"}<ArrowRight size={18} /></button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
