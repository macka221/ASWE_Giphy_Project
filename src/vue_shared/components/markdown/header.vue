<script>
import { GlPopover, GlButton, GlTooltipDirective, GlTabs, GlTab, GlModal, 
          GlModalDirective, GlInfiniteScroll, GlSearchBoxByType } from '@gitlab/ui';
import $ from 'jquery';
import { keysFor, BOLD_TEXT, ITALIC_TEXT, LINK_TEXT } from '~/behaviors/shortcuts/keybindings';
import { getSelectedFragment } from '~/lib/utils/common_utils';
import { s__, __ } from '~/locale';
import { CopyAsGFM } from '../../../behaviors/markdown/copy_as_gfm';
import ToolbarButton from './toolbar_button.vue';
import { apiUrl, apiToken as apiKey } from "../../../../giphy.config.json";
import SearchBox from './SearchBox.vue';
import { debounce } from "lodash";

const GIF_LIMIT = 25;
const MAX_GIFS = 4999;

export default {
  components: {
    ToolbarButton,
    GlInfiniteScroll,
    GlSearchBoxByType,
    GlPopover,
    GlButton,
    GlTabs,
    GlTab,
    GlModal,
    SearchBox,
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
      modalVisible: false,
      offset: 0,
      gifs: [],
      searchedGifs: [],
      searchTerm: "",
      gifMax: MAX_GIFS,
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
      return this.isMac ? '???' : s__('KeyboardKey|Ctrl+');
    },
    gifList: function() {
      // Should keep track of everytime the list
      // increases in size and displays accordingly
      return this.gifs.slice(0, this.offset);
    },
  },
  watch: {
    showSuggestPopover() {
      this.updateSuggestPopoverVisibility();
    },
    searchTerm(newSearch, oldSearch) {
      console.log("Value of oldSearch->", oldSearch);
      console.log("Value of newSearch-> ", newSearch);
      if (newSearch.length > 0) {
        console.log("searching matching gifs...");
        this.searchGifs();
      }
      else {
        console.log("resetingGifs");
        this.resetGIFsArray();
        this.fetchData();
      }
    }
  },
  mounted() {
    $(document).on('markdown-preview:show.vue', this.previewMarkdownTab);
    $(document).on('markdown-preview:hide.vue', this.writeMarkdownTab);
    this.updateSuggestPopoverVisibility();
    this.debouncedSearch = debounce(this.searchGifs, 250);
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
      const url = new URL(`${apiUrl}gifs/search?&q=${this.searchTerm}&limit=100`);
      const params = new URLSearchParams({
                    q: "programmer",
                    api_key: apiKey,
                    limit: gifMax,
      });

      url.search = params.toString();

      const response = await window.fetch(url);
      const asJSON = await response.json()
        .then(content => {
          this.gifs = content.data;
        });

      console.log(asJSON);
    },
    resetGIFsArray(){
      this.gifs = [];
    },
    isValid(form) {
      return (
        !form ||
        (form.find('.js-vue-markdown-field').length && $(this.$el).closest('form')[0] === form[0])
      );
    }, 
    fetchData() {
      console.log("Fectching API data...");
      const url = new URL(`${apiUrl}gifs/trending`);
      const params = new URLSearchParams( {
                          q:'programmer', 
                          api_key: apiKey, 
                          offset: this.offset,
                          // Limits amount of gifs in modal
                          limit: this.gifMax,
                          } );
      url.search = params.toString();

      fetch(url)
        .then(response => response.json())
        .then(content => {
            console.log(content.data);
            console.log("META", content.meta);
            this.gifs = this.gifs.concat(content.data);

            // Move to next page for whenever we call fetchData next
            this.fetchMore();
        })
        .catch(err => {
          console.error(err);
        });
      
      console.log("This next line");
      console.log(url);
    },
    displayModal() {
      this.modalVisible = true;
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
    onModalShown() {
      if (!this.gifs.length) {
        this.fetchData();
      }
    },
    fetchMore() {
      this.offset += 25;
    }    
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
            v-model="modalVisible"
            @shown="onModalShown"
            >
            <gl-search-box-by-type 
                  v-model.trim="searchTerm"
                  >
            </gl-search-box-by-type>
            <gl-infinite-scroll
           :total-items="gifMax"
           :fetched-items="offset"
           @bottomReached="fetchData">
              <div 
              style="display: flex; flex-wrap: wrap"
              >
                <div 
                v-for="gif in gifList" 
                :key="gif.id" 
                class="gl-giphy-item"
                > 
                  <img 
                  :src="gif.images.downsized_medium.url" 
                  :alt="gif.title" 
                  />
                </div>
              </div>
            </gl-infinite-scroll>
          </gl-modal>
          <toolbar-button
            :prepend="true"
            tag=""
            :button-title="__('Find and insert GIF')"
            icon="doc-image"
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
    cursor: pointer;
  }

  .gl-giphy-item:hover {
    border-color: grey;
  }
  
  .gl-giphy-item img {
    max-width: 100%;
    max-height: 100%;
  }
</style>
