"use client";

import {
  BookmarkSimple,
  Buildings,
  Check,
  ForkKnife,
  FolderSimplePlus,
  GearSix,
  MapPin,
  PencilSimple,
  Plus,
  Trash,
  X,
} from "@phosphor-icons/react";
import type React from "react";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { culturalEvents, type CulturalEvent } from "@/data/cultural-events";
import { restaurants, type Restaurant } from "@/data/restaurants";
import { MapLink } from "@/components/map-link";

const SAVED_EVENTS_KEY = "staden:saved-cultural-events";
const SAVED_EVENTS_CHANGED = "staden:saved-cultural-events-changed";
const SAVED_RESTAURANTS_KEY = "staden:saved-restaurants";
const SAVED_RESTAURANTS_CHANGED = "staden:saved-restaurants-changed";
const SAVED_LISTS_KEY = "staden:saved-pocket-lists";
const SAVED_LISTS_CHANGED = "staden:saved-pocket-lists-changed";
const EMPTY_ARRAY_SNAPSHOT = "[]";
const EMPTY_LISTS_SNAPSHOT = '{"version":1,"lists":[],"assignments":[]}';
const MAX_RAW_SNAPSHOT_LENGTH = 100_000;
const MAX_SAVED_ITEMS_PER_KIND = 200;
const MAX_LISTS = 24;
const MAX_LIST_NAME_LENGTH = 48;
const MAX_ASSIGNMENTS = MAX_SAVED_ITEMS_PER_KIND * 2;

const eventById = new Map(culturalEvents.map((event) => [event.id, event]));
const restaurantById = new Map(
  restaurants.map((restaurant) => [restaurant.id, restaurant]),
);
const validEventIds = new Set(eventById.keys());
const validRestaurantIds = new Set(restaurantById.keys());
const validItemKeys = new Set([
  ...culturalEvents.map((event) => `culture:${event.id}`),
  ...restaurants.map((restaurant) => `restaurant:${restaurant.id}`),
]);

type SavedList = {
  id: string;
  name: string;
};

type ListAssignment = {
  itemKey: string;
  listId: string;
};

type PocketState = {
  lists: SavedList[];
  assignments: ListAssignment[];
};

type SavedPocketItem =
  | { itemKey: string; kind: "culture"; item: CulturalEvent }
  | { itemKey: string; kind: "restaurant"; item: Restaurant };

export type SavedPocketProps = {
  open?: boolean;
  onClose?: () => void;
  dialogRef?: React.RefObject<HTMLElement | null>;
  embedded?: boolean;
  settingsOpen?: boolean;
  settingsButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onOpenSettings?: (trigger: HTMLButtonElement) => void;
};

function readStorage(key: string, fallback: string) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function subscribeToSavedPocket(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SAVED_EVENTS_CHANGED, onStoreChange);
  window.addEventListener(SAVED_RESTAURANTS_CHANGED, onStoreChange);
  window.addEventListener(SAVED_LISTS_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SAVED_EVENTS_CHANGED, onStoreChange);
    window.removeEventListener(SAVED_RESTAURANTS_CHANGED, onStoreChange);
    window.removeEventListener(SAVED_LISTS_CHANGED, onStoreChange);
  };
}

function getSavedEventsSnapshot() {
  return readStorage(SAVED_EVENTS_KEY, EMPTY_ARRAY_SNAPSHOT);
}

function getSavedRestaurantsSnapshot() {
  return readStorage(SAVED_RESTAURANTS_KEY, EMPTY_ARRAY_SNAPSHOT);
}

function getSavedListsSnapshot() {
  return readStorage(SAVED_LISTS_KEY, EMPTY_LISTS_SNAPSHOT);
}

function getEmptyArraySnapshot() {
  return EMPTY_ARRAY_SNAPSHOT;
}

function getEmptyListsSnapshot() {
  return EMPTY_LISTS_SNAPSHOT;
}

function parseSavedIds(snapshot: string, validIds: ReadonlySet<string>) {
  if (snapshot.length > MAX_RAW_SNAPSHOT_LENGTH) return [];

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) return [];

    const uniqueIds = new Set<string>();
    for (const value of parsed) {
      if (
        typeof value === "string" &&
        value.length <= 160 &&
        validIds.has(value)
      ) {
        uniqueIds.add(value);
      }
      if (uniqueIds.size >= MAX_SAVED_ITEMS_PER_KIND) break;
    }

    return [...uniqueIds];
  } catch {
    return [];
  }
}

function normalizeListName(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_LIST_NAME_LENGTH);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePocketState(snapshot: string): PocketState {
  if (snapshot.length > MAX_RAW_SNAPSHOT_LENGTH) {
    return { lists: [], assignments: [] };
  }

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!isRecord(parsed)) return { lists: [], assignments: [] };

    const rawLists = Array.isArray(parsed.lists) ? parsed.lists : [];
    const lists: SavedList[] = [];
    const seenListIds = new Set<string>();

    for (const candidate of rawLists) {
      if (!isRecord(candidate)) continue;
      const id = candidate.id;
      const name =
        typeof candidate.name === "string"
          ? normalizeListName(candidate.name)
          : "";

      if (
        typeof id !== "string" ||
        id.length < 3 ||
        id.length > 80 ||
        !/^list-[a-z0-9-]+$/i.test(id) ||
        !name ||
        seenListIds.has(id)
      ) {
        continue;
      }

      lists.push({ id, name });
      seenListIds.add(id);
      if (lists.length >= MAX_LISTS) break;
    }

    const rawAssignments = Array.isArray(parsed.assignments)
      ? parsed.assignments
      : [];
    const assignments: ListAssignment[] = [];
    const seenItemKeys = new Set<string>();

    for (const candidate of rawAssignments) {
      if (!isRecord(candidate)) continue;
      const { itemKey, listId } = candidate;

      if (
        typeof itemKey !== "string" ||
        typeof listId !== "string" ||
        !validItemKeys.has(itemKey) ||
        !seenListIds.has(listId) ||
        seenItemKeys.has(itemKey)
      ) {
        continue;
      }

      assignments.push({ itemKey, listId });
      seenItemKeys.add(itemKey);
      if (assignments.length >= MAX_ASSIGNMENTS) break;
    }

    return { lists, assignments };
  } catch {
    return { lists: [], assignments: [] };
  }
}

function writeStorage(key: string, value: unknown, changedEvent: string) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(changedEvent));
    return true;
  } catch {
    return false;
  }
}

function createListId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `list-${crypto.randomUUID()}`;
  }

  return `list-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function itemTitle(savedItem: SavedPocketItem) {
  return savedItem.kind === "culture"
    ? savedItem.item.title
    : savedItem.item.name;
}

export function SavedPocket({
  open = false,
  onClose,
  dialogRef,
  embedded = false,
  settingsOpen = false,
  settingsButtonRef,
  onOpenSettings,
}: SavedPocketProps) {
  const [newListName, setNewListName] = useState("");
  const [listError, setListError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [pendingDeleteListId, setPendingDeleteListId] = useState<string | null>(null);
  const savedEventsSnapshot = useSyncExternalStore(
    subscribeToSavedPocket,
    getSavedEventsSnapshot,
    getEmptyArraySnapshot,
  );
  const savedRestaurantsSnapshot = useSyncExternalStore(
    subscribeToSavedPocket,
    getSavedRestaurantsSnapshot,
    getEmptyArraySnapshot,
  );
  const savedListsSnapshot = useSyncExternalStore(
    subscribeToSavedPocket,
    getSavedListsSnapshot,
    getEmptyListsSnapshot,
  );

  const savedEventIds = useMemo(
    () => parseSavedIds(savedEventsSnapshot, validEventIds),
    [savedEventsSnapshot],
  );
  const savedRestaurantIds = useMemo(
    () =>
      parseSavedIds(savedRestaurantsSnapshot, validRestaurantIds),
    [savedRestaurantsSnapshot],
  );
  const pocketState = useMemo(
    () => parsePocketState(savedListsSnapshot),
    [savedListsSnapshot],
  );
  const assignmentByItemKey = useMemo(
    () =>
      new Map(
        pocketState.assignments.map(({ itemKey, listId }) => [itemKey, listId]),
      ),
    [pocketState.assignments],
  );
  const selectedListId =
    activeListId !== null &&
    pocketState.lists.some((list) => list.id === activeListId)
      ? activeListId
      : null;
  const selectedList = selectedListId
    ? pocketState.lists.find((list) => list.id === selectedListId) ?? null
    : null;
  const savedItems = useMemo<SavedPocketItem[]>(() => {
    const events: SavedPocketItem[] = savedEventIds.flatMap((id) => {
      const item = eventById.get(id);
      return item ? [{ itemKey: `culture:${id}`, kind: "culture", item }] : [];
    });
    const food: SavedPocketItem[] = savedRestaurantIds.flatMap((id) => {
      const item = restaurantById.get(id);
      return item
        ? [{ itemKey: `restaurant:${id}`, kind: "restaurant", item }]
        : [];
    });

    return [...events, ...food];
  }, [savedEventIds, savedRestaurantIds]);
  const visibleItems = useMemo(
    () =>
      selectedListId === null
        ? savedItems
        : savedItems.filter(
            (savedItem) =>
              assignmentByItemKey.get(savedItem.itemKey) === selectedListId,
          ),
    [assignmentByItemKey, savedItems, selectedListId],
  );

  useEffect(() => {
    if (embedded || !open) return;

    const focusReturnTarget =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef?.current;
      const focusable = dialog?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!dialog || !focusable?.length) {
        event.preventDefault();
        dialog?.focus();
        return;
      }

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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      focusReturnTarget?.focus();
    };
  }, [dialogRef, embedded, onClose, open]);

  function savePocketState(nextState: PocketState) {
    return writeStorage(
      SAVED_LISTS_KEY,
      { version: 1, ...nextState },
      SAVED_LISTS_CHANGED,
    );
  }

  function createList(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = normalizeListName(newListName);

    if (!name) {
      setListError("Ge listan ett namn.");
      return;
    }
    if (pocketState.lists.length >= MAX_LISTS) {
      setListError(`Du kan skapa högst ${MAX_LISTS} listor.`);
      return;
    }
    if (
      pocketState.lists.some(
        (list) =>
          list.name.toLocaleLowerCase("sv-SE") ===
          name.toLocaleLowerCase("sv-SE"),
      )
    ) {
      setListError("Det finns redan en lista med det namnet.");
      return;
    }

    const list = { id: createListId(), name };
    if (
      savePocketState({
        ...pocketState,
        lists: [...pocketState.lists, list],
      })
    ) {
      setNewListName("");
      setListError("");
      setIsCreateOpen(false);
      setActiveListId(list.id);
    } else {
      setListError("Listan kunde inte sparas i den här webbläsaren.");
    }
  }

  function assignItem(itemKey: string, listId: string) {
    const assignments = pocketState.assignments.filter(
      (assignment) => assignment.itemKey !== itemKey,
    );

    if (listId && pocketState.lists.some((list) => list.id === listId)) {
      assignments.push({ itemKey, listId });
    }

    savePocketState({ ...pocketState, assignments });
  }

  function selectList(listId: string | null) {
    setActiveListId(listId);
    setEditingListId(null);
    setEditingListName("");
    setRenameError("");
    setPendingDeleteListId(null);
  }

  function deleteSelectedList() {
    if (!selectedListId) return;

    savePocketState({
      lists: pocketState.lists.filter((list) => list.id !== selectedListId),
      assignments: pocketState.assignments.filter(
        (assignment) => assignment.listId !== selectedListId,
      ),
    });
    setActiveListId(null);
    setEditingListId(null);
    setEditingListName("");
    setRenameError("");
    setPendingDeleteListId(null);
  }

  function beginRenameSelectedList() {
    if (!selectedListId) return;
    const selected = pocketState.lists.find((list) => list.id === selectedListId);
    if (!selected) return;
    setEditingListId(selected.id);
    setEditingListName(selected.name);
    setRenameError("");
  }

  function renameSelectedList(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingListId) return;
    const name = normalizeListName(editingListName);

    if (!name) {
      setRenameError("Ge listan ett namn.");
      return;
    }
    if (
      pocketState.lists.some(
        (list) =>
          list.id !== editingListId &&
          list.name.toLocaleLowerCase("sv-SE") === name.toLocaleLowerCase("sv-SE"),
      )
    ) {
      setRenameError("Det finns redan en lista med det namnet.");
      return;
    }

    if (
      savePocketState({
        ...pocketState,
        lists: pocketState.lists.map((list) =>
          list.id === editingListId ? { ...list, name } : list,
        ),
      })
    ) {
      setEditingListId(null);
      setEditingListName("");
      setRenameError("");
    } else {
      setRenameError("Namnet kunde inte sparas i den här webbläsaren.");
    }
  }

  function removeSavedItem(savedItem: SavedPocketItem) {
    if (savedItem.kind === "culture") {
      writeStorage(
        SAVED_EVENTS_KEY,
        savedEventIds.filter((id) => id !== savedItem.item.id),
        SAVED_EVENTS_CHANGED,
      );
    } else {
      writeStorage(
        SAVED_RESTAURANTS_KEY,
        savedRestaurantIds.filter((id) => id !== savedItem.item.id),
        SAVED_RESTAURANTS_CHANGED,
      );
    }

    savePocketState({
      ...pocketState,
      assignments: pocketState.assignments.filter(
        (assignment) => assignment.itemKey !== savedItem.itemKey,
      ),
    });
  }

  if (!embedded && !open) return null;

  return (
    <div
      className={embedded ? "saved-pocket-page" : "saved-pocket-backdrop"}
      role={embedded ? undefined : "presentation"}
      onMouseDown={(event) => {
        if (!embedded && event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        ref={embedded ? undefined : dialogRef}
        className={`saved-pocket-sheet${embedded ? " saved-pocket-sheet--page" : ""}`}
        role={embedded ? undefined : "dialog"}
        aria-modal={embedded ? undefined : "true"}
        aria-labelledby="saved-pocket-title"
        aria-describedby="saved-pocket-summary"
        tabIndex={embedded ? undefined : -1}
      >
        <header className={`saved-pocket-header${embedded ? " saved-pocket-header--page" : ""}`}>
          <div>
            <p className="saved-pocket-kicker">
              {embedded ? "PROFIL · DIN STADEN" : "DIN STADEN"}
            </p>
            <h2 id="saved-pocket-title">
              {embedded ? (
                <>Din stad,<br /><em>dina listor.</em></>
              ) : (
                "Fickan"
              )}
            </h2>
            <p id="saved-pocket-summary">
              {savedItems.length} {savedItems.length === 1 ? "sparat objekt" : "sparade objekt"} · {pocketState.lists.length} {pocketState.lists.length === 1 ? "egen lista" : "egna listor"}
            </p>
          </div>
          {embedded ? (
            <button
              ref={settingsButtonRef}
              className="saved-pocket-settings"
              type="button"
              aria-label="Öppna inställningar"
              aria-expanded={settingsOpen}
              onClick={(event) => onOpenSettings?.(event.currentTarget)}
            >
              <GearSix aria-hidden="true" size={23} />
            </button>
          ) : (
            <button
              className="saved-pocket-close"
              type="button"
              aria-label="Stäng Fickan"
              autoFocus
              onClick={onClose}
            >
              <X aria-hidden="true" size={22} />
            </button>
          )}
        </header>

        <section className="saved-pocket-lists" aria-labelledby="list-title">
          <div className="saved-pocket-lists-head">
            <div className="saved-pocket-section-heading">
              <FolderSimplePlus aria-hidden="true" size={20} />
              <div>
                <h3 id="list-title">Mina listor</h3>
                <p>Samla favoriter för en kväll, helg eller utflykt.</p>
              </div>
            </div>
            <button
              className="saved-pocket-create-trigger"
              type="button"
              aria-controls="saved-pocket-create-form"
              aria-expanded={isCreateOpen}
              disabled={pocketState.lists.length >= MAX_LISTS}
              onClick={() => {
                setIsCreateOpen((value) => !value);
                setListError("");
              }}
            >
              {isCreateOpen ? <X aria-hidden="true" size={17} /> : <Plus aria-hidden="true" size={17} />}
              {isCreateOpen ? "Stäng" : "Ny lista"}
            </button>
          </div>

          {isCreateOpen ? (
            <form
              id="saved-pocket-create-form"
              className="saved-pocket-create"
              onSubmit={createList}
            >
              <label htmlFor="saved-pocket-list-name">Namn på den nya listan</label>
              <div>
                <input
                  id="saved-pocket-list-name"
                  type="text"
                  value={newListName}
                  maxLength={MAX_LIST_NAME_LENGTH}
                  autoComplete="off"
                  autoFocus
                  placeholder="Till exempel Första dejten"
                  aria-describedby={listError ? "saved-pocket-list-error" : undefined}
                  aria-invalid={Boolean(listError)}
                  onChange={(event) => {
                    setNewListName(event.target.value);
                    if (listError) setListError("");
                  }}
                />
                <button type="submit">Skapa lista</button>
              </div>
              {listError ? (
                <p id="saved-pocket-list-error" className="saved-pocket-error" role="alert">
                  {listError}
                </p>
              ) : null}
            </form>
          ) : null}

          <div className="saved-pocket-list-tabs" role="group" aria-label="Filtrera sparat på lista">
            <button
              type="button"
              aria-pressed={selectedListId === null}
              onClick={() => selectList(null)}
            >
              <span className="saved-pocket-list-tab-copy">
                <strong>Alla sparade</strong>
                <small>Översikt</small>
              </span>
              <b>{savedItems.length}</b>
            </button>
            {pocketState.lists.map((list) => {
              const count = savedItems.filter(
                (savedItem) =>
                  assignmentByItemKey.get(savedItem.itemKey) === list.id,
              ).length;

              return (
                <button
                  type="button"
                  aria-pressed={selectedListId === list.id}
                  onClick={() => selectList(list.id)}
                  key={list.id}
                >
                  <span className="saved-pocket-list-tab-copy">
                    <strong>{list.name}</strong>
                    <small>Egen lista</small>
                  </span>
                  <b>{count}</b>
                </button>
              );
            })}
          </div>

          {selectedListId ? (
          <div className="saved-pocket-list-manager" aria-live="polite">
            <div className="saved-pocket-list-manager__copy">
              <p>{selectedList ? "Aktiv lista" : "Översikt"}</p>
              <h4>{selectedList?.name ?? "Alla sparade"}</h4>
              <span>
                {visibleItems.length} {visibleItems.length === 1 ? "sparat objekt" : "sparade objekt"}
              </span>
            </div>

            {selectedListId && editingListId === selectedListId ? (
              <form className="saved-pocket-rename" onSubmit={renameSelectedList}>
                <label htmlFor="saved-pocket-rename-list">Byt namn på listan</label>
                <div>
                  <input
                    id="saved-pocket-rename-list"
                    type="text"
                    value={editingListName}
                    maxLength={MAX_LIST_NAME_LENGTH}
                    autoComplete="off"
                    autoFocus
                    aria-invalid={Boolean(renameError)}
                    aria-describedby={renameError ? "saved-pocket-rename-error" : undefined}
                    onChange={(event) => {
                      setEditingListName(event.target.value);
                      if (renameError) setRenameError("");
                    }}
                  />
                  <button type="submit" aria-label="Spara nytt listnamn"><Check aria-hidden="true" size={17} /></button>
                  <button
                    type="button"
                    aria-label="Avbryt namnbyte"
                    onClick={() => {
                      setEditingListId(null);
                      setEditingListName("");
                      setRenameError("");
                    }}
                  >
                    <X aria-hidden="true" size={17} />
                  </button>
                </div>
                {renameError ? <p id="saved-pocket-rename-error" className="saved-pocket-error" role="alert">{renameError}</p> : null}
              </form>
            ) : selectedListId && pendingDeleteListId === selectedListId ? (
              <div className="saved-pocket-delete-confirmation" role="status">
                <p>
                  Ta bort <strong>{selectedList?.name}</strong>? Objekten ligger kvar under Alla sparade.
                </p>
                <div>
                  <button type="button" onClick={deleteSelectedList}>
                    <Trash aria-hidden="true" size={16} />
                    Ja, ta bort
                  </button>
                  <button type="button" onClick={() => setPendingDeleteListId(null)}>
                    Avbryt
                  </button>
                </div>
              </div>
            ) : selectedListId ? (
              <div className="saved-pocket-list-actions">
                <button type="button" onClick={beginRenameSelectedList}>
                  <PencilSimple aria-hidden="true" size={16} />
                  Byt namn
                </button>
                <button type="button" onClick={() => setPendingDeleteListId(selectedListId)}>
                  <Trash aria-hidden="true" size={16} />
                  Ta bort
                </button>
              </div>
            ) : null}
          </div>
          ) : null}
        </section>

        <section className="saved-pocket-content" aria-labelledby="saved-items-title">
          <div className="saved-pocket-section-heading">
            <BookmarkSimple aria-hidden="true" size={20} />
            <div>
              <h3 id="saved-items-title">
                Platser och händelser
              </h3>
              <p aria-live="polite">
                {selectedList ? `${visibleItems.length} i ${selectedList.name}` : `${visibleItems.length} totalt`}
              </p>
            </div>
          </div>

          {visibleItems.length ? (
            <ul className="saved-pocket-items">
              {visibleItems.map((savedItem) => {
                const isCulture = savedItem.kind === "culture";
                const metadata = isCulture
                  ? savedItem.item.dateLabel
                  : savedItem.item.cuisine;
                const mapQuery = isCulture
                  ? [savedItem.item.venue, savedItem.item.area, "Göteborg"].join(", ")
                  : [savedItem.item.address, savedItem.item.area, "Göteborg"]
                      .filter(Boolean)
                      .join(", ");
                const mapText = isCulture
                  ? `${savedItem.item.venue} · ${savedItem.item.area}`
                  : savedItem.item.address;
                const typeLabel = isCulture ? "Kultur" : "Mat";

                return (
                  <li key={savedItem.itemKey}>
                    <div className="saved-pocket-item-icon" aria-hidden="true">
                      {isCulture ? <Buildings size={21} /> : <ForkKnife size={21} />}
                    </div>
                    <div className="saved-pocket-item-copy">
                      <p>{typeLabel}</p>
                      <h4>{itemTitle(savedItem)}</h4>
                      <span>{metadata}</span>
                      <MapLink
                        className="saved-pocket-item-map"
                        query={mapQuery}
                        label={itemTitle(savedItem)}
                      >
                        <MapPin aria-hidden="true" size={15} weight="bold" />
                        <span>{mapText} · Karta</span>
                      </MapLink>
                    </div>
                    <div className="saved-pocket-item-actions">
                      <label htmlFor={`saved-list-${savedItem.itemKey}`}>
                        Flytta till lista
                      </label>
                      <select
                        id={`saved-list-${savedItem.itemKey}`}
                        value={assignmentByItemKey.get(savedItem.itemKey) ?? ""}
                        onChange={(event) =>
                          assignItem(savedItem.itemKey, event.target.value)
                        }
                      >
                        <option value="">Utan lista</option>
                        {pocketState.lists.map((list) => (
                          <option value={list.id} key={list.id}>
                            {list.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        aria-label={`Ta bort ${itemTitle(savedItem)} från sparat`}
                        onClick={() => removeSavedItem(savedItem)}
                      >
                        <Trash aria-hidden="true" size={17} />
                        Ta bort
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="saved-pocket-empty">
              <BookmarkSimple aria-hidden="true" size={34} />
              <h4>{savedItems.length ? "Listan väntar på sitt första val." : "Fickan är tom."}</h4>
              <p>
                {savedItems.length
                  ? "Använd Flytta till lista på ett sparat objekt för att lägga det här."
                  : "Spara kultur och restauranger så samlas de här."}
              </p>
            </div>
          )}
        </section>
      </section>

      <style jsx>{`
        .saved-pocket-page {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          padding: 54px var(--mobile-gutter, 22px) 72px;
        }

        .saved-pocket-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(8, 8, 8, 0.62);
        }

        .saved-pocket-sheet {
          width: 100%;
          max-height: min(94svh, 920px);
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 24px 18px max(34px, env(safe-area-inset-bottom));
          color: var(--ink, #11110f);
          background: var(--paper-raised, #f4f1e9);
          border: 1px solid var(--ink, #11110f);
          outline: none;
        }

        .saved-pocket-sheet--page {
          max-height: none;
          padding: 0;
          overflow: visible;
          background: transparent;
          border: 0;
        }

        .saved-pocket-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line, rgba(17, 17, 15, 0.2));
        }

        .saved-pocket-header > div {
          min-width: 0;
        }

        .saved-pocket-kicker,
        .saved-pocket-item-copy > p {
          margin: 0 0 7px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 750;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .saved-pocket-header h2 {
          margin: 0;
          font-family: var(--story-font), Georgia, serif;
          font-size: clamp(3.2rem, 16vw, 5.2rem);
          font-weight: 500;
          letter-spacing: var(--story-spacing, -0.055em);
          line-height: 0.83;
          overflow-wrap: anywhere;
        }

        .saved-pocket-header p:last-child {
          margin: 18px 0 0;
          color: var(--muted, #626057);
          font-size: 0.8125rem;
        }

        .saved-pocket-header--page {
          min-height: clamp(240px, 30svh, 300px);
          padding-top: 22px;
        }

        .saved-pocket-header--page h2 {
          max-width: 7ch;
          font-family: var(--font-geist-sans), Arial, sans-serif;
          font-size: clamp(4rem, 17vw, 7.4rem);
          font-weight: 620;
          letter-spacing: -0.085em;
          line-height: 0.82;
        }

        .saved-pocket-header--page h2 em {
          color: var(--signal, #ff4f1f);
          font-family: var(--font-editorial-serif), Georgia, serif;
          font-weight: 400;
        }

        .saved-pocket-close {
          display: grid;
          flex: 0 0 46px;
          width: 46px;
          height: 46px;
          place-items: center;
          color: inherit;
          background: transparent;
          border: 1px solid currentColor;
        }

        .saved-pocket-settings {
          display: grid;
          flex: 0 0 50px;
          width: 50px;
          height: 50px;
          place-items: center;
          color: inherit;
          background: transparent;
          border: 1px solid currentColor;
          border-radius: 50%;
        }

        .saved-pocket-lists,
        .saved-pocket-content {
          padding: 24px 0;
          border-bottom: 1px solid var(--line, rgba(17, 17, 15, 0.2));
        }

        .saved-pocket-content {
          border-bottom: 0;
        }

        .saved-pocket-section-heading {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          gap: 11px;
          align-items: start;
          margin-bottom: 17px;
        }

        .saved-pocket-section-heading h3,
        .saved-pocket-section-heading p {
          margin: 0;
        }

        .saved-pocket-section-heading h3 {
          font-size: 0.95rem;
          letter-spacing: -0.02em;
        }

        .saved-pocket-section-heading p {
          margin-top: 4px;
          color: var(--muted, #626057);
          font-size: 0.8125rem;
          line-height: 1.45;
        }

        .saved-pocket-lists-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 16px;
          align-items: start;
        }

        .saved-pocket-lists-head .saved-pocket-section-heading {
          margin-bottom: 0;
        }

        .saved-pocket-create-trigger {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 13px;
          color: inherit;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 750;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: transparent;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-create-trigger:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .saved-pocket-create label,
        .saved-pocket-rename label,
        .saved-pocket-item-actions label {
          display: block;
          margin-bottom: 6px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 750;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .saved-pocket-create > div {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
        }

        .saved-pocket-create {
          max-width: 680px;
          margin-top: 18px;
          padding: 16px;
          background: var(--paper-raised, #f4f1e9);
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-create input,
        .saved-pocket-create button,
        .saved-pocket-rename input,
        .saved-pocket-rename button,
        .saved-pocket-item-actions select,
        .saved-pocket-item-actions button {
          min-height: 46px;
          border-radius: 0;
          font: inherit;
        }

        .saved-pocket-create input {
          min-width: 0;
          padding: 0 13px;
          color: inherit;
          background: transparent;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
          border-right: 0;
        }

        .saved-pocket-create button {
          padding: 0 16px;
          color: var(--paper, #f4f1e9);
          font-size: 0.7rem;
          font-weight: 780;
          background: var(--ink, #11110f);
          border: 1px solid var(--ink, #11110f);
        }

        .saved-pocket-error {
          margin: 8px 0 0;
          color: #c4332b;
          font-size: 0.8125rem;
        }

        .saved-pocket-list-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-self: center;
        }

        .saved-pocket-list-actions button {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          gap: 7px;
          padding: 0 12px;
          color: inherit;
          font-size: 0.7rem;
          font-weight: 700;
          background: transparent;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-list-actions button:last-child {
          color: #c4332b;
        }

        .saved-pocket-delete-confirmation {
          display: grid;
          gap: 10px;
          grid-column: 1 / -1;
          width: 100%;
          padding: 13px;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-delete-confirmation p {
          margin: 0;
          color: var(--muted, #626057);
          font-size: 0.72rem;
          line-height: 1.45;
        }

        .saved-pocket-delete-confirmation > div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .saved-pocket-delete-confirmation button {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          gap: 7px;
          padding: 0 13px;
          color: inherit;
          font-size: 0.7rem;
          font-weight: 750;
          background: transparent;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-delete-confirmation button:first-child {
          color: var(--paper, #f4f1e9);
          background: var(--ink, #11110f);
          border-color: var(--ink, #11110f);
        }

        .saved-pocket-rename {
          grid-column: 1 / -1;
          width: 100%;
        }

        .saved-pocket-rename > div {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 46px 46px;
        }

        .saved-pocket-rename input {
          min-width: 0;
          padding: 0 13px;
          color: inherit;
          background: transparent;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-rename button {
          display: grid;
          place-items: center;
          color: var(--paper, #f4f1e9);
          background: var(--ink, #11110f);
          border: 1px solid var(--ink, #11110f);
        }

        .saved-pocket-rename button:last-child {
          color: inherit;
          background: transparent;
          border-color: var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-list-tabs {
          display: flex;
          gap: 8px;
          margin: 22px -18px 0;
          padding: 0 18px 8px;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scroll-snap-type: x proximity;
          scrollbar-width: none;
        }

        .saved-pocket-sheet--page .saved-pocket-list-tabs {
          margin-inline: calc(-1 * var(--mobile-gutter, 22px));
          padding-inline: var(--mobile-gutter, 22px);
        }

        .saved-pocket-list-tabs::after {
          content: "";
          flex: 0 0 18px;
        }

        .saved-pocket-list-tabs::-webkit-scrollbar {
          display: none;
        }

        .saved-pocket-list-tabs button {
          display: grid;
          flex: 0 0 min(64vw, 230px);
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 16px;
          min-height: 94px;
          padding: 14px;
          color: inherit;
          text-align: left;
          background: var(--paper-raised, #f4f1e9);
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
          scroll-snap-align: start;
        }

        .saved-pocket-list-tabs button[aria-pressed="true"] {
          color: var(--on-signal, #11110f);
          background: var(--signal, #ff4f1f);
          border-color: var(--signal, #ff4f1f);
        }

        .saved-pocket-list-tab-copy {
          display: grid;
          min-width: 0;
          align-content: space-between;
          gap: 10px;
        }

        .saved-pocket-list-tab-copy strong {
          overflow-wrap: anywhere;
          font-family: var(--story-font), Georgia, serif;
          font-size: 1.25rem;
          font-weight: 500;
          letter-spacing: var(--story-spacing, -0.035em);
          line-height: 0.95;
        }

        .saved-pocket-list-tab-copy small {
          color: var(--muted, #626057);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .saved-pocket-list-tabs button[aria-pressed="true"] small {
          color: color-mix(in srgb, var(--on-signal, #11110f) 70%, transparent);
        }

        .saved-pocket-list-tabs button > b {
          align-self: start;
          font-family: var(--font-condensed), sans-serif;
          font-size: 2.5rem;
          font-weight: 680;
          letter-spacing: -0.07em;
          line-height: 0.8;
        }

        .saved-pocket-list-manager {
          display: grid;
          gap: 16px;
          margin-top: 10px;
          padding: 18px 0;
          border-top: 1px solid var(--line, rgba(17, 17, 15, 0.2));
          border-bottom: 1px solid var(--line, rgba(17, 17, 15, 0.2));
        }

        .saved-pocket-list-manager__copy {
          min-width: 0;
        }

        .saved-pocket-list-manager__copy > p {
          margin: 0 0 8px;
          color: var(--signal, #ff4f1f);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 750;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .saved-pocket-list-manager__copy h4 {
          margin: 0;
          overflow-wrap: anywhere;
          font-family: var(--story-font), Georgia, serif;
          font-size: clamp(2rem, 10vw, 3.2rem);
          font-weight: 500;
          letter-spacing: var(--story-spacing, -0.04em);
          line-height: 0.92;
        }

        .saved-pocket-list-manager__copy > span {
          display: block;
          margin-top: 9px;
          color: var(--muted, #626057);
          font-size: 0.8125rem;
        }

        .saved-pocket-delete-list {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 44px;
          margin-top: 8px;
          padding: 0;
          color: var(--muted, #626057);
          font-size: 0.7rem;
          font-weight: 700;
          background: transparent;
          border: 0;
        }

        .saved-pocket-items {
          display: grid;
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid var(--line, rgba(17, 17, 15, 0.2));
        }

        .saved-pocket-items li {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr);
          gap: 11px;
          padding: 18px 0;
          border-bottom: 1px solid var(--line, rgba(17, 17, 15, 0.2));
        }

        .saved-pocket-item-icon {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border: 1px solid currentColor;
        }

        .saved-pocket-item-copy {
          min-width: 0;
        }

        .saved-pocket-item-copy h4 {
          margin: 0;
          font-family: var(--story-font), Georgia, serif;
          font-size: clamp(1.55rem, 7.5vw, 2.45rem);
          font-weight: 500;
          letter-spacing: var(--story-spacing, -0.04em);
          line-height: 0.96;
        }

        .saved-pocket-item-copy > span {
          display: block;
          margin-top: 9px;
          color: var(--muted, #626057);
          font-size: 0.8125rem;
          line-height: 1.4;
        }

        .saved-pocket-item-map {
          display: inline-flex;
          min-width: 0;
          min-height: 44px;
          align-items: center;
          gap: 7px;
          padding-block: 8px;
          color: inherit;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          line-height: 1.4;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
        }

        .saved-pocket-item-map svg {
          flex: 0 0 auto;
        }

        .saved-pocket-item-map span {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .saved-pocket-item-actions {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 8px;
          margin-left: 47px;
        }

        .saved-pocket-item-actions label {
          grid-column: 1 / -1;
          margin-bottom: -2px;
        }

        .saved-pocket-item-actions select {
          min-width: 0;
          padding: 0 34px 0 10px;
          color: inherit;
          background: transparent;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-item-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 11px;
          color: inherit;
          font-size: 0.75rem;
          font-weight: 700;
          background: transparent;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.25));
        }

        .saved-pocket-empty {
          display: grid;
          min-height: 240px;
          place-items: center;
          align-content: center;
          padding: 28px;
          text-align: center;
          border: 1px solid var(--line, rgba(17, 17, 15, 0.2));
        }

        .saved-pocket-empty h4 {
          margin: 14px 0 7px;
          font-family: var(--story-font), Georgia, serif;
          font-size: 1.8rem;
          font-weight: 500;
          letter-spacing: -0.04em;
        }

        .saved-pocket-empty p {
          max-width: 34ch;
          margin: 0;
          color: var(--muted, #626057);
          font-size: 0.72rem;
          line-height: 1.5;
        }

        button,
        select {
          cursor: pointer;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        .saved-pocket-sheet:focus-visible {
          outline: 3px solid var(--signal, #ff4f1f);
          outline-offset: 2px;
        }

        @media (max-width: 359px) {
          .saved-pocket-header--page {
            min-height: 230px;
          }

          .saved-pocket-header--page h2 {
            max-width: 8ch;
            font-size: 3.35rem;
            line-height: 0.86;
          }

          .saved-pocket-list-tabs {
            margin-inline: calc(-1 * var(--mobile-gutter, 22px));
            padding-inline: 24px;
          }
        }

        @media (min-width: 760px) {
          .saved-pocket-page {
            padding: 86px 36px 110px;
          }

          .saved-pocket-backdrop {
            align-items: stretch;
            justify-content: flex-end;
          }

          .saved-pocket-sheet {
            max-width: 620px;
            max-height: none;
            padding: 34px;
            border-top: 0;
            border-right: 0;
            border-bottom: 0;
          }

          .saved-pocket-sheet.saved-pocket-sheet--page {
            max-width: none;
            max-height: none;
            padding: 0;
            border: 0;
          }

          .saved-pocket-header--page {
            align-items: flex-start;
            min-height: clamp(260px, 29svh, 320px);
          }

          .saved-pocket-header--page h2 {
            font-size: clamp(5.6rem, 9vw, 9rem);
          }

          .saved-pocket-sheet--page .saved-pocket-lists,
          .saved-pocket-sheet--page .saved-pocket-content {
            padding-top: 38px;
            padding-bottom: 56px;
          }

          .saved-pocket-sheet--page .saved-pocket-create {
            max-width: 680px;
          }

          .saved-pocket-sheet--page .saved-pocket-list-tabs {
            margin-inline: -36px;
            padding-inline: 36px;
          }

          .saved-pocket-list-manager {
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: end;
          }

          .saved-pocket-list-manager .saved-pocket-rename,
          .saved-pocket-list-manager .saved-pocket-delete-confirmation {
            grid-column: 1 / -1;
            max-width: 680px;
          }

          .saved-pocket-list-tabs {
            margin-right: -34px;
            margin-left: -34px;
            padding-right: 34px;
            padding-left: 34px;
          }

          .saved-pocket-items li {
            grid-template-columns: 38px minmax(0, 1fr) minmax(210px, 0.55fr);
            align-items: center;
          }

          .saved-pocket-item-actions {
            grid-column: 3;
            margin-left: 0;
          }
        }

        @media (min-width: 1180px) {
          .saved-pocket-page {
            padding-right: 56px;
            padding-left: 56px;
          }

          .saved-pocket-header--page {
            min-height: clamp(280px, 28svh, 340px);
          }

          .saved-pocket-sheet--page .saved-pocket-list-tabs {
            margin-inline: -56px;
            padding-inline: 56px;
          }

          .saved-pocket-sheet--page .saved-pocket-items {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1px;
            background: var(--line, rgba(17, 17, 15, 0.2));
            border: 1px solid var(--line, rgba(17, 17, 15, 0.2));
          }

          .saved-pocket-sheet--page .saved-pocket-items li {
            grid-template-columns: 38px minmax(0, 1fr);
            align-content: start;
            min-height: 290px;
            padding: 22px;
            background: var(--paper-raised, #f4f1e9);
            border-bottom: 0;
          }

          .saved-pocket-sheet--page .saved-pocket-item-actions {
            grid-column: 1 / -1;
            margin: auto 0 0 49px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .saved-pocket-sheet {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </div>
  );
}
