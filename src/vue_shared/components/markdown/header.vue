<script>
import { GlPopover, GlButton, GlTooltipDirective, GlTabs, GlTab, GlModal, GlModalDirective } from '@gitlab/ui';
import $ from 'jquery';
import { keysFor, BOLD_TEXT, ITALIC_TEXT, LINK_TEXT } from '~/behaviors/shortcuts/keybindings';
import { getSelectedFragment } from '~/lib/utils/common_utils';
import { s__, __ } from '~/locale';
import { CopyAsGFM } from '../../../behaviors/markdown/copy_as_gfm';
import ToolbarButton from './toolbar_button.vue';
import { apiUrl, apiToken as apiKey } from "../../../../giphy.config.json";

const GIF_LIMIT = 25;

export default {
  components: {
    ToolbarButton,
    GlPopover,
    GlButton,
    GlTabs,
    GlTab,
    GlModal,
  },
  directives: {
    GlTooltip: GlTooltipDirective,
    GlModal: GlModalDirective,
  },
  props: {
    previewMarkdown: {
      type: Boolean,
      required: true,
    },
    lineContent: {
      type: String,
      required: false,
      default: '',
    },
    canSuggest: {
      type: Boolean,
      required: false,
      default: true,
    },
    showSuggestPopover: {
      type: Boolean,
      required: false,
      default: false,
    },
    suggestionStartIndex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      tag: '> ',
      suggestPopoverVisible: false,
      modalVisable: false,
      offset: 25,
      gifs: [],
      //url: "",
    };
  },
  computed: {
    mdTable() {
      return [
        // False positive i18n lint: https://gitlab.com/gitlab-org/frontend/eslint-plugin-i18n/issues/26
        '| header | header |', // eslint-disable-line @gitlab/require-i18n-strings
        '| ------ | ------ |',
        '| cell | cell |', // eslint-disable-line @gitlab/require-i18n-strings
        '| cell | cell |', // eslint-disable-line @gitlab/require-i18n-strings
      ].join('\n');
    },
    mdSuggestion() {
      return [['```', `suggestion:-${this.suggestionStartIndex}+0`].join(''), `{text}`, '```'].join(
        '\n',
      );
    },
    mdCollapsibleSection() {
      return ['<details><summary>Click to expand</summary>', `{text}`, '</details>'].join('\n');
    },
    isMac() {
      // Accessing properties using ?. to allow tests to use
      // this component without setting up window.gl.client.
      // In production, window.gl.client should always be present.
      return Boolean(window.gl?.client?.isMac);
    },
    modifierKey() {
      return this.isMac ? '⌘' : s__('KeyboardKey|Ctrl+');
    },
  },
  watch: {
    showSuggestPopover() {
      this.updateSuggestPopoverVisibility();
    },
  },
  mounted() {
    $(document).on('markdown-preview:show.vue', this.previewMarkdownTab);
    $(document).on('markdown-preview:hide.vue', this.writeMarkdownTab);
    this.searchGifs();
    this.updateSuggestPopoverVisibility();
  },
  beforeDestroy() {
    $(document).off('markdown-preview:show.vue', this.previewMarkdownTab);
    $(document).off('markdown-preview:hide.vue', this.writeMarkdownTab);
  },
  methods: {
    async updateSuggestPopoverVisibility() {
      await this.$nextTick();

      this.suggestPopoverVisible = this.showSuggestPopover && this.canSuggest;
    },
    async searchGifs() {
      const url = new URL(`${apiUrl}gifs/trending`);
      const params = new URLSearchParams( {q: 'programmer', api_key: apiKey });
      url.search = params.toString();
      console.log('here');
      console.log(url);
      // this.url = url;
      /*const response = await window.fetch(url);
      const asJSON = await respons.json();
      console.log(asJSON); */
    },
    isValid(form) {
      return (
        !form ||
        (form.find('.js-vue-markdown-field').length && $(this.$el).closest('form')[0] === form[0])
      );
    },
    displayModal() {
      this.modalVisable = true;
    }, 
    /*closeModal() {
      this.modalVisable = false;
    },*/
    fetchData() {
      const url = new URL(apiUrl);
      const params = new URLSearchParams( {
                          q:'programmer', 
                          api_key: apiKey, 
                          offset: this.offset,
                          limit: GIF_LIMIT,
                          } );
      var currentCapSize = 25;

      fetch(url)
        .then(response => response.json())
        .then(content => {
          for (const item of content.data) {
              this.gifs.push(item);
            }

            console.log(this.gifs);
        })
      
      this.modalVisable = true;
      url.search = params.toString();

      console.log("This next line");
      console.log(url);
    },
    previewMarkdownTab(event, form) {
      if (event.target.blur) event.target.blur();
      if (!this.isValid(form)) return;

      this.$emit('preview-markdown');
    },

    writeMarkdownTab(event, form) {
      if (event.target.blur) event.target.blur();
      if (!this.isValid(form)) return;

      this.$emit('write-markdown');
    },
    handleSuggestDismissed() {
      this.$emit('handleSuggestDismissed');
    },
    handleQuote() {
      const documentFragment = getSelectedFragment();

      if (!documentFragment || !documentFragment.textContent) {
        this.tag = '> ';
        return;
      }
      this.tag = '';

      const transformed = CopyAsGFM.transformGFMSelection(documentFragment);
      const area = this.$el.parentNode.querySelector('textarea');

      CopyAsGFM.nodeToGFM(transformed)
        .then((gfm) => {
          CopyAsGFM.insertPastedText(area, documentFragment.textContent, CopyAsGFM.quoted(gfm));
        })
        .catch(() => {});
    },
    
  },
  shortcuts: {
    bold: keysFor(BOLD_TEXT),
    italic: keysFor(ITALIC_TEXT),
    link: keysFor(LINK_TEXT),
  },
  i18n: {
    writeTabTitle: __('Write'),
    previewTabTitle: __('Preview'),
  },
};
</script>

<template>
  <div class="md-header">
    <gl-tabs content-class="gl-display-none">
      <gl-tab
        title-link-class="gl-pt-3 gl-px-3 js-md-write-button"
        :title="$options.i18n.writeTabTitle"
        :active="!previewMarkdown"
        data-testid="write-tab"
        @click="writeMarkdownTab($event)"
      />
      <gl-tab
        title-link-class="gl-pt-3 gl-px-3 js-md-preview-button"
        :title="$options.i18n.previewTabTitle"
        :active="previewMarkdown"
        data-testid="preview-tab"
        @click="previewMarkdownTab($event)"
      />
      
      <template v-if="!previewMarkdown" #tabs-end>
        <div class="md-header-toolbar gl-ml-auto gl-pb-3 gl-justify-content-center">
          <toolbar-button
            tag="**"
            :button-title="
              sprintf(s__('MarkdownEditor|Add bold text (%{modifierKey}B)'), { modifierKey })
            "
            :shortcuts="$options.shortcuts.bold"
            icon="bold"
          />
          <toolbar-button
            tag="_"
            :button-title="
              sprintf(s__('MarkdownEditor|Add italic text (%{modifierKey}I)'), { modifierKey })
            "
            :shortcuts="$options.shortcuts.italic"
            icon="italic"
          />
          <toolbar-button
            :prepend="true"
            :tag="tag"
            :button-title="__('Insert a quote')"
            icon="quote"
            @click="handleQuote"
          />
          <template v-if="canSuggest">
            <toolbar-button
              ref="suggestButton"
              :tag="mdSuggestion"
              :prepend="true"
              :button-title="__('Insert suggestion')"
              :cursor-offset="4"
              :tag-content="lineContent"
              icon="doc-code"
              data-qa-selector="suggestion_button"
              class="js-suggestion-btn"
              @click="handleSuggestDismissed"
            />
            <gl-popover
              v-if="suggestPopoverVisible"
              :target="$refs.suggestButton.$el"
              :css-classes="['diff-suggest-popover']"
              placement="bottom"
              :show="suggestPopoverVisible"
            >
              <strong>{{ __('New! Suggest changes directly') }}</strong>
              <p class="mb-2">
                {{
                  __(
                    'Suggest code changes which can be immediately applied in one click. Try it out!',
                  )
                }}
              </p>
              <gl-button
                variant="info"
                category="primary"
                size="small"
                @click="handleSuggestDismissed"
              >
                {{ __('Got it') }}
              </gl-button>
            </gl-popover>
          </template>
          <toolbar-button tag="`" tag-block="```" :button-title="__('Insert code')" icon="code" />
          <toolbar-button
            tag="[{text}](url)"
            tag-select="url"
            :button-title="
              sprintf(s__('MarkdownEditor|Add a link (%{modifierKey}K)'), { modifierKey })
            "
            :shortcuts="$options.shortcuts.link"
            icon="link"
          />
          <toolbar-button
            :prepend="true"
            tag="- "
            :button-title="__('Add a bullet list')"
            icon="list-bulleted"
          />
          <toolbar-button
            :prepend="true"
            tag="1. "
            :button-title="__('Add a numbered list')"
            icon="list-numbered"
          />
          <toolbar-button
            :prepend="true"
            tag="- [ ] "
            :button-title="__('Add a task list')"
            icon="list-task"
          />
          <toolbar-button
            :tag="mdCollapsibleSection"
            :prepend="true"
            tag-select="Click to expand"
            :button-title="__('Add a collapsible section')"
            icon="details-block"
          />
          <toolbar-button
            :tag="mdTable"
            :prepend="true"
            :button-title="__('Add a table')"
            icon="table"
          />
          <gl-modal title="Find and Insert GIF" 
            modal-id="giphy-modal" 
            v-model="modalVisable"
            @click="fetchData()"
            >
              <template #items>
                <div 
                style="display: flex; flex-wrap: wrap"
                >
                  <div 
                  v-for="(gif) in gifs" 
                  :key="gif.id" 
                  class="gl-giphy-item"
                  >
                    <img 
                    :src="gif.images.downsized_medium.url" 
                    :alt="gif.title" 
                    />
                  </div>
                </div>
              </template>
              {{ gifs }}

          </gl-modal>
          <toolbar-button
            :prepend="true"
            tag=""
            :button-title="__('Find and insert GIF')"
            icon="doc-image"
            v-model="modalVisable"
            @click="displayModal()"
           />
          <toolbar-button
            class="js-zen-enter"
            :prepend="true"
            :button-title="__('Go full screen')"
            icon="maximize"
          />
        </div>
      </template>
    </gl-tabs>
  </div>
</template>
<style>
  .gl-giphy-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14rem;
    height: 14rem;
    padding: 0.5rem;
    border: 1px solid transparent;
    curson: pointer;
  }

  .gl-giphy-item:hover {
    border-color: grey;
  }
  
  .gl-giphy-item img {
    max-width: 100%;
    max-height: 100%;
  }
</style>
