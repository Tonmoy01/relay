import { FormEvent } from "react";
import { User } from "@/lib/api";
import {
  Avatar,
  eyebrowClass,
  Field,
  IconButton,
  inputClass,
  primaryButton,
} from "./shared";

type Props = {
  searchQuery: string;
  searchResults: User[];
  isSearching: boolean;
  isCreating: boolean;
  modalError: string;
  selectedParticipants: User[];
  groupName: string;
  onSearchChange: (value: string) => void;
  onStartDirect: (user: User) => void;
  onToggleParticipant: (user: User) => void;
  onGroupNameChange: (value: string) => void;
  onCreateGroup: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};
const backdrop =
  "fixed inset-0 z-10 grid place-items-center bg-[#18241f66] p-5";
const modal =
  "grid max-h-[90vh] w-[min(100%,440px)] gap-4.25 overflow-auto rounded-[18px] border border-line bg-white p-6.25 shadow-[0_24px_70px_#18241f38]";
const result =
  "flex items-center gap-2.5 border-0 border-b border-line bg-white p-2.5 text-left text-ink last:border-b-0 hover:bg-[#f3f9f2]";

export function NewConversationModal({
  searchQuery,
  searchResults,
  isSearching,
  isCreating,
  modalError,
  onSearchChange,
  onStartDirect,
  onClose,
}: Props) {
  return (
    <div
      className={backdrop}
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <div
        className={modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-conversation-title"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className={eyebrowClass}>Start something new</p>
            <h2 id="new-conversation-title">New conversation</h2>
          </div>
          <IconButton onClick={onClose} aria-label="Close">
            ×
          </IconButton>
        </div>
        <Field label="Search by name or phone">
          <input
            className={inputClass}
            autoFocus
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search people…"
          />
        </Field>
        <SearchResults
          results={searchResults}
          query={searchQuery}
          isSearching={isSearching}
          onSelect={onStartDirect}
          disabled={isCreating}
        />
        {modalError ? (
          <p
            className="m-0 text-[.74rem] leading-normal text-[#a43b2c]"
            role="alert"
          >
            {modalError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function GroupModal({
  searchQuery,
  searchResults,
  isCreating,
  modalError,
  selectedParticipants,
  groupName,
  onSearchChange,
  onToggleParticipant,
  onGroupNameChange,
  onCreateGroup,
  onClose,
}: Props) {
  return (
    <div
      className={backdrop}
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <form
        className={modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-title"
        onSubmit={onCreateGroup}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className={eyebrowClass}>Bring people together</p>
            <h2 id="group-title">Create a group</h2>
          </div>
          <IconButton type="button" onClick={onClose} aria-label="Close">
            ×
          </IconButton>
        </div>
        <Field label="Group name">
          <input
            className={inputClass}
            autoFocus
            required
            value={groupName}
            onChange={(event) => onGroupNameChange(event.target.value)}
            placeholder="Project team"
          />
        </Field>
        <Field label="Find participants">
          <input
            className={inputClass}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search people…"
          />
        </Field>
        <div className="flex flex-wrap gap-1.5">
          {selectedParticipants.map((participant) => (
            <button
              className="rounded-full border-0 bg-[#e7f4e8] px-2.25 py-1.75 text-[.68rem] text-relay-deep"
              type="button"
              key={participant._id}
              onClick={() => onToggleParticipant(participant)}
            >
              {participant.name} ×
            </button>
          ))}
        </div>
        <SearchResults
          results={searchResults}
          query={searchQuery}
          onSelect={onToggleParticipant}
          selected={selectedParticipants}
          compact
        />
        <p className="m-0 text-[.71rem] leading-normal text-muted">
          Choose at least two participants, plus you.
        </p>
        {modalError ? (
          <p
            className="m-0 text-[.74rem] leading-normal text-[#a43b2c]"
            role="alert"
          >
            {modalError}
          </p>
        ) : null}
        <button className={`${primaryButton} w-full`} disabled={isCreating}>
          {isCreating ? "Creating…" : "Create group"}
        </button>
      </form>
    </div>
  );
}

function SearchResults({
  results: users,
  query,
  isSearching,
  onSelect,
  disabled = false,
  selected = [],
  compact = false,
}: {
  results: User[];
  query: string;
  isSearching?: boolean;
  onSelect: (user: User) => void;
  disabled?: boolean;
  selected?: User[];
  compact?: boolean;
}) {
  return (
    <div
      className={`${
        compact ? "max-h-42.5" : "max-h-57.5"
      } grid overflow-auto rounded-[10px] border border-line`}
    >
      {isSearching ? (
        <p className="m-0 p-2.5 text-[.71rem] leading-normal text-muted">
          Searching…
        </p>
      ) : query.trim().length < 2 && !compact ? (
        <p className="m-0 p-2.5 text-[.71rem] leading-normal text-muted">
          Type at least two characters.
        </p>
      ) : users.length ? (
        users.map((user) => {
          const isSelected = selected.some((item) => item._id === user._id);
          return (
            <button
              className={`${result} ${isSelected ? "bg-[#f3f9f2]" : ""}`}
              type="button"
              key={user._id}
              onClick={() => onSelect(user)}
              disabled={disabled}
            >
              <Avatar name={user.name} small />
              <span className="flex-1">
                <strong className="block text-[.75rem]">{user.name}</strong>
                <small className="mt-0.75 block text-[.65rem] text-muted">
                  {user.phone}
                </small>
              </span>
              <span className="font-bold text-relay-deep">
                {compact && isSelected ? "✓" : compact ? "+" : "→"}
              </span>
            </button>
          );
        })
      ) : (
        <p className="m-0 p-2.5 text-[.71rem] leading-normal text-muted">
          No matching users.
        </p>
      )}
    </div>
  );
}
