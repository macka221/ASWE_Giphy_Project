import { createServer } from "miragejs";
import { joinPaths } from "~/lib/utils/url_utility";
import discussionResponse from "../www/gitlab-org/gitlab/-/issues/17379/discussions.json";
import emojisResponse from "../www/-/emojis/2/emojis.json";
import notesResponse from "../www/gitlab-org/gitlab/noteable/issue/24651689/notes.json";
import { renderMarkdown } from "../notes/utils";
import giphyConfig from "../../giphy.config.json";
import { uniqueId } from "lodash";

const createNote = ({ noteable_type, note, noteable_id, currentUserData }) => {
  const discussionId = uniqueId("sandbox-discussion-");
  const timestamp = new Date().toISOString();
  const noteableId = uniqueId() + 10000;

  return {
    attachment: null,
    author: currentUserData,
    attachment: null,
    award_emoji: [],
    base_discussion: {
      id: discussionId,
      reply_id: discussionId,
      project_id: 278964,
      commit_id: "",
      confidential: false,
    },
    commands_changes: {},
    confidential: false,
    created_at: timestamp,
    current_user: {
      can_edit: true,
      can_award_emoji: true,
      can_resolve: false,
      can_resolve_discussion: false,
    },
    discussion_id: discussionId,
    emoji_awardable: true,
    human_access: null,
    id: String(noteableId),
    is_contributor: true,
    is_noteable_author: false,
    note: note,
    note_html: renderMarkdown(note),
    noteable_id: noteableId,
    noteable_iid: noteableId,
    noteable_note_url: "",
    noteable_type,
    path: `${noteable_id}`,
    project_name: "GitLab",
    report_abuse_path:
      "/-/abuse_reports/new?ref_url=https%3A%2F%2Fgitlab.com%2Fgitlab-org%2Fgitlab%2F-%2Fissues%2F17379%23note_214958912&user_id=419655",
    resolvable: false,
    resolved: false,
    resolved_by: null,
    suggestions: [],
    system: false,
    toggle_award_path: "/gitlab-org/gitlab/notes/214958912/toggle_award_emoji",
    type: null,
    updated_at: timestamp,
  };
};

export const setupFakeServer = () => {
  const el = document.getElementById("js-vue-notes");
  const currentUserData = JSON.parse(el.dataset.currentUserData);
  const { discussionsPath, notesPath } = JSON.parse(el.dataset.notesData);

  createServer({
    routes() {
      const extraNotes = [];

      this.get(discussionsPath, () => discussionResponse);
      this.get("/-/emojis/2/emojis.json", () => emojisResponse);
      this.get("/gitlab-org/gitlab/noteable/issue/24651689/notes", () => ({
        ...notesResponse,
        notes: [...notesResponse.notes, ...extraNotes],
      }));
      this.post("/gitlab-org/gitlab/preview_markdown", (schema, request) => {
        const { text } = JSON.parse(request.requestBody);
        const body = renderMarkdown(text);

        return {
          body,
          references: {
            users: [],
            suggestions: [],
            commands: "",
          },
        };
      });
      this.post("/gitlab-org/gitlab/notes", (schema, request) => {
        const { note } = JSON.parse(request.requestBody);
        extraNotes.push(
          createNote({
            ...note,
            currentUserData,
          })
        );

        return {};
      });

      this.passthrough(joinPaths(giphyConfig.apiUrl, "**"));
    },
  });
};
